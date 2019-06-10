import os
from flask import Flask
from flask_talisman import Talisman


from blueprints.login_logout import login_logout
from blueprints.home import home
from blueprints.api import api
from blueprints.filters import filters
from blueprints.profiles import profiles
from blueprints.add_drink import add_drink
from blueprints.comments import comment
from blueprints.update import update
from blueprints.delete import delete
from blueprints.search import searchs


app = Flask(__name__)


# mongo_uri = os.environ.get('MONGO_URI')
# app.secret_key = "asdfsdfs"
app.secret_key = os.environ.get('SECRET_KEY')

app.register_blueprint(home)
app.register_blueprint(login_logout)
app.register_blueprint(api)
app.register_blueprint(filters)
app.register_blueprint(profiles)
app.register_blueprint(add_drink)
app.register_blueprint(comment)
app.register_blueprint(update)
app.register_blueprint(delete)
app.register_blueprint(searchs)


if __name__ == '__main__':
    if os.environ.get('VERSION') == "PROD":
        port = int(os.environ.get("PORT", 33507))
        app.run(host='0.0.0.0', port=port)
    else:
        app.run(debug="true")
