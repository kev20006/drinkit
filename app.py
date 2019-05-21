import os
import pymongo
import json
from datetime import datetime

from bson import ObjectId
from bson.json_util import dumps
from flask import Flask, redirect, render_template, request, session, url_for

from blueprints.login_logout import login_logout
from blueprints.home import home
from blueprints.api import api

app = Flask(__name__)

mongo_uri = os.environ.get('MONGO_URI')
DBS_NAME = os.environ.get('DBS_NAME')
app.secret_key = "asdfsdf"
#app.secret_key = os.environ.get('SECRET_KEY')

app.register_blueprint(home)
app.register_blueprint(login_logout)
app.register_blueprint(api)

# /v/ routes for viewing db content


@app.route('/v/<type>/<keyword>')
@app.route('/v/<type>/<keyword>/<filter>')
def view_by_type(type_of_search, keyword, filter=None):
    """
    route to render a subsection of the cocktails
    """
    connection = mongo_connect(mongo_uri)
    cocktails = connection["cocktails"]
    user = None
    if session:
        user = connection["users"].find_one({"_id": ObjectId(session['_id'])})
        cocktail_previews = aggregate_cocktail_previews(cocktails, filter)
    outputCocktails = []
    for i in cocktailPreviews:
        if type_of_search == "ingredient":
            for ingredient in i["ingredient_list"]:
                if ingredient["name"] == keyword:
                    outputCocktails.append(i)
        elif type_of_search == "flavor":
            if any(flavor["name"] == keyword for flavor in i["flavors"]):
                outputCocktails.append(i)

    print(len(outputCocktails))
    return render_template(
                    'filtered.html',
                    cocktails=outputCocktails,
                    user=user,
                    urlString="v/{}/{}".format(type_of_search, keyword)
                )


@app.route('/advanced_filter/', methods=["POST", "GET"])
def advanced_filter():
    # change this so it happens programmatically not hard coded
    # data_dict = {}
    # data_dict["type"] = "and"
    # data_dict["ingredients"] = [
    #        ObjectId("5cab524eec4ad12098cc2807"),
    #        ObjectId("5c9b8df91c9d440000478c92")
    #    ]
    # data_dict["equipment"] = ["Shaker"]
    #
    query = {"${}".format(data_dict["type"]): []}
    for key in data_dict.keys():
        if key == "ingredients":
            queryString = {
                "ingredients":
                    {"$elemMatch":
                        {"ingredient":
                            {"$in": data_dict[key]}
                         }
                     }
                 } 
        elif key == "flavor_tags" or key == "equipment":
            queryString = {key: {"$in": data_dict[key]}}
        else:
            queryString = {key: data_dict[key]}
        if key != "type":
            query["${}".format(data_dict["type"])].append(queryString)
    connection = mongo_connect(mongo_uri)
    print(query)
    cocktails = connection["cocktails"].find(query)
    for i in cocktails:
        print(i)
    return "done"


@app.route('/v/cocktail/<cocktail_id>')
def view_cocktail(cocktail_id):
    """
    route to view a specific cocktail
    """
    connection = mongo_connect(mongo_uri)
    cocktail = connection["cocktails"].find_one(
        {"_id": ObjectId(cocktail_id)}
    )
    user = ""
    if session.get('_id'):
        user = connection["users"].find_one(
            {"_id": ObjectId(session['_id'])}
        )
    return render_template('viewcocktail.html', cocktail=cocktail, user=user)


@app.route('/v/user_profile/<user_id>')
def view_user_profile(user_id):
    """
    route to view a users profile
    """
    connection = mongo_connect(mongo_uri)
    user = connection["users"].find_one(
        {"_id": ObjectId(user_id)}
    )
    print(user)
    return render_template('userprofile.html', user=user)


@app.route('/c/cocktail', methods=["GET", "POST"])
def new_drink():
    """
    render the form for adding a new cocktail to the database
    """
    if session['username']:
        return render_template('addcocktail.html')

    else:
        return redirect(url_for("index"))


