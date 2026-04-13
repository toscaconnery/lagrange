import pool from '../config/db.js';

export const findPoolById = async (id) => {
    const [rows] = await pool.query(`
        SELECT p.id, p.label, p.status, p.fish_species, p.fish_count, p.notes, p.manager, p.owner, p.fill_date ,
        pu.name AS owner_name, pm.name AS manager_name
        FROM pools p
        LEFT JOIN pool_users pu ON p.owner = pu.id
        LEFT JOIN pool_users pm ON p.manager = pm.id
        WHERE p.id = ?`,
        [id]
    );
    return rows[0] ?? null;
}

export const findPoolByIdx = async (id) => {
    const [rows] = await pool.query(`
        SELECT p.id, p.label, p.status, p.fish_species, p.fish_count, p.notes, p.manager, p.owner, p.fill_date ,
        pu.name AS owner_name
        FROM pools p
        LEFT JOIN pool_users pu ON p.owner = pu.id
        WHERE p.id = ?`,
        [id]
    );
    return rows[0] ?? null;
}


export const findAllPools = async () => {
    const [rows] = await pool.query(`
        SELECT 
            p.id, p.label, p.status, p.fish_species, p.fish_count, 
            p.notes, p.manager, p.owner, p.fill_date,
            pu.name AS owner_name, pm.name AS manager_name
        FROM pools p
        LEFT JOIN pool_users pu ON p.owner = pu.id
        LEFT JOIN pool_users pm ON p.manager = pm.id
        WHERE deleted_at IS NULL;
    `)
    return rows;
}

export const createPool = async ({ label, owner }) => {
    const status = 'inactive'
    const notes = ''
    const fish_species = null
    const manager = null
    const fill_date = null
    const [result] = await pool.query(
        'INSERT INTO pools (label, status, fish_species, notes, manager, owner, fill_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [label, status, fish_species, notes, manager, owner, fill_date]
    );
    return result.insertId;
};

export const deletePool = async ({ poolId }) => {
    const [result] = await pool.query(
        'UPDATE pools SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?',
        [poolId]
    )
    return result;
}

export const managePool = async ({ poolId, manager }) => {
    const [result] = await pool.query(
        'UPDATE pools SET manager = ? WHERE id = ? AND deleted_at IS NULL',
        [manager, poolId]
    );
    return result;
};