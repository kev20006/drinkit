from flask import Blueprint

from bson import ObjectId
from .utils import mongo_connect

delete = Blueprint('delete', __name__)


@delete.route('/delete_cocktail', methods=["POST"])
def delete_cocktail():
    """
    Method to delete cocktail from the database
    """
    data = request.data
    cocktail = json.loads(data)
    print(cocktail)
    connection = mongo_connect()
    connection["cocktails"].delete_one({
        "_id": ObjectId(cocktail["object_id"])
    })
    return "done!"