@app.route('/c/cocktail_processing', methods=["POST"])
def add_new_drink_to_db():
    """
    function called from the cocktail form to add a drink to the
    database using AJAX
    """
    ingredients = json.loads(get_ingredients_by_type(None))
    flavors = json.loads(get_flavors())
    data = request.data
    dataDict = json.loads(data)
    flavorIds = []
    for i in dataDict["flavors"]:
        if any(j["name"] == i for j in flavors):
            for j in flavors:
                if j["name"] == i:
                    flavorIds.append(ObjectId(j["_id"]["$oid"]))
        else:
            flavorIds.append(
                ObjectId(add_flavor_return_id(i))
            )
    ingredientIds = []
    for i in dataDict["ingredients"]:
        if any(j["name"] == i["name"] for j in ingredients):
            for j in ingredients:
                if j["name"] == i["name"]:
                    ingredients_id = j["_id"]["$oid"]
        else:
                ingredients_id = add_ingredient_return_id(i["name"], i["type"])
        ingredientIds.append(
            {
                "ingredient": ObjectId(ingredients_id),
                "quantity": i['quantity'],
                "units": i['units'],
                "type": i['type']
            })

    connection = mongo_connect(mongo_uri)
    connection["cocktails"].insert_one({
        "name": dataDict["name"],
        "description": dataDict["description"],
        "flavor_tags": flavorIds,
        "ingredients": ingredientIds,
        "method": dataDict["instructions"],
        "glass": dataDict["glass"],
        "equipment": dataDict["equipment"],
        "creator": ObjectId(session['_id']),
        "flagged": 0,
        "votes": {
            "upvotes": [],
            "downvotes": []
        },
        "created_at": str(datetime.now()),
        "preferred_spirits": [],
        "image_url": dataDict["image_url"]
    })
    return "success"


@app.route('/c/comment', methods=["POST"])
def add_comment():
    """
    AJAX route to take a comment as JSON and add it ot the database
    """
    data = request.data
    commentsDict = json.loads(data)
    if "parent" not in commentsDict:
        commentsDict["parent"] = ""
    else:
        commentsDict["parent"] = ObjectId(
            commentsDict["parent"])
    connection = mongo_connect(mongo_uri)
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


# functions for adding to the DB, without routes

def add_ingredient_return_id(name, type):
    connection = mongo_connect(mongo_uri)
    ingredients = connection["ingredients"]
    ingredients.insert_one(
        {
            "name": name,
            "type": type,
        })
    newIngredient = ingredients.find_one({
            "name": name
    })
    return newIngredient["_id"]


def add_flavor_return_id(name):
    connection = mongo_connect(mongo_uri)
    flavors = connection["flavors"]
    flavors.insert_one(
        {
            "name": name,
        })
    new_flavor = flavors.find_one({
            "name": name
        })
    return new_flavor["_id"]


# /api/ routes for making ajax requests





# /u/ routes to update details in the database


@app.route("/u/favorite_things/", methods=["POST"])
def update_favorite_things():
    """
    route to add or remove favorite ingredients or flavors to a user
    - favorite_things["type"] - determines if its an ingredient or a flavor
    """
    data = request.data
    favorite_things = json.loads(data)
    print(favorite_things)
    connection = mongo_connect(mongo_uri)
    if(favorite_things["action"] == "add"):
        connection["users"].update_one(
            {"_id": ObjectId(favorite_things["user"])},
            {"$push": {
                favorite_things["type"]: ObjectId(favorite_things["item_id"])
                }
             }
        )
    else:
        connection["users"].update_one(
            {"_id": ObjectId(favorite_things["user"])},
            {"$pull":
                {
                    favorite_things["type"]:
                    ObjectId(favorite_things["item_id"])
                 }
             }
        )
    return "success"


