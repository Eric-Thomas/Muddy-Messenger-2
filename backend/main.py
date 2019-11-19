import database
from models import User
from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import exc


database.init_db()
db_session = database.db_session

app = Flask(__name__)
CORS(app)

@app.route('/user', methods=['POST', 'GET'])
def user():
    request_user_name = request.get_json().get('user_name')
    if not request_user_name: # check that username isn't emtpy
        return jsonify({'status': 400, 'message': 'Invalid request syntax. Send JSON of form {user_name: XXX}'})
    
    if request.method == 'POST': # Add user to db
        try:
            #TODO: Sanitize DB inputs
            user = User(request_user_name)
            db_session.add(user)
            db_session.commit()
            # Successful write to database
            return jsonify({'status': 201, 'message': str(request_user_name) + ' added'})
        except exc.IntegrityError as e:
            db_session().rollback()
            return jsonify({'status': 400, 'message': 'User already exists in db. Usernames must be unique'})
    else: # GET method return query of users
        search = "%{}%".format(request_user_name)
        q = db_session.query(User).filter_by(user_name = request_user_name).all()
        res = User.query.filter_by(user_name = request_user_name).all()
        for row in res:
            print(row.user_name)
        if not q: # No users match in db
            return jsonify({'status': 404, 'message':  str(request_user_name) + ' does not exist'})
        return jsonify({'status': 200, 'users': [row.user_name for row in q]})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')