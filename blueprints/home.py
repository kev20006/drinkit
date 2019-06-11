from flask import Blueprint, session, render_template
from bson import ObjectId

from .utils import mongo_connect, aggregate_cocktail_previews


home = Blueprint('home', __name__)


@home.route('/')
@home.route('/<page>')
@home.route('/<page>/<filter>')
def index(page=1, filter=None):
    """
    route to render the homepage
    """
    connection = mongo_connect()
    cocktails = connection["cocktails"]
    user = None
    print(session)
    if '_id' in session:
        user = connection["users"].find_one({"_id": ObjectId(session['_id'])})
    cocktailPreviews = aggregate_cocktail_previews(cocktails, page, filter)
    return render_template('index.html', cocktails=cocktailPreviews, user=user)
