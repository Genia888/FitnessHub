-- Consider that User is split in subtable 
-- Coach/Nutrition
-- Admin 
-- Subscriber
-- Simple user
-- This information are visible by function in back end
CREATE TABLE IF NOT EXISTS "User" ( 
    "id" VARCHAR(36), 
    "first_name" VARCHAR(50) NOT NULL, 
    "last_name" VARCHAR(50) NOT NULL, 
    "birthday" DATE DEFAULT NULL,
    "email" VARCHAR(120) NOT NULL UNIQUE,
    "password" VARCHAR(128) NOT NULL, 
    "is_admin" BOOLEAN DEFAULT FALSE, 
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    "is_coach" BOOLEAN DEFAULT FALSE, 
    "is_nutrition" BOOLEAN DEFAULT FALSE, 
    "is_subscribe" BOOLEAN DEFAULT FALSE, 
    "adress1" VARCHAR(100), 
    "adress2" VARCHAR(100), 
    "postal_code" VARCHAR(20) DEFAULT '', 
    "city" VARCHAR(100) DEFAULT '', 
    "allergy_comment" TEXT DEFAULT '',
    "physical_constraint" TEXT DEFAULT '',
    "coach_certif" VARCHAR(1000) DEFAULT '',
    "coach_experience" TEXT DEFAULT '',
    "coach_description" TEXT DEFAULT '',
    "weight" FLOAT DEFAULT 0,
    "size" FLOAT DEFAULT 0,
    "picture" VARCHAR(1000) DEFAULT '',
    PRIMARY KEY("id") );

-- Create Review
CREATE TABLE IF NOT EXISTS "Review" (
    "id" CHAR(36) PRIMARY KEY,
    "text" TEXT NOT NULL,
    "rating" INT,
    "user_id" CHAR(36),
    "coach_id" CHAR(36),
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES User("id"),
    FOREIGN KEY ("coach_id") REFERENCES User("id"),
    UNIQUE ("user_id", "coach_id")
);



-- Create subscription
CREATE TABLE IF NOT EXISTS "Subscription" (
    "id" CHAR(36) PRIMARY KEY,
    "begin_date" DATE DEFAULT NULL,
    "end_date" DATE DEFAULT NULL,
    "option_nutrition" BOOLEAN DEFAULT FALSE, 
    "option_message" BOOLEAN DEFAULT FALSE, 
    "user_id" CHAR(36),
    "coach_id" CHAR(36),
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES User("id"),
    FOREIGN KEY ("coach_id") REFERENCES User("id")
);

-- Create subscription
CREATE TABLE IF NOT EXISTS "Message" (
    "id" CHAR(36) PRIMARY KEY,
    "is_read" BOOLEAN DEFAULT FALSE, 
    "text" TEXT DEFAULT '', 
    "user_id" CHAR(36),
    "coach_id" CHAR(36),
    "is_from_user" BOOLEAN DEFAULT FALSE, 
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES User("id"),
    FOREIGN KEY ("coach_id") REFERENCES User("id")
);

-- Create product shop
CREATE TABLE IF NOT EXISTS "Product_shop" (
    "id" CHAR(36) PRIMARY KEY,
    "name" VARCHAR(200) DEFAULT '', 
    "description" VARCHAR(2000) DEFAULT '', 
    "picture" VARCHAR(2000) DEFAULT '', 
    "picture2" VARCHAR(2000) DEFAULT '', 
    "picture3" VARCHAR(2000) DEFAULT '',
    "price" Float Default 0,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN DEFAULT FALSE, 
    "is_in_stock" BOOLEAN DEFAULT FALSE
);


-- Create nutrition schedule
CREATE TABLE IF NOT EXISTS "Nutrition_schedule" (
    "id" CHAR(36) PRIMARY KEY,
    "description" TEXT NOT NULL,
    "picture" VARCHAR(1000) DEFAULT '',
    "category" VARCHAR(36) DEFAULT '',
    "calories" FLOAT DEFAULT 0,
    "quantity" FLOAT DEFAULT 0,
    "date_nutrition" DATETIME DEFAULT NULL, 
    "user_id" CHAR(36),
    "coach_id" CHAR(36),
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES User("id"),
    FOREIGN KEY ("coach_id") REFERENCES User("id")
);

-- Create Workouts time is in minutes
CREATE TABLE IF NOT EXISTS "Workout_schedule" (
    "id" CHAR(36) PRIMARY KEY,
    "description" VARCHAR(2000) DEFAULT '', 
    "picture" VARCHAR(2000) DEFAULT '', 
    "category" VARCHAR(200) DEFAULT '', 
    "time" Float Default 0,
    "comment" VARCHAR(2000) DEFAULT '', 
    "date_workout" DATETIME DEFAULT NULL, 
    "coach_id" CHAR(36),
    "user_id" CHAR(36),
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES User("id"),
    FOREIGN KEY ("coach_id") REFERENCES User("id")
);