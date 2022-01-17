from flask import Flask, app, render_template, request, jsonify
from dotenv import load_dotenv, find_dotenv
from pymongo import MongoClient
from emailer import send_email
import bcrypt
import secrets
import os

load_dotenv(find_dotenv())
MONGOCLIENT = os.getenv('MONGOCLIENT')

client = MongoClient(MONGOCLIENT)
users = client['users-data']['users']
codes = client['users-data']['codes']

app = Flask(__name__, template_folder='pages')

# ROTA PRINCIPAL

@app.route('/')
def home():
  return render_template('login.html')

# ROTAS DE RENDERIZAÇÃO DE PAGES

@app.route('/login')
def login():
  return render_template('login.html')

@app.route('/logado')
def logado():
  return render_template('pages_final/logado.html')

@app.route('/registrado')
def registrado():
  return render_template('pages_final/registrado.html')

@app.route('/registrar')
def registrar():
  return render_template('registrar.html')

@app.route('/forgot')
def forgot():
  return render_template('forgot/forgot.html')

@app.route('/forgot-final')
def forgot_final():
  return render_template('forgot/forgot-final.html')

# ROTAS De AUTENTICAÇÃO

@app.route('/oauth', methods=['POST'])
def oauth():
  content = request.json

  username = content['username'].lower()
  password = content['password']

  user = users.find_one({'username': username})

  if user is None:
    return jsonify({"code": 204})
  else:
    if bcrypt.checkpw(password.encode('utf8'), user['password']):
      return jsonify({"code": 200})
    else:
      return jsonify({"code": 401})

@app.route('/register', methods=['POST'])
def register():
  content = request.json

  username = content['username']
  password = content['password']

  password_enc = bcrypt.hashpw(password.encode('utf8'), bcrypt.gensalt())

  if not users.find_one({'username': username}):
    users.insert_one({'username': username, 'password': password_enc})
    return jsonify({"code": 200,"redirect": "/login"})
  else:
    return jsonify({"code": 207})

@app.route('/forgot-email', methods=['POST'])
def forgot_email():
  content = request.json

  username = content['username']

  if users.find_one({'username': username}):
    try:
      code = codes.find_one({'username': username})['code']
    except:
      code = secrets.token_urlsafe(16)
      while codes.find_one({'code': code}):
        code = secrets.token_urlsafe(16)
      codes.insert_one({'username': username, 'code': code})

    send_email(username, code)
    return jsonify({"code": '200'})
  else:
    return jsonify({"code": '207'})

@app.route('/recover', methods=['POST'])
def recover():
  content = request.json

  usercode = content['code']
  password = content['password']

  code = codes.find_one({'code': usercode})

  if code is not None:
    if usercode == code['code']:
      password_enc = bcrypt.hashpw(password.encode('utf8'), bcrypt.gensalt())
      users.update_one({'username': code['username']}, {'$set': {'password': password_enc}})
      codes.find_one_and_delete({'code': usercode})
      return jsonify({"code": '200'})
    else:
      return jsonify({"code": '201'})
  else:
    return jsonify({"code": '202'})

app.run()