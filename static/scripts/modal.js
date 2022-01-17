class Control {
  constructor() {
    this.modal = document.getElementById('modal');
  }

  show(status, title, content, timeout = 3000) {
    this.modal.style.display = 'block';
    document.getElementById('modal-title').innerText = title.toUpperCase();
    document.getElementById('modal-content').innerText = content

    const statusColor = {
      success: "#47B356",
      error: "#C60A39",
      processing: "#08C1FF"
    }

    if (statusColor[status]){
      this.modal.style.backgroundColor = statusColor[status];
    } else {
      this.modal.style.backgroundColor = statusColor[error];
    }

    setTimeout(function () {
      this.modal.style.display = 'none'
    }, timeout);
  }

  hide() {
    this.modal.style.display = 'none'
  }
}