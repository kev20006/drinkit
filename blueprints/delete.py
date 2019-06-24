import json

from flask import Blueprint, request, jsonify

from bson import ObjectId
from .utils import mongo_connect

delete = Blueprint('delete', __name__)


@delete.route('/cocktail/delete', methods=["POST"])
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
    resp = jsonify(success=True)
    return resp


@delete.route('/user/delete/<user>', methods=["POST"])
def delete_user(user):
    """
    Method to delete cocktail from the database
    """
    data = request.data
    data_dict = dict(data)
    connection = mongo_connect()
    connection["users"].delete_one({
        "_id": ObjectId(data_dict["user"])
    })
    resp = jsonify(success=True)
    return resp
