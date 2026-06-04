import pool from '../config/db.js';

export const findAllFeeds = async () => {
    const [rows] = await pool.query('SELECT id, name, type, weight, created_at FROM pool_feeds')
    return rows
}

export const createPoolFeed = async ({name, type, weight}) => {
    const [result] = await pool.query(
        'INSERT INTO pool_feeds (name, type, weight) VALUES (?, ?, ?)',
        [name, type, weight]
    )
    return result.insertId
}