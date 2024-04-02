from app.app import create_app
from app.functions.funciones import *

if __name__ == "__main__":
    app = create_app()
    app.run(port=5000, debug=True)