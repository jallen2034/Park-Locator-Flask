import os

# https://pypi.org/project/flask-googlemaps/

# Import the modules that we will want to use
from cs50 import SQL
from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_session import Session
from flask_googlemaps import GoogleMaps
from tempfile import mkdtemp
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from werkzeug.security import check_password_hash, generate_password_hash
import config
import pprint
import json
import sys

from helpers import login_required

# Configure application
app = Flask(__name__)
# Ensure that user sessions when they are logged in are not perm
app.config["SESSION_PERMANENT"] = False
# Ensure the location that we want to store the data for user sessions is going to be in the file system of the webserver we'll be running this application from (CS50 IDE)
app.config["SESSION_TYPE"] = "filesystem"
# We would like to enable sessions for this particular flask web app
Session(app)

# Ensure templates are auto-reloaded when sent and recieved
app.config["TEMPLATES_AUTO_RELOAD"] = True

# set the maps api key as config
app.config['GOOGLEMAPS_KEY'] = "8JZ7i18MjFuM35dJHq70n3Hx4"

# Initialize the extension
GoogleMaps(app)

# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///parks.db")


# app route to map out 1 park
@app.route("/", methods=["GET"])
@login_required
def index():
    """Homepage with Park locator"""
    index_park_info = send_to_index()
    # pprint.pprint(index_park_info)
    return render_template("index.html", index_park_info=index_park_info)

# app route to recieve and process our ajax call to add a selected park from the map to the current users login into the parks.db
@app.route("/parkcall", methods=["POST"])
@login_required
def parkcall():

    # extract the current logged in users ID from the session["user_id"] dict & store it inside of "user_id" to use below
    user_id = session["user_id"]

    # all potential errors + success messages that can be rendered on the buy html
    error = "Sorry, you have already added this park into your Saved Parks!"
    success = "Park added to your Saved Parks!"

    # https://stackoverflow.com/questions/48595068/process-ajax-request-in-flask
    # https://flask.palletsprojects.com/en/0.12.x/patterns/jquery/
    # request.get.json() functiona lso conversts returned JSON from our AJAX call into a Python Dict
    button_id = request.get_json()

     # Print the type of data variable
    print("Type:", type(button_id))


    # Query database for all of the parks currently stored in the "user_saved_parks" table
    saved_parks_dict = db.execute("SELECT * FROM user_saved_parks WHERE id = :user_id",
                      user_id=user_id)

    # Extract the button id from this returned dict, then store these values in seperate variables
    extracted_button_id = button_id["clicked_button"]

    # loop through "saved_parks_dict", if it finds the "place_id" in the returned "button_id" from ajax matches the "place_ID" in the returned dict from our db, pass an error as a JSON object back to the front end
    for dictionary in saved_parks_dict:
        if extracted_button_id == dictionary['place_id']:
           return jsonify({'error_notification' : error})

    # Query database for all of the parks currently stored in the "user_saved_parks" table
    saved_parks_dict = db.execute("INSERT INTO user_saved_parks (id, place_id) VALUES (?, ?);",
                      user_id, extracted_button_id)

    # return our "success" message with JSON to our front end for ajax to recieve and our page to later use
    return jsonify({'success_notification' : success})

# app route to see your saved parks
@app.route("/myparks", methods=["GET", "POST"])
@login_required
def myparks():
    """Page with all parks"""
    if request.method == "GET":
        return render_template("myparks.html")

# app route to see all reviews of parks
@app.route("/reviews", methods=["GET", "POST"])
@login_required
def reviews():
    """Page with all parks"""
    if request.method == "GET":
        return render_template("reviews.html")

# app route to register an account
@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""

    if request.method == "GET":
        return render_template("register.html")

    else:
        errors = ["Must provide username", "Must provide password", "Password and confirmation must match", "Username is taken"]

        if not request.form.get("username"):
            return render_template("register.html", errors=errors[0])

        elif not request.form.get("password"):
            return render_template("register.html", errors=errors[1])

        elif request.form.get("password") != request.form.get("confirmation"):
            return render_template("register.html", errors=errors[2])

        rows = db.execute("SELECT username FROM users WHERE username = :username;",
            username=request.form.get("username"))

        if len(rows) != 0:
            return render_template("register.html", errors=errors[3])

    password_var = request.form.get("password")
    hash_pw = generate_password_hash(password_var)
    user_name = request.form.get("username")

    db.execute("INSERT INTO users(username,hash) VALUES (?,?);",
        user_name, hash_pw)

    success_login = ["Registered!"]

    # select the username from our db as the current session and store it as the current users logged in session, it's the first index in the list of dicts returned
    session["user_id"] = db.execute("SELECT id FROM users WHERE username = :username;",
                          username=user_name) [0]["id"]

    index_park_info = send_to_index()

    return render_template("index.html", success_login=success_login[0], index_park_info=index_park_info)

@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")

@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # list of all potential errors that can be rendered on the buy html
        errors = ["Must provide a username", "Must provide password", "Invalid username and/or password"]

        # Ensure username was submitted
        if not request.form.get("username"):
            return render_template("login.html", errors=errors[0])

        # Ensure password was submitted
        elif not request.form.get("password"):
            return render_template("login.html", errors=errors[1])

        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE username = :username",
                          username=request.form.get("username"))

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            return render_template("login.html", errors=errors[2])

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")

def send_to_index():

    # Query db, joining both the all_skateparks & skateparks_location tables, to grab the park info + location of a park to send to my index.html
    index_park_info = db.execute("SELECT place_id, name, formatted_address, phone, website, location_lat, location_long FROM (SELECT * FROM all_skateparks JOIN skatepark_location ON all_skateparks.place_id = skatepark_location.place_id);")

    return index_park_info