@app.route("/u/like_dislike", methods=["POST"])
def like_dislike():
    "route to upvote and downvote drinks and comments"
    data = request.data
    new_like = json.loads(data)
    print(new_like)
    connection = mongo_connect(mongo_uri)
    if new_like["type"] == "up":
        connection[new_like["collection"]].update_one(
            {"_id": ObjectId(new_like["object_id"])},
            {"$pull":
                {
                    "votes.downvotes": new_like["user_id"]
                },
             "$push":
                {
                    "votes.upvotes": new_like["user_id"]
                }
             }
        )
    elif new_like["type"] == "down":
        connection[new_like["collection"]].update_one(
            {"_id": ObjectId(new_like["object_id"])},
            {"$push":
                {
                    "votes.downvotes": new_like["user_id"]
                },
             "$pull":
                {
                    "votes.upvotes": new_like["user_id"]
                }
             }
        )
    else:
        connection[new_like["collection"]].update_one(
            {"_id": ObjectId(new_like["object_id"])},
            {"$pull":
                {
                    "votes.downvotes": new_like["user_id"],
                    "votes.upvotes": new_like["user_id"]
                },
             }
        )
    return "success"


@app.route('/u/cocktail/<cocktail_id>')
def update_cocktail(cocktail_id):
    """
    route to update a cocktails details
    """
    connection = mongo_connect(mongo_uri)
    cocktail = connection["cocktails"].aggregate([
        {"$match": {"_id": ObjectId(cocktail_id)}},
        {"$lookup": {
            "from": "ingredients",
            "localField": "ingredients.ingredient",
            "foreignField": "_id",
            "as": "ingredient-details"
            }
         },
        {"$limit": 1}
        ]
    )
    cocktailDetails = {}
    for i in cocktail:
        cocktailDetails = i
    print(cocktailDetails)
    return render_template('editcocktail.html', cocktail=cocktailDetails)


@app.route('/u/cocktail_processing', methods=["POST"])
def update_drink_in_db():
    """
    function called from the cocktail form to add a drink to the
    database using AJAX
    """
    ingredients = json.loads(get_ingredients_by_type(None))
    flavors = json.loads(get_flavors())
    data = request.data
    dataDict = json.loads(data)
    flavorIds = []
    for i in dataDict["flavors"]:
        if any(j["name"] == i for j in flavors):
            for j in flavors:
                if j["name"] == i:
                    flavorIds.append(ObjectId(j["_id"]["$oid"]))
        else:
            flavorIds.append(
                ObjectId(add_flavor_return_id(i))
            )

    ingredientIds = []
    for i in dataDict["ingredients"]:
        if any(j["name"] == i["name"] for j in ingredients):
            for j in ingredients:
                if j["name"] == i["name"]:
                    ingredients_id = j["_id"]["$oid"]
        else:
                ingredients_id = add_ingredient_return_id(i["name"], i["type"])

        ingredientIds.append(
            {
                "ingredient": ObjectId(ingredients_id),
                "quantity": i['quantity'],
                "units": i['units'],
                "type": i['type']
            })

    connection = mongo_connect(mongo_uri)

    connection["cocktails"].update_one(
        {"_id": ObjectId(dataDict["id"])},
        {"$set":
            {"name": dataDict["name"],
                "description": dataDict["description"],
                "flavor_tags": flavorIds,
                "ingredients": ingredientIds,
                "method": dataDict["instructions"],
                "glass": dataDict["glass"],
                "equipment": dataDict["equipment"],
                "creator": ObjectId(session['_id']),
                "updated_at": str(datetime.now()),
                "preferred_spirits": [],
                "image_url": dataDict["image_url"]}
         }
    )
    return "success"

# delete routes


@app.route('/d/delete_cocktail', methods=["POST"])
def delete_cocktail():
    """
    Method to delete cocktail from the database
    """
    data = request.data
    cocktail = json.loads(data)
    print(cocktail)
    connection = mongo_connect(mongo_uri)
    connection["cocktails"].delete_one({
        "_id": ObjectId(cocktail["object_id"])
    })
    return "done!"

# search routes


@app.route('/s/<type>/<terms>', methods=["GET"])
def search(type, terms):
    fieldName = ""
    connection = mongo_connect(mongo_uri)
    if type == "users":
        fieldName += "user"
    fieldName += "name"
    results = connection[type].find(
        {fieldName: {'$regex': terms, '$options': 'i'}}
        )
    return dumps(results)

if __name__ == '__main__':
    # port = int(os.environ.get("PORT", 33507))
    # app.run(host='0.0.0.0', port=port)
    app.run(debug="true")
