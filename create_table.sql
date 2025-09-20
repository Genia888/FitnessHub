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
    "is_abonne" BOOLEAN DEFAULT FALSE, 
    "adresse1" VARCHAR(100), 
    "adresse2" VARCHAR(100), 
    "code_postal" VARCHAR(20) DEFAULT '', 
    "ville" VARCHAR(100) DEFAULT '', 
    "texte_allergie" TEXT DEFAULT '',
    "limitation_exercice" TEXT DEFAULT '',
    "coach_certif" VARCHAR(1000) DEFAULT '',
    "coach_experience" TEXT DEFAULT '',
    "coach_description" TEXT DEFAULT '',
    "taille" FLOAT DEFAULT 0,
    "poids" FLOAT DEFAULT 0,
    "photo" VARCHAR(1000) DEFAULT '',
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
