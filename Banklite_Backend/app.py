from flask import Flask, jsonify
from flask_cors import CORS
from config import Config, error_response
from database import init_db_pool
from auth import auth_bp
from loans import loans_bp


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = Config.JWT_SECRET

    CORS(app, origins=Config.CORS_ORIGINS, supports_credentials=True)

    app.register_blueprint(auth_bp)
    app.register_blueprint(loans_bp)

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'success': False, 'error': str(error)}), 400

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({'success': False, 'error': 'Unauthorized'}), 401

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({'success': False, 'error': 'Forbidden'}), 403

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'success': False, 'error': 'Not Found'}), 404

    @app.errorhandler(500)
    def server_error(error):
        return jsonify({'success': False, 'error': 'Internal Server Error'}), 500

    return app


if __name__ == '__main__':
    init_db_pool()
    app = create_app()
    app.run(host='0.0.0.0', port=Config.PORT, debug=True)
print(">>> BACKEND STARTED <<<")