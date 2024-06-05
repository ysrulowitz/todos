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
    const result = await db.oneOrNone("update todoapp.task set status = 'done' where id = ${id} and user_id = ${userId} returning *", {
        id: req.params.id,
        userId: req.body.userId
    })
    if(result){
        res.json({ok: true, result})
    }else{
        res.json({ok: false, error: "no task for current user"})
    }
})

app.delete('/tasks/:id', async (req, res) => {
    const result = await db.oneOrNone("update todoapp.task set deleted_at = now() where id = ${id} and user_id = ${userId} returning *", {
        id: req.params.id,
        userId: req.body.userId
    })
    if(result){
        res.json({ok: true, result})
    }else{
        res.json({ok: false, error: "no task for current user"})
    }
})

app.post('/users', async (req, res) => {
    const results = await db.one('INSERT INTO todoapp.person ( "name", email, pass) VALUES(${name},${email}, ${pass}) returning *',{
       name: req.body.name,
       email: "yidi@gmail.com",
       pass: req.body.pass
    })
    res.json(results)
})

app.post('/login', async (req, res) => {
    const results = await db.manyOrNone('select * from todoapp.person where name = ${name}',{
       name: req.body.name,
    })
    if (results){
        for(let row of results){
            if(row.pass===req.body.pass){
                return res.json({ ok: true, user: row });
            }
        }
        
    }
    res.json({ ok: false });
})

app.get('/userNames',async(req, res)=>{
    const result = await db.manyOrNone('select id, name from todoapp.person')
    res.json(result)
    console.log(result)

})


app.listen('3000', () => {
    console.log('the server is running on port 3000')
})