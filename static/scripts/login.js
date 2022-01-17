
console.log(Control)

window.onload = () => {

  const modal = new Control()

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault()

    let username = document.getElementById("username")
    let password = document.getElementById("password")

    modal.hide()
    username.classList.remove("error")
    password.classList.remove("error")

    if(username.value == "") {
      modal.show("error", "Erro:", "O Campo Email não pode ser vazio")
      username.classList.add("error")
      username.focus()
      return
    }

    if(password.value == "") {
      modal.show("error", "Erro:", "O Campo Senha não pode ser vazio")
      password.classList.add("error")
      password.focus()
      return
    }

    fetch("/oauth", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: (username.value).toLowerCase(), password: password.value
      })
    })
    .then((response) => response.json())
    .then((response) => {
      if(response.code == "200") {
        window.location.href = "logado"
      } else {
        username.classList.add("error")
        password.classList.add("error")
        modal.show("error", "Erro:", "Usuário ou senha incorretos")
      }
    })
    .catch((error)=>{
      console.log(error);
    })
  })
}