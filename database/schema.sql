-- AgroVision AI - MySQL Database Schema
-- The application uses Spring Data JPA with `ddl-auto=update`, so tables are
-- created automatically. This script is provided for manual setup and reference.

CREATE DATABASE IF NOT EXISTS agrovision
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE agrovision;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20)  NOT NULL DEFAULT 'USER',
    created_at  DATETIME
) ENGINE=InnoDB;

-- Disease detection history
CREATE TABLE IF NOT EXISTS detection_history (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    image_url       VARCHAR(255),
    plant_name      VARCHAR(100),
    plant_category  VARCHAR(50),
    disease_name    VARCHAR(150),
    health_status   VARCHAR(20),
    confidence      DOUBLE,
    severity        VARCHAR(20),
    description     TEXT,
    causes          TEXT,
    treatment       TEXT,
    prevention      TEXT,
    detection_date  DATETIME,
    CONSTRAINT fk_detection_user FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB;

-- Diseases information
CREATE TABLE IF NOT EXISTS diseases (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    plant_name    VARCHAR(100) NOT NULL,
    disease_name  VARCHAR(150) NOT NULL,
    description   TEXT NOT NULL,
    causes        TEXT,
    treatment     TEXT,
    prevention    TEXT
) ENGINE=InnoDB;
