import pool from '../config/db.js';

export const findActivitiesByPlantationId = async (plantationId) => {
    const [rows] = await pool.query(
        `SELECT id, activity_type, description, amount, unit, activity_date, created_at
         FROM plantation_activities
         WHERE plantation_id = ?
         ORDER BY activity_date DESC`,
        [plantationId]
    );

    // Fetch schedules for all activities
    if (rows.length === 0) return rows;
    const ids = rows.map(r => r.id);
    const placeholders = ids.map(() => '?').join(',');

    const [schedules] = await pool.query(
        `SELECT id, activity_id, start_date, end_date
         FROM plantation_activity_schedules
         WHERE activity_id IN (${placeholders})
         ORDER BY start_date ASC`,
        ids
    );

    const [expenses] = await pool.query(
        `SELECT id, activity_id, description, amount, expense_date, created_at
         FROM plantation_activity_expenses
         WHERE activity_id IN (${placeholders})
         ORDER BY expense_date ASC`,
        ids
    );

    // Group schedules by activity_id
    const scheduleMap = {};
    for (const s of schedules) {
        if (!scheduleMap[s.activity_id]) scheduleMap[s.activity_id] = [];
        scheduleMap[s.activity_id].push({ id: s.id, start_date: s.start_date, end_date: s.end_date });
    }

    // Group expenses by activity_id
    const expenseMap = {};
    for (const e of expenses) {
        if (!expenseMap[e.activity_id]) expenseMap[e.activity_id] = [];
        expenseMap[e.activity_id].push({ id: e.id, description: e.description, amount: e.amount, expense_date: e.expense_date });
    }

    return rows.map(r => ({
        ...r,
        schedules: scheduleMap[r.id] || [],
        expenses: expenseMap[r.id] || [],
    }));
};

export const createActivity = async ({ plantation_id, activity_type, description, amount, unit, activity_date, schedules }) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const [result] = await conn.query(
            `INSERT INTO plantation_activities (plantation_id, activity_type, description, amount, unit, activity_date)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [plantation_id, activity_type, description, amount || null, unit || null, activity_date]
        );
        const activityId = result.insertId;

        // Insert schedules
        if (schedules && schedules.length > 0) {
            for (const s of schedules) {
                await conn.query(
                    `INSERT INTO plantation_activity_schedules (activity_id, start_date, end_date) VALUES (?, ?, ?)`,
                    [activityId, s.start_date, s.end_date]
                );
            }
        } else {
            // Default: single-day schedule from activity_date
            await conn.query(
                `INSERT INTO plantation_activity_schedules (activity_id, start_date, end_date) VALUES (?, ?, ?)`,
                [activityId, activity_date, activity_date]
            );
        }

        await conn.commit();
        return activityId;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
};

export const updateActivity = async ({ id, activity_type, description, amount, unit, activity_date, schedules }) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        await conn.query(
            `UPDATE plantation_activities
             SET activity_type = ?, description = ?, amount = ?, unit = ?, activity_date = ?
             WHERE id = ?`,
            [activity_type, description, amount || null, unit || null, activity_date, id]
        );

        // Replace all schedules
        await conn.query(`DELETE FROM plantation_activity_schedules WHERE activity_id = ?`, [id]);

        if (schedules && schedules.length > 0) {
            for (const s of schedules) {
                await conn.query(
                    `INSERT INTO plantation_activity_schedules (activity_id, start_date, end_date) VALUES (?, ?, ?)`,
                    [id, s.start_date, s.end_date]
                );
            }
        } else {
            // Default: single-day schedule from activity_date
            await conn.query(
                `INSERT INTO plantation_activity_schedules (activity_id, start_date, end_date) VALUES (?, ?, ?)`,
                [id, activity_date, activity_date]
            );
        }

        await conn.commit();
        return 1;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
};