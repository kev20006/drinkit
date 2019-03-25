import pymongo
from datetime import datetime
from flask import Flask, redirect, render_template, request, session, url_for
from passlib.hash  import sha256_crypt


app = Flask(__name__)
#environment variables hide irl
mongo_uri = "mongodb+srv://kev:22c2c119f3@cluster0-nnrmm.mongodb.net/bartendr?retryWrites=true"
DBS_NAME =  "bartendr"
app.secret_key = 'any random string'


def mongo_connect(uri):
    try:
        conn = pymongo.MongoClient(uri)
        print("DB Connected Successfully")
        return conn["bartendr"]
    except pymongo.error.ConnectionFailure as e:
        print("Could not connect to MongoDB: %s") % e


@app.route('/')
def index():
    return render_template('index.html')


#Login and Logout
@app.route('/login/', methods=["GET", "POST"])
def login():
    connection = mongo_connect(mongo_uri)
    userCollection = connection["users"]
    userdetails = userCollection.find_one({"username": request.form["username"]}) 
    if userdetails != None:
        if sha256_crypt.verify(request.form["password"], userdetails["passhash"]):
            session['username'] = request.form["username"]
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
            "date_joined":str(datetime.now())
        }
    )
    print("new user added")
    session['username'] = request.form["newusername"]
    return redirect(url_for("index"))


app.run(debug=True)