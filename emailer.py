import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def send_email(email, codigo):
    msg = MIMEMultipart()
    msg['From'] = "<EMAIL AQUI>"
    msg['To'] = email
    msg['Subject'] = "Recuperação de senha"

    message = f'''
Recuperação de conta SLPY

Código: {codigo}

Acesse o link para alterar sua senha
http://localhost:5000/forgot-final


Se não foi você que solicitou a recuperação de senha, por favor ignore este email.

Atenciosamente,
Equipe SLPY
  '''

    msg.attach(MIMEText(message, 'plain'))

    server = smtplib.SMTP('smtp.gmail.com', port=587)

    server.starttls()
    server.login(msg['From'], '<SENHA DO EMAIL AQUI>')
    server.sendmail(msg['From'], msg['To'], msg.as_string())
    server.quit()