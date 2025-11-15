from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS
    CORS(app)
    
    # Initialize database
    db.init_app(app)
    
    # Import and register blueprints - using the correct names
    from routes.auth import bp as auth_bp
    from routes.experiences import bp as experiences_bp
    from routes.bookings import bp as bookings_bp
    from routes.reviews import bp as reviews_bp
    from routes.admin import bp as admin_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(experiences_bp, url_prefix='/api/experiences')
    app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
    app.register_blueprint(reviews_bp, url_prefix='/api/reviews')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    # Root endpoint
    @app.route('/')
    def home():
        return jsonify({
            'message': 'Digital Guides API is running!',
            'endpoints': {
                'experiences': '/api/experiences',
                'auth': '/api/auth/login & /api/auth/register'
            }
        })
    
    # Create tables and seed data
    with app.app_context():
        db.create_all()
        print("✅ Database tables created successfully")
        
        # Seed initial data
        try:
            from seed import seed_database
            seed_database()
            print("✅ Database seeded successfully")
        except Exception as e:
            print(f"✅ Database already seeded: {e}")
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)