import database
from models import User
from flask import Flask
from flask_cors import CORS


database.init_db()
# This line is only to test that adding to the database works correctly
admin = User('admin')
db_session = database.db_session
db_session.add(admin)
db_session.commit()

app = Flask(__name__)
CORS(app)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')