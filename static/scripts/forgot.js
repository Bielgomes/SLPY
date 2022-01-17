window.onload = () => {
  const modal = new Control()

  const forgotForm = document.getElementById("forgotForm")

  forgotForm.addEventListener("submit", (event) => {
    event.preventDefault()

    const username = document.getElementById("username")

    modal.hide()
    username.classList.remove("error")

    if(username.value === "") {
      modal.show("error", "Erro:", "O campo Email não pode ser vazio")
      username.classList.add("error")
      username.focus()
      return
    }

    modal.show("processing", "Processando:", "aguarde um momento")

    fetch("/forgot-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: (username.value).toLowerCase()
      })
    }).then((response) => response.json())
    .then((response) => {
      if(response.code == "200") {
        window.location.href = "forgot-final"
      } else {
        username.classList.add("error")
        modal.show("error", "Erro:", "Esse usuário não existe")
      }
    })
  })
}