import database
from models import User
from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import exc


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

   
@app.route('/authenticate/<username>')
def authenticate(username):
    query = db_session.query(User).filter_by(user_name = username)
    if not query:  # No users match in db
        return jsonify({'status': 404, 'message':  str(user_name) + ' does not exist'})
    user = query.first() #get first or only object that is user
    return jsonify({'status': 200, 'user_name': user.user_name, 'password': user.password, 'public_key': user.public_key})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')


