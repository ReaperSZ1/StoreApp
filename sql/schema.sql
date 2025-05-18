CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    provider VARCHAR(255) DEFAULT 'local',
    googleId VARCHAR(255),
    facebookId VARCHAR(255),
    favorites JSON DEFAULT (JSON_ARRAY()),
    cart JSON DEFAULT (JSON_ARRAY())
);