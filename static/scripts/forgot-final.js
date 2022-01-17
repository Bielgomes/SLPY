window.onload = () => {
  const modal = new Control()

  const forgotForm = document.getElementById("forgotForm")

  modal.show("success", "Sucesso:", "enviamos um email contendo o código de recuperação para seu email", 5000)

  forgotForm.addEventListener("submit", (event) => {
    event.preventDefault()

    const code = document.getElementById("code")
    const password = document.getElementById("password")
    const npassword = document.getElementById("npassword")

    modal.hide()
    code.classList.remove("error")
    password.classList.remove("error")
    npassword.classList.remove("error")

    if(code.value === "") {
      modal.show("error", "Erro:", "O campo de Código não pode ser vazio")
      code.classList.add("error")
      code.focus()
      return
    }

    if(password.value === "") {
      modal.show("error", "Erro:", "O campo Senha não pode ser vazio")
      password.classList.add("error")
      password.focus()
      return
    }

    if(npassword.value === "") {
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

    fetch("/recover", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        code: code.value, 
        password: password.value
      })
    }).then((response) => response.json())
    .then((response) => {
      if(response.code == "200") {
        modal.show("success", "Sucesso:", "Conta recuperada com sucesso")
        setTimeout(() => {
          window.location.href = "/login"
        } , 1500)
      } else {
        code.classList.add("error")
        modal.show("error", "Erro:", "Código de recuperação inválido")
      }
    })
  })
}