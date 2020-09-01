# https://github.com/googlemaps/google-maps-services-python
# python script to call the gplaces API, get every skatepark in Vancouver, and dump them into my SQLlite db
# pip install googlemaps
# pip install prettyprint

#import the needed libaries
from cs50 import SQL
import googlemaps
import pprint
import time
import config
from googlemaps import *

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///parks.db")

def main():

    # Define our Maps API Key - https://medium.com/black-tech-diva/hide-your-api-keys-7635e181a06c
    API_KEY = config.api_key

    # Define our client. This is how we authenticate ourselves by giving google our API key
    gmaps = googlemaps.Client(key = API_KEY)

    # Define our search
    places_result = gmaps.places_nearby(location= '49.2827 -123.1207', radius = 40000, open_now = False, keyword = 'skatepark')

    # loop through each place in results
    for place in places_result['results']:

        # define my place id, remember this is a nested dictionary
        my_place_id = place['place_id']

        # define the fields we want sent back to us
        my_fields = ['name', 'place_id', 'formatted_address', 'formatted_phone_number', 'opening_hours', 'type', 'review', 'website', 'photo', 'geometry']

        # make a request for the details
        place_details = gmaps.place(place_id = my_place_id, fields = my_fields)

        # call insert_all_parks(), insert_reviews(), insert_photos(), insert_types() & insert_opening_hours() functions to insert this info collected from the API, in this iteration of this loop into my SQLlite db
        insert_all_parks(place_details, db)
        insert_reviews(place_details, db)
        insert_photos(place_details, db)
        insert_types(place_details, db)
        insert_opening_hours(place_details, db)
        insert_skatepark_location(place_details, db)

        # pprint.pprint(place_details)

# function to insert the collected dicts skatepark info into all skateparks table
def insert_all_parks(place_details, db):

    # https://realpython.com/python-defaultdict/
    place_id = place_details['result']['place_id']
    name = place_details['result']['name']
    formatted_address = place_details['result']['formatted_address']
    phone = place_details['result'].get('formatted_phone_number')
    website = place_details['result'].get('website')

    db.execute("INSERT INTO all_skateparks(place_id, name, formatted_address, phone, website) VALUES (?,?,?,?,?);",
                place_id, name, formatted_address, phone, website)

# function to insert the collected dicts review info into the skateparks reviews table
def insert_reviews(place_details, db):

    # https://realpython.com/python-defaultdict/
    place_id = place_details['result']['place_id']
    reviews = place_details['result'].get('reviews')

    if reviews != None:
        # loop through each list item of individual reviews for the current skatepark being called in main
        for review in place_details['result']['reviews']:
            # variables to store what from the current review on this iteration of the loop I want to insert into my db
            # https://realpython.com/python-defaultdict/
            author_name = review['author_name']
            author_url = review['author_url']
            language = review.get('language')
            rating = review['rating']
            time_description = review['relative_time_description']
            text = review['text']
            time = review['time']

            db.execute("INSERT INTO skatepark_reviews(place_id, review_author, review_author_url, review_lang, review_rating, relative_time_desc, review_text, review_time) VALUES (?,?,?,?,?,?,?,?);",
                        place_id, author_name, author_url, language, rating, time_description, text, time)

# function to function to insert the collected dicts photos info the photos table
def insert_photos(place_details, db):

    place_id = place_details['result']['place_id']
    photos = place_details['result'].get('photos')

    if photos != None:
        # loop through the list of photos in that dict
        for dictionary in photos:

            db.execute("INSERT INTO photos(place_id, height, width, html_attribute, photoref) VALUES (?,?,?,?,?);",
                        place_id, dictionary['height'], dictionary['width'], ['html_attributions'][0], dictionary['photo_reference'])

# function to insert the types for all of the skateparks into my types table
def insert_types(place_details, db):

    place_id = place_details['result']['place_id']

    # loop through the list of park/place types in that dict
    for park_type in place_details['result']['types']:

        db.execute("INSERT INTO types(place_id, types) VALUES (?,?);",
                    place_id, park_type)

# function to insert the opening hours for all of the skateparks into my opening hours table
def insert_opening_hours(place_details, db):

    # https://realpython.com/python-defaultdict/
    opening_hours = place_details['result'].get('opening_hours')

    if opening_hours != None:
        weekday_list = opening_hours['weekday_text']
        place_id = place_details['result']['place_id']

        for weekday_item in weekday_list:

            db.execute("INSERT INTO opening_hours(place_id, day_entry) VALUES (?,?);",
                        place_id, weekday_item)

# function to insert the location of skateparks into my skateparks location table
def insert_skatepark_location(place_details, db):

    # https://realpython.com/python-defaultdict/
    park_location = place_details['result'].get('geometry')

    if park_location != None:

        location_lat = park_location['location']['lat']
        location_long = park_location['location']['lng']
        place_id = place_details['result']['place_id']

        db.execute("INSERT INTO skatepark_location(place_id, location_lat, location_long) VALUES (?,?,?);",
                    place_id, location_lat, location_long)

if __name__ == "__main__":
    main()
