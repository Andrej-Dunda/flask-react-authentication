from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_session import Session
from models import db, User
from config import ApplicationConfig, RedisSessionInterface
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins='http://localhost:3000', supports_credentials=True)
app.config.from_object(ApplicationConfig)
app.session_interface = RedisSessionInterface(app.config['SESSION_REDIS'])

bcrypt = Bcrypt(app)
server_session = Session(app)

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/auth-status', methods=['GET'])
def auth_status():
    if 'user_id' in session:
        return {'isLoggedIn': True}, 200
    else:
        return {'isLoggedIn': False}, 200

@app.route('/@me', methods=['GET'])
def get_current_user():
    print(request.cookies)
    user_id = session.get('user_id')

    if user_id is None:
        return jsonify({
            'error': 'Not logged in',
            'session_user_id1': session.get('user_id')
            }), 401
    
    user = User.query.filter_by(id=user_id).first()

    return jsonify({
        'id': user.id,
        'email': user.email,
        'session_user_id': session['user_id']
    })

@app.route('/register', methods=['POST'])
def register():
    email = request.json['email']
    password = request.json['password']

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({'error': 'User already exists'}), 409

    new_user = User(email=email, password=Bcrypt().generate_password_hash(password).decode('utf-8'))
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        'id': new_user.id,
        'email': new_user.email
    })

@app.route('/login', methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['password']

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({'error': 'Unauthorized'}), 401

    if not Bcrypt().check_password_hash(user.password, password):
        return jsonify({'error': 'Unauthorized'}), 401

    session['user_id'] = str(user.id)
    print("Session user_id:", session['user_id'])

    return jsonify({
        'id': user.id,
        'email': user.email,
        'session_user_id': session['user_id']
    }), 200

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out'}), 200

if __name__ == '__main__':
    app.run(host="0.0.0.0", port="5002", debug=True)