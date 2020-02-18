
from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    if request.method == 'GET':
        return render_template('index.html'), 200

@app.route('/more', methods=['GET'])
def more():
    if request.method == 'GET':
        return render_template('more.html', name=request.args['name']), 200

if __name__ == '__main__':
    app.debug = True
    app.run(port=4000)


