import pool from '../config/db.js';

export const findAllPoolUsers = async () => {
    const [rows] = await pool.query('SELECT id, name FROM pool_users')
    console.log('---> rows', rows)
    return rows;
}

export const createPoolUser = async ({name}) => {
    const [result] = await pool.query(
        'INSERT INTO pool_users (name) VALUES (?)',
        [name]
    )
    return result.insertId
}


export const createUser = async ({ name, email }) => {
    const [result] = await pool.query(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [name, email]
    );
    return result.insertId;
};