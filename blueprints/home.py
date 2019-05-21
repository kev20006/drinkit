from flask import Blueprint, session, render_template
from bson import ObjectId

from .utils import mongo_connect, aggregate_cocktail_previews


home = Blueprint('index', __name__)


@home.route('/')
@home.route('/<filter>')
def index(filter=None):
    """
    route to render the homepage
    """
    connection = mongo_connect()
    cocktails = connection["cocktails"]
    user = None
    if session:
        user = connection["users"].find_one({"_id": ObjectId(session['_id'])})
    cocktailPreviews = aggregate_cocktail_previews(cocktails, filter)
    return render_template('index.html', cocktails=cocktailPreviews, user=user)
