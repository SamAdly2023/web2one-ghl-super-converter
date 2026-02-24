import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure database directory exists
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}

const dbPath = path.join(dbDir, 'web2one.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        name TEXT,
        picture TEXT,
        plan TEXT DEFAULT 'free',
        credits INTEGER DEFAULT 2,
        createdAt TEXT,
        lastLoginAt TEXT
    )`);

    // Projects Table
    db.run(`CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        userId TEXT,
        name TEXT,
        sourceUrl TEXT,
        status TEXT,
        createdAt TEXT,
        previewImage TEXT,
        outputHtml TEXT,
        rebrandInfo TEXT,
        FOREIGN KEY(userId) REFERENCES users(id)
    )`);

    // Subscriptions Table
    db.run(`CREATE TABLE IF NOT EXISTS subscriptions (
        id TEXT PRIMARY KEY,
        userId TEXT,
        planId TEXT,
        status TEXT,
        startDate TEXT,
        endDate TEXT,
        FOREIGN KEY(userId) REFERENCES users(id)
    )`);

    // Payments Table
    db.run(`CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        userId TEXT,
        amount REAL,
        currency TEXT,
        status TEXT,
        method TEXT,
        createdAt TEXT,
        description TEXT,
        FOREIGN KEY(userId) REFERENCES users(id)
    )`);

    // API Keys Table
    db.run(`CREATE TABLE IF NOT EXISTS api_keys (
            id TEXT PRIMARY KEY,
            apiKey TEXT UNIQUE,
            userId TEXT,
            name TEXT,
            revoked INTEGER DEFAULT 0,
            createdAt TEXT,
            FOREIGN KEY(userId) REFERENCES users(id)
        )`);
<<<<<<< HEAD
=======

    // API Keys Table
    db.run(`CREATE TABLE IF NOT EXISTS api_keys (
        id TEXT PRIMARY KEY,
        apiKey TEXT UNIQUE,
        userId TEXT,
        name TEXT,
        revoked INTEGER DEFAULT 0,
        createdAt TEXT,
        FOREIGN KEY(userId) REFERENCES users(id)
    )`);
>>>>>>> cacd644 (feat(api): add API key generation, clone endpoint, client service, and UI)
});

// Helper for Promisified DB operations
export const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
};

export const get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

export const all = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

export default db;
