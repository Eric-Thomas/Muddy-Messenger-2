import database
from models import User, Message
from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import exc
import random
import os
import sys
import crypto
import random


database.init_db()
db_session = database.db_session

app = Flask(__name__)
CORS(app)


class messages:
    if not os.getenv('DB_MASTER_KEY'):
        os.environ['DB_MASTER_KEY'] = str(random.getrandbits(256))
    message_id = 0
    shared_secrets_send = {}
    shared_secrets_receive = {}
    master_key = os.getenv('DB_MASTER_KEY')


@app.route('/user', methods=['POST'])
def user():
    request_user_name = request.get_json().get('user_name')
    request_password = request.get_json().get('password')
    if not request_user_name:  # check that username isn't emtpy
        return jsonify({'status': 400, 'message': 'Invalid request syntax. Send JSON of form {user_name: XXX}'})
    try:
        user = User(request_user_name, request_password)
        db_session.add(user)
        db_session.commit()
        # Successful write to database
        return jsonify({'status': 201, 'message': str(request_user_name) + ' added'})
    except exc.IntegrityError as e:
        db_session().rollback()
        return jsonify({'status': 400, 'message': 'User already exists in db. Usernames must be unique'})


@app.route('/user/<user_name>')
def user_name(user_name):
    like_name = "%{}%".format(user_name)
    query = User.query.filter(User.user_name.like(like_name)).all()
    if not query:  # No users match in db
        return jsonify({'status': 404, 'message':  str(user_name) + ' does not exist'})
    users = []
    for row in query:
        user = {'name': row.user_name, 'password': row.password,
                'public_key': row.public_key}
        users.append(user)
    return jsonify({'status': 200, 'users': users})


@app.route('/users')
def users():
    all_users = User.query.all()
    return jsonify({'status': 200, 'users': [user.user_name for user in all_users]})


@app.route('/send', methods=['POST'])
def send():
    try:
        request_sender = request.get_json().get('sender')
        request_receiver = request.get_json().get('receiver')
        request_message = request.get_json().get('message')
        encryption_type = request.get_json().get('encryption')
        message_id = request.get_json().get('ID')

        shared_secret = messages.shared_secrets_send[message_id]
        key = crypto.encryptAES(shared_secret, messages.master_key)
        message = Message(receiver=request_receiver, sender=request_sender,
                          message=request_message, encryption=encryption_type, key=key)
        db_session.add(message)
        db_session.commit()
        # Delete shared secret from data structure
        del messages.shared_secrets_send[message_id]
        return jsonify({'status': 201, 'message': 'Message Muddied!', 'encryptedMessage': request_message})
    except exc.IntegrityError as e:
        print(e)
        db_session.rollback()
        return jsonify({'status': 403, 'message': 'Foreign Key constraint failed. Make sure both users exist'})
    except Exception as e:
        print(e)
        return jsonify({'status': 400, 'message': 'Write to db failed', 'error': e})


@app.route('/user/<user_name>/messages', methods=['GET'])
def receive(user_name):
    try:
        query = Message.query.filter(Message.receiver == user_name).all()
        db_messages = []
        for row in query:
            time = str(row.time).split()[0]
            # Decrypt key the message was sent with
            key = crypto.decryptAES(row.key, messages.master_key)
            shared_secret = messages.shared_secrets_receive[user_name]
            # Encrypt key the message was sent with, with receiver and server DH
            key = crypto.encryptAES(key, shared_secret).decode("utf-8")
            message = {'sender': row.sender, 'text': row.message,
                       'time': time, 'encryption': row.encryption, 'key': key}
            db_messages.append(message)
        # Delete shared secret from data structure
        del messages.shared_secrets_receive[user_name]
        return jsonify({'status': 200, 'messages': db_messages})
    except Exception as e:
        print(e)
        return jsonify({'status': 400})


@app.route('/authenticate/<username>')
def authenticate(username):
    query = User.query.filter_by(user_name=username).all()
    if not query:  # No users match in db
        return jsonify({'status': 404, 'message':  str(username) + ' does not exist'})
    user = query[0]
    return jsonify({'status': 200, 'user_name': user.user_name, 'password': user.password})

# Does DH Key Exchange with client
@app.route('/dhExchange/<send_or_receive>', methods=['POST'])
def dh_exchange(send_or_receive):

    # Get payload
    g = request.get_json().get('g')
    n = request.get_json().get('n')
    client_public_key = request.get_json().get('client_public_key')
    username = request.get_json().get('username')

    # query user
    query = User.query.filter_by(user_name=username).all()
    if not query:  # No users match in db
        return jsonify({'status': 404, 'message':  str(username) + ' does not exist'})
    user = query[0]

    server_private_key = random.randint(0, 10)
    shared_secret = client_public_key**server_private_key % n

    B = g**server_private_key % n

    if send_or_receive == 'send':
        while(messages.message_id in messages.shared_secrets_send):
            if messages.message_id + 1 == sys.maxsize:
                messages.message_id = 0
            else:
                messages.message_id += 1

        messages.shared_secrets_send[messages.message_id] = shared_secret
        return_id = messages.message_id

    elif send_or_receive == 'receive':
        messages.shared_secrets_receive[username] = shared_secret
        return_id = None

    return jsonify({'status': 200, 'user_name': user.user_name, 'public_key': B, 'ID': return_id})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
