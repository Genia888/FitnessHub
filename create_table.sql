CREATE TABLE "users" ( 
    "id" VARCHAR(36), 
    "first_name" VARCHAR(50) NOT NULL, 
    "last_name" VARCHAR(50) NOT NULL, 
    "email" VARCHAR(120) NOT NULL UNIQUE,
    "password" VARCHAR(128) NOT NULL, 
    "is_admin" BOOLEAN DEFAULT FALSE, 
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    "is_coach" BOOLEAN DEFAULT FALSE, 
    "is_diet" BOOLEAN DEFAULT FALSE, 
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
    PRIMARY KEY("id") )

-- Create Review
CREATE TABLE IF NOT EXISTS reviews (
    id CHAR(36) PRIMARY KEY,
    text TEXT NOT NULL,
    rating INT,
    user_id CHAR(36),
    coach_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (coach_id) REFERENCES users(id),
    UNIQUE (user_id, coach_id)
);

-- Create subscription
CREATE TABLE IF NOT EXISTS subscription (
    id CHAR(36) PRIMARY KEY,
    begin_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    option_diet BOOLEAN DEFAULT FALSE, 
    option_message BOOLEAN DEFAULT FALSE, 
    user_id CHAR(36),
    coach_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (coach_id) REFERENCES users(id),
    UNIQUE (user_id, coach_id)
);

-- Create product shop
CREATE TABLE IF NOT EXISTS product_shop (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(200) DEFAULT '', 
    description VARCHAR(2000) DEFAULT '', 
    picture VARCHAR(2000) DEFAULT '', 
    picture2 VARCHAR(2000) DEFAULT '', 
    picture3 VARCHAR(2000) DEFAULT '',
    price Float Default 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT FALSE, 
    is_in_stock BOOLEAN DEFAULT FALSE
);
