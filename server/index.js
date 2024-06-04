import 'dotenv/config'
import pgPromise from "pg-promise";
import cors from "cors";
import express from "express";

const pgp = pgPromise()
const db = pgp({
    host: process.env.DB_HOST,
    port: 5432,
    database: 'retool',
    user: 'retool',
    password: process.env.DB_PASSWORD,
    ssl: true
})

const app = express()
app.use(cors())
app.use(express.json())


app.get('/tasks', async (req, res) => {
    const result = await db.manyOrNone('select * from todoapp.task where deleted_at is null')
    res.json(result.map(task => ({ id: task.id, userId: task.user_id, title: task.title, done: task.status !== 'active'})))
})

app.post('/tasks', async (req, res) => {
    const result = await db.one('insert into todoapp.task (title, user_id) values (${title}, ${user_id}) returning *', {
        title: req.body.title,
        user_id: req.body.userId
    })
    console.log('result', result)
    res.json({
        title: result.title,
        done: false,
        id: result.id
    })
})

app.patch('/tasks/:id', async (req, res) => {
    const result = await db.none("update todoapp.task set status = 'done' where id = ${id}", {
        id: req.params.id
    })
    res.json({ok: true})
})

app.delete('/tasks/:id', async (req, res) => {
    await db.none("update todoapp.task set deleted_at = now() where id = ${id}", {
        id: req.params.id
    })
    res.json({ok: true})
})


app.listen('3000', () => {
    console.log('the server is running on port 3000')
})