from cs50 import SQL

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///parks.db")

def main():

    # create the users table
    db.execute('CREATE TABLE "users" ("id" INTEGER NOT NULL, "username" TEXT NOT NULL, "hash" TEXT NOT NULL, PRIMARY KEY("id"));')

    # create the all_skateparks table
    db.execute('CREATE TABLE "all_skateparks" ("place_id" VARCHAR(255) NOT NULL, "name" VARCHAR(255),"formatted_address" VARCHAR(512), "phone" VARCHAR(255), "website" VARCHAR(255), PRIMARY KEY("place_id"));')

    # create the user_saved_parks table
    db.execute('CREATE TABLE "user_saved_parks" ("id" int NOT NULL, "place_id" VARCHAR(255) NOT NULL, FOREIGN KEY("place_id") REFERENCES "all_skateparks"("place_id"), FOREIGN KEY("id") REFERENCES "users"("id"));')

    # create the opening_hours table
    db.execute('CREATE TABLE "opening_hours" ("place_id" VARCHAR(255) NOT NULL, "day_entry" VARCHAR(255), FOREIGN KEY("place_id") REFERENCES "all_skateparks"("place_id"));')

    # create the photos table
    db.execute('CREATE TABLE "photos" ("place_id" VARCHAR(255) NOT NULL, "height" int NOT NULL,"width" int NOT NULL,"html_attribute" VARCAHAR(512),"photoref" VARCHAR(512), FOREIGN KEY("place_id") REFERENCES "all_skateparks"("place_id"));')

    # create the types table
    db.execute('CREATE TABLE "types" ("place_id" VARCHAR(255) NOT NULL, "types" VARCHAR(255),FOREIGN KEY("place_id") REFERENCES "all_skateparks"("place_id"));')

    # create the skateparks_reviews table
    db.execute('CREATE TABLE "skatepark_reviews" ("place_id" VARCHAR(255) NOT NULL, "review_author" VARCHAR(255),"review_author_url" VARCHAR(8192),"review_lang" VARCHAR(255),"review_profile_url" VARCHAR(8192), "review_rating" int NOT NULL, "relative_time_desc" VARCHAR(255), "review_text" BLOB, "review_time" VARCHAR(255),FOREIGN KEY("place_id") REFERENCES "all_skateparks"("place_id"));')

    # create the skatepark_location table
    db.execute('CREATE TABLE "skatepark_location" ("place_id" VARCHAR(255) NOT NULL, "location_lat" VARCHAR(255),"location_long" VARCHAR(255), FOREIGN KEY("place_id") REFERENCES "all_skateparks"("place_id"));')

if __name__ == "__main__":
    main()