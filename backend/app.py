from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from routes import auth, experiences, bookings, admin

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)  # Allow frontend origin
db.init_app(app)

# Register blueprints
app.register_blueprint(auth.bp, url_prefix='/api/auth')
app.register_blueprint(experiences.bp, url_prefix='/api/experiences')
app.register_blueprint(bookings.bp, url_prefix='/api/bookings')
app.register_blueprint(admin.bp, url_prefix='/api/admin')

with app.app_context():
    db.create_all()  # Create tables

if __name__ == '__main__':
    app.run(debug=True)