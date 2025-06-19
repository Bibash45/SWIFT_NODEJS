import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import {
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_USER
} from './env.config.js';
dotenv.config();

const db = mysql.createPool({
    host: 'localhost',
    user: DB_USER,
    port: DB_PORT,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testConnection() {
    try {
        const connection = await db.getConnection();
        console.log("2> Database connected successfully");
        connection.release();
    } catch (err) {
        console.error(" Error:Database connection failed:", err);
    }
}

testConnection();

export default db;
