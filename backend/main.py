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
def add_user():
    user_name = request.get_json().get('user_name')
    if user_name != None:
        try:
            user = User(user_name)
            db_session.add(user)
            db_session.commit()
            # Successful right to database
            return jsonify({'status': 201, 'message': str(user_name) + ' added'})
        except exc.IntegrityError as e:
            db_session().rollback()
            return jsonify({'status': 400, 'message': 'User already exists in db. Usernames must be unique'})
    else:
        return jsonify({'status': 400, 'message': 'Invalid request syntax. Send JSON of form {user_name: XXX}'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')