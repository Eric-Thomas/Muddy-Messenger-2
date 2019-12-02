import database
from models import User, Message
from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import exc
import random


database.init_db()
db_session = database.db_session

app = Flask(__name__)
CORS(app)


@app.route('/user', methods=['POST'])
def user():
    request_user_name = request.get_json().get('user_name')
    request_password = request.get_json().get('password')
    if not request_user_name:  # check that username isn't emtpy
        return jsonify({'status': 400, 'message': 'Invalid request syntax. Send JSON of form {user_name: XXX}'})
    try:
        # TODO: Sanitize DB inputs
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
        user = {'name': row.user_name, 'password': row.password, 'public_key': row.public_key}
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
        message = Message(receiver = request_receiver, sender = request_sender, message = request_message, encryption = encryption_type)
        db_session.add(message)
        db_session.commit()
        return jsonify({'status': 201, 'message': 'Message Muddied!', 'encryptedMessage': request_message})
    except exc.IntegrityError as e:
        print(e)
        db_session.rollback()
        return jsonify({'status': 403, 'message': 'Foreign Key constraint failed. Make sure both users exist'})
    except Exception as e:
        print(e)
        return jsonify({'status': 400, 'message': 'Write to db failed'})

@app.route('/user/<user_name>/messages', methods=['GET'])
def receive(user_name):
    try:
        query = Message.query.filter(Message.receiver == user_name).all()
        messages = []
        for row in query:
            time = str(row.time).split()[0]
            message = {'sender': row.sender, 'text': row.message, 'time' : time}
            messages.append(message)
        return jsonify({'status': 200, 'messages': messages})
    except Exception as e:
        print(e)
        return jsonify({'status': 400})

   
@app.route('/authenticate/<username>')
def authenticate(username):
    query = User.query.filter_by(user_name = username).all()
    if not query:  # No users match in db
        return jsonify({'status': 404, 'message':  str(username) + ' does not exist'})
    user = query[0]
    return jsonify({'status': 200, 'user_name': user.user_name, 'password': user.password, 'public_key': user.public_key})

# Does DH Key Exchange with client
@app.route('/dhExchange', methods=['POST'])
def dh_exchange():

    # Get payload
    g = request.get_json().get('g')
    n = request.get_json().get('n')
    client_public_key = request.get_json().get('client_public_key')
    username = request.get_json().get('username')

    print('g: ' + str(g))
    print('n: ' + str(n))
    print('client public: ' + str(client_public_key))

    # query user 
    query = User.query.filter_by(user_name = username).all()
    if not query:  # No users match in db
        return jsonify({'status': 404, 'message':  str(username) + ' does not exist'})
    user = query[0]

    server_private_key = random.randint(0, 10)  # TODO: too large overflows
    shared_secret = client_public_key**server_private_key % n # TODO: store shared secret somewhere

    B = g**server_private_key % n

    print('private key: '+ str(server_private_key) +'\nshared secret: '+ str(shared_secret) +'\nserver public key: ' + str(B))
    return jsonify({'status': 200, 'user_name': user.user_name, 'public_key': B})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')


