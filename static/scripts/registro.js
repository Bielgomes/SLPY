window.onload = () => {

  const modal = new Control()

  const registrarForm = document.getElementById("registrarForm")

  registrarForm.addEventListener("submit", (event) => {
    event.preventDefault()

    let username = document.getElementById("username")
    let password = document.getElementById("password")
    let npassword = document.getElementById("npassword")

    modal.hide()
    username.classList.remove("error")
    password.classList.remove("error")
    npassword.classList.remove("error")

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

    if(npassword.value == "") {
      modal.show("error", "Erro:", "O Campo de confirmação de senha não pode ser vazio")
      npassword.classList.add("error")
      npassword.focus()
      return
    }

    if(password.value !== npassword.value) {
      modal.show("error", "Erro:", "As Senhas não conhecidem")
      password.classList.add("error")
      npassword.classList.add("error")
      password.focus()
      return
    }

    fetch("/register", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: (username.value).toLowerCase(), password: password.value
      })
    }).then((response) => response.json())
    .then((response) => {
      if(response.code == 200) {
        window.location.href = "registrado";
      } else {
        username.classList.add("error")
        modal.show("error", "Erro:", "Esse Email já está sendo utilizado")
      }
    })
  })
}