import os
import pymongo
import json

from pymongo import MongoClient
from bson import ObjectId
from bson.json_util import dumps

from datetime import datetime
from flask import Flask, redirect, render_template, request, session, url_for
from passlib.hash  import sha256_crypt


app = Flask(__name__)
#environment variables hide irl
#mongo_uri = "mongodb+srv://kev:22c2c119f3@cluster0-nnrmm.mongodb.net/bartendr?retryWrites=true"
#DBS_NAME =  "bartendr"
#app.secret_key = 'any random string'

mongo_uri = os.environ.get('MONGO_URI')
DBS_NAME = os.environ.get('DBS_NAME')
app.secret_key = os.environ.get('SECRET_KEY')

def aggregate_cocktail_previews(cocktails):
    cocktailDetails = cocktails.aggregate([
        {"$lookup":
            {
                "from": "users",
                "foreignField": "_id",
                "localField": "creator",
                "as": "creator"
            }
         },
        {"$unwind": "$flavor_tags"},
        {"$lookup":
            {
                "from": "flavors",
                "foreignField": "_id",
                "localField": "flavor_tags",
                "as": "flavors"
            }
         },
        {"$unwind": "$flavors"},
        {"$unwind": "$creator"},
        {"$unwind": "$ingredients"},
        {"$lookup":
            {
                "from": "ingredients",
                "foreignField": "_id",
                "localField": "ingredients.ingredient",
                "as": "ingredient_list"
            }
         },
        {"$unwind": "$ingredient_list"},
        {"$group":
            {
                "_id": "$_id",
                "name": {"$min": "$name"},
                "description": {"$min": "$description"},
                "flavor_tags": {"$min": "$flavor_tags"},
                "ingredients": {"$min": "$ingredients"},
                "votes": {"$min": "$votes"},
                "image_url": {"$min": "$image_url"},
                "creator": {"$min": "$creator.username"},
                "flavors": {"$addToSet": '$flavors'},
                "ingredient_list":  {"$addToSet": '$ingredient_list'}
            }
        }
    ])

    return cocktailDetails

def get_id(collection, name):
    item = collection.find_one({"name":name})
    if item != None:
        return item["_id"]



def mongo_connect(uri):
    try:
        conn = pymongo.MongoClient(uri)
        print("DB Connected Successfully")
        return conn["bartendr"]
    except pymongo.errors.ConnectionFailure as e:
        print("Could not connect to MongoDB: %s") % e


@app.route('/')
def index():
    connection = mongo_connect(mongo_uri)
    cocktails = connection["cocktails"]
    user = None
    if session:   
        user = connection["users"].find_one({"_id": ObjectId(session['_id'])})
    cocktailPreviews = aggregate_cocktail_previews(cocktails)
    return render_template('index.html', cocktails = cocktailPreviews, user= user)


#Login and Logout
@app.route('/login/', methods=["GET", "POST"])
def login():
    connection = mongo_connect(mongo_uri)
    userCollection = connection["users"]
    userdetails = userCollection.find_one({"username": request.form["username"]}) 
    if userdetails != None:
        if sha256_crypt.verify(request.form["password"], userdetails["passhash"]):
            session['username'] = request.form["username"]
            session['_id'] = str(userdetails["_id"])
    return redirect(url_for("index"))

@app.route('/logout/')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))



#Routes for Creating New Content 
@app.route('/c/new_account', methods=["GET","POST"])
def new_user():
    """ Add a New User to the database and Hashes their password """
    hash = sha256_crypt.hash(request.form["newpassword1"])
    connection = mongo_connect(mongo_uri)
    userCollection = connection["users"]
    userCollection.insert_one(
        {
            "username": request.form["newusername"], 
            "passhash": hash,
            "date_joined":str(datetime.now()),
            "starred_cocktails":[],
            "favorite_ingredients":[],
            "favorite_flavors":[]
        }
    )
    userdetails = userCollection.find_one({"username": request.form["newusername"]})
    session['username'] = request.form["newusername"]
    session['_id'] = str(userdetails["_id"])
    return redirect(url_for("index"))


@app.route('/c/cocktail', methods=["GET", "POST"])
def new_drink():
    """ Add a new cocktail to the database"""
    if session['username']:
        return render_template('addcocktail.html')

    else:
        return redirect(url_for("index"))

@app.route('/c/cocktail_processing', methods=["POST"])
def add_new_drink_to_db():
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
        "votes": 0,
        "method": dataDict["instructions"],
        "glass": dataDict["glass"],
        "equipment": dataDict["equipment"],
        "creator": ObjectId(session['_id']),
        "flagged": 0,
        "votes":{
            "upvotes":[],
            "downvotes": []
        },
        "created_at": str(datetime.now()),
        "preferred_spirits":[],
        "image_url": dataDict["image_url"]
    })
    return redirect(url_for("index"))

#functions for adding to the DB, without routes
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
    newFlavor=flavors.find_one({
            "name": name
        })
    return newFlavor["_id"]



#ajax routes
@app.route('/api/ingredients/<type>')
def get_ingredients_by_type(type):
    connection = mongo_connect(mongo_uri)
    if not type:
        ingredients = connection["ingredients"].find({})
    else:
        ingredients = connection["ingredients"].find({"type":type})
    return dumps(ingredients)


@app.route('/api/spirits/<type>')
def spirits_by_type(type):
    connection = mongo_connect(mongo_uri)
    spirits = connection["spirits"].find({"typeof": type})
    return dumps(spirits)


@app.route('/api/flavors/')
def get_flavors():
    connection = mongo_connect(mongo_uri)
    flavors = connection["flavors"].find({})
    return dumps(flavors)

#routes to update details
@app.route("/update/favorite_things/", methods=["POST"])
def update_favorite_things():
    data = request.data
    favorite_things = json.loads(data)
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
                    favorite_things["type"]: ObjectId(favorite_things["item_id"])
                }
            }
        )
    return "success"

@app.route("/update/like_dislike", methods = ["POST"])
def like_dislike():
    data = request.data
    new_like = json.loads(data)
    print(new_like)
    connection = mongo_connect(mongo_uri)
    if new_like["type"] == "up":
        connection["cocktails"].update_one(
            {"_id": ObjectId(new_like["cocktail_id"])},
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
        connection["cocktails"].update_one(
            {"_id": ObjectId(new_like["cocktail_id"])},
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
        connection["cocktails"].update_one(
            {"_id": ObjectId(new_like["cocktail_id"])},
            {"$pull":
                {
                    "votes.downvotes": new_like["user_id"],
                    "votes.upvotes": new_like["user_id"]
                },
            }
        )
    return "success"
        

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 33507))
    app.run(host='0.0.0.0', port=port)  
    #app.run(debug="true")
