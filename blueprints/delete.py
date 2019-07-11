import json

from flask import Blueprint, request, jsonify

from bson import ObjectId
from .utils import mongo_connect
from .login_logout import logout

delete = Blueprint('delete', __name__)


@delete.route('/cocktail/delete', methods=["POST"])
def delete_cocktail():
    """
    Method to delete cocktail from the database
    """
    data = request.data
    cocktail = json.loads(data)
    connection = mongo_connect()
    try:
        connection["cocktails"].delete_one({
            "_id": ObjectId(cocktail["id"])
        })
        resp = jsonify(success=True)
        return resp
    except:
        resp = jsonify(success=False)
        return resp


@delete.route('/user/delete', methods=["POST"])
def delete_user():
    """
    Method to delete cocktail from the database
    """
    data = request.data
    user = json.loads(data)
    connection = mongo_connect()
    try:
        connection["users"].delete_one({
            "_id": ObjectId(user["id"])
        })
        resp = jsonify(success=True)
        logout()
        return resp
    except:
        resp = jsonify(success=False)
