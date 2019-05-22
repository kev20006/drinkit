from flask import Blueprint

from bson.json_util import dumps
from .utils import mongo_connect

searchs = Blueprint('searchs', __name__)


@searchs.route('/search/<type>/<terms>', methods=["GET"])
def search(type, terms):
    fieldName = ""
    connection = mongo_connect()
    if type == "users":
        fieldName += "user"
    fieldName += "name"
    results = connection[type].find(
        {fieldName: {'$regex': terms, '$options': 'i'}}
    )
    return dumps(results)
