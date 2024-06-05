const TITLE = "Welcome to our ToDo App!!!";
let currentUser = "";

async function createAccountClicked() {
  let inputEl = document.querySelector("#user-name-input");
  let userName = inputEl.value.trim();

  let inputElPass = document.querySelector("#user-pass-input");
  let userPass = inputElPass.value.trim();

  inputEl.classList.remove("red-border")
  inputElPass.classList.remove("red-border")

  if (!userName) {
    // alert("Username cannot be empty.");
    inputEl.classList.add("red-border")
    if (!userPass) {
      inputElPass.classList.add("red-border")
      return;
    }
    return;
  }

  if (!userPass) {
    inputElPass.classList.add("red-border")
    return;
  }

  let createBtn = document.querySelector("#create-account-btn");
  createBtn.innerText = "Creating Account...";

  const response = await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: userName, pass: userPass }),
  });

  if (response.ok) {
    const result = await response.json();
    console.log(result);
    currentUser = result.id;

    await main();
    displayApp();
    // setTimeout(displayApp, 1000);
  } else {
    alert(`Failed to create account: ${result.error || "Unknown error"}`);
  }
}

async function loginBtnClicked() {
  let inputEl = document.querySelector("#user-name-input");
  let userName = inputEl.value.trim();

  let inputElPass = document.querySelector("#user-pass-input");
  let userPass = inputElPass.value.trim();

  inputEl.classList.remove("red-border")
  inputElPass.classList.remove("red-border")


  if (userName) {
    let loginBtn = document.querySelector("#login-btn");
    loginBtn.innerText = "Logging In...";

    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: userName, pass: userPass }),
    });

    const result = await response.json();

    if (result.ok === true) {
      console.log(result);
      currentUser = result.user.id;
      console.log(currentUser);

      await main();
      displayApp();
      // setTimeout(displayApp, 1000);
    } else {
      inputElPass.classList.add("red-border")
      inputElPass.placeholder="not a valid password"
      loginBtn.innerText = "Login";

      // setTimeout(displayApp, 100);
    }
  } else {
    inputEl.classList.add("red-border")
    inputEl.placeholder="not a valid username"
    loginBtn.innerText = "Login";

  }
}

async function displayApp() {
  let container = document.querySelector(".todo-container");
  container.style.display = "block";

  let welcomeCtr = document.querySelector(".login");
  welcomeCtr.style.display = "none";
  // await main()
  displayTitle();
  displayTasks();
}

function displayTitleTillIndex(index) {
  let subTitle = TITLE.substring(0, index + 1);
  let h1El = document.querySelector("#app-title");
  if (index < TITLE.length - 1) subTitle += "_";
  h1El.innerText = subTitle;
}

function displayTitle() {
  for (let i = 0; i < TITLE.length; i++) {
    setTimeout(function () {
      displayTitleTillIndex(i);
    }, i * 100);
  }
}
