DROP DATABASE IF EXISTS Pickout;

CREATE DATABASE Pickout;

\c Pickout_test;

DROP TABLE IF EXISTS users, user_address, signature_meal, pair_meal, purchases;

CREATE TABLE users (
    id serial PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    email TEXT NOT NULL,
    created_on TIMESTAMP
);

CREATE TABLE user_address (
    user_id INTEGER,
    street_address TEXT,
    address_number INTEGER,
    city TEXT,
    state TEXT,
    zip_code INTEGER,
    country TEXT,
    PRIMARY KEY (user_id),
    CONSTRAINT fk_user_id 
        FOREIGN KEY (user_id) 
            REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE signature_meal (
    id serial PRIMARY KEY,
    price DECIMAL NOT NULL
);

-- Add on wine
CREATE TABLE pair_meal (
    id serial PRIMARY KEY,
    price DECIMAL NOT NULL
);

CREATE TABLE purchases (
    id serial PRIMARY KEY,
    user_id INTEGER 
        REFERENCES users ON DELETE CASCADE,
    signature_meal INTEGER 
        REFERENCES signature_meal ON DELETE CASCADE,
    pair_meal INTEGER 
        REFERENCES pair_meal ON DELETE CASCADE,
    purchased_on TIMESTAMP 
);

