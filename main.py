# main.py (at the top-level of your project)

from app import create_app  

app = create_app()

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True)
