from .utils import mongo_connect

import json

from flask import Blueprint, request
from bson import ObjectId
from datetime import datetime


comment = Blueprint('comment', __name__)


@comment.route('/add_comment/', methods=["POST"])
def add_comment():
    """
    AJAX route to take a comment as JSON and add it to the database
    """
    data = request.data
    commentsDict = json.loads(data)
    if "parent" not in commentsDict:
        commentsDict["parent"] = ""
    else:
        commentsDict["parent"] = ObjectId(
            commentsDict["parent"])
    connection = mongo_connect()
    connection["comments"].insert_one({
        "user_id": ObjectId(commentsDict["user_id"]),
        "parent": commentsDict["parent"],
        "cocktail_id": ObjectId(commentsDict["cocktail"]),
        "comment": commentsDict["comment"],
        "votes": {
            "upvotes": [],
            "downvotes": []
        },
        "reported": 0,
        "created_at": str(datetime.now())
    })
    return "success"
