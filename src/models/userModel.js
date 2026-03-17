import pool from '../config/db.js';

export const findAllUsers = async () => {
    const [rows] = await pool.query('SELECT id, name FROM users');
    return rows;
};

export const findUserById = async (id) => {
    const [rows] = await pool.query(
        'SELECT id, name, email FROM users WHERE id = ?', [id]
    );
    return rows[0] ?? null;
};

export const createUser = async ({ name, email, passwordHash }) => {
    const [result] = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
        [name, email, passwordHash]
    );
    return result.insertId;
};