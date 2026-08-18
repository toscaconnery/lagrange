import pool from '../config/db.js';

export const listFisheryFeeds = async () => {
    const [rows] = await pool.query(`
        SELECT f.*
        FROM fishery_feeds f
        WHERE f.deleted_at IS NULL;
    `)
    return rows
}

export const createFisheryFeed = async ({ name, type, weight}) => {
    const [result] = await pool.query(
        'INSERT INTO fishery_feeds (name, type, weight) VALUES (?, ?, ?)',
        [name, type, weight]
    )

    return result.insertId;
}