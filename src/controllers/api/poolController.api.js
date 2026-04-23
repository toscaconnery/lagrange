import ExcelJS from 'exceljs';
import * as PoolModel from '../../models/pool.model.js'
import * as PoolUserModel from '../../models/poolUser.model.js'
import * as PoolFishTypeModel from '../../models/poolFishType.model.js'
import * as PoolCycleModel from '../../models/poolCycle.model.js'
import * as PoolFeedModel from '../../models/poolFeed.model.js'
import { capitalize, formatDate } from '../../utils/formatter.js';

export const getPoolList = async (req, res, next) => {
    try {
        const pools = await PoolModel.listPools()
        const formatted = pools.map((p) => {
            return ({
                ...p,
                status: capitalize(p.status),
            })
        })

        res.json({ success: true, data: formatted })
    } catch (error) {
        next(error)
    }
}

export const getPoolUsers = async (req, res, next) => {
    try {
        const poolUsers = await PoolUserModel.findAllPoolUsers()
        res.json({ success: true, data: poolUsers})
    } catch (error) {
        next(error);
    }
}

export const addPool = async (req, res, next) => {
    try {
        const { 
            label,
            owner
        } = req.body
        console.log('--- add pool params :', label, owner)

        // const userId = res.locals.user.id;

        if (!label) {
            return res.status(400).json({ success: false, message: 'Label required.' });
        }

        if (!owner) {
            return res.status(400).json({ success: false, message: 'Owner required.' });
        }

        const id = await PoolModel.createPool({ label, owner})

        res.json({ success: true, data: {}})
    } catch (error) {
        next(error);
    }
}

export const addPoolUser = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Name is required.' });
        }

        const id = await PoolUserModel.createPoolUser({ name });
        res.status(201).json({ success: true, data: { id, name } });

    } catch (error) {
        next(error)
    }
}

export const addPoolFishType = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Name required.' });
        }

        const id = await PoolFishTypeModel.createPoolFishType({ name });
        res.status(201).json({ success: true, data: { id, name } });

    } catch (error) {
        next(error)
    }
}

export const exportPoolUserXLSX = async (req, res, next) => {
    try {
        const users = await PoolUserModel.findAllPoolUsers();

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Pool Users');

        sheet.columns = [
            { header: 'ID',   key: 'id',   width: 10 },
            { header: 'Name', key: 'name', width: 25 },
        ];

        sheet.getRow(1).eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF111111' },
            };
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        });

        users.forEach(u => sheet.addRow(u));

        const dateFileName = generateFormattedDateForFileName();
        const filename = `User-${dateFileName}.xlsx`;

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        next(err);
    }
};

export const exportPoolXLSX = async (req, res, next) => {
    try {
        const pools = await PoolModel.listPools();

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Pools');

        // Define columns with widths
        sheet.columns = [
            { header: 'ID',           key: 'id',           width: 5 },
            { header: 'Label',        key: 'label',        width: 25 },
            { header: 'Status',       key: 'status',       width: 10 },
            { header: 'Manager',      key: 'manager_name',      width: 20 },
            { header: 'Owner',        key: 'owner_name',        width: 20 },
            { header: 'Fish Species', key: 'fish_type_name', width: 20 },
            { header: 'Fish Count',   key: 'fish_count',   width: 10 },
            { header: 'Fill Date',    key: 'fill_date',    width: 20 },
        ];

        // Style header row
        sheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF111111' },
            };
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        });

        // Add rows
        pools.forEach(p => sheet.addRow(p));

        // Stream to response
        const dateFileName = generateFormattedDateForFileName();
        const filename = `Pool-${dateFileName}.xlsx`;

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        next(error)
    }
}

export const managePool = async (req, res, next) => {
    try {
        const { pool_id, manager } = req.body;
        console.log('🔥 ', pool_id, manager)

        if (!pool_id) {
            return res.status(400).json({ success: false, message: 'Invalid form.' });
        }

        if (!manager) {
            return res.status(400).json({ success: false, message: 'Manager required' });
        }

        const poolUpdate = await PoolModel.managePool({poolId: pool_id, manager: manager})

        res.status(200).json({ success: true, data: { pool_id, manager, status: poolUpdate } });
    } catch (error) {
        next(error)
    }
}

export const deletePool = async (req, res, next) => {
    try {
        const { pool_id } = req.body;

        if (!pool_id) {
            return res.status(400).json({ success: false, message: 'Invalid request.' });
        }

        const poolUpdate = await PoolModel.deletePool({poolId: pool_id})

        res.status(200).json({ success: true, data: { pool_id, status: poolUpdate } });
    } catch (error) {
        next(error)
    }
}

export const startPool = async (req, res, next) => {
    try {
        const { pool_id, fish_count, fish_type } = req.body;

        console.log('✅✅✅✅ ', pool_id, fish_count, fish_type)

        if (!pool_id) {
            return res.status(400).json({ success: false, message: 'Pool id is required' });
        }

        if (!fish_count) {
            return res.status(400).json({ success: false, message: 'Fish count could not be empty' });
        }

        if (!fish_type) {
            return res.status(400).json({ success: false, message: 'Fish type could not be empty' });
        }

        const pool = await PoolModel.findPoolById(pool_id)

        console.log('---- poool query result : ', pool)
        if (!pool) {
            return res.status(400).json({ success: false, message: 'Pool not found' });
        }

        if (!pool.manager) {
            return res.status(400).json({ success: false, message: 'Pool does not have a manager' });
        }

        const manager_id = pool.manager

        // check if pool still active
        const existingPoolCycle = await PoolCycleModel.findActivePoolCycleByPoolId({pool_id})

        console.log('------ existing pool cycle: ', existingPoolCycle)

        if (existingPoolCycle) {
            return res.status(400).json({ success: false, message: 'Pool is already active' });
        }

        const start_date = new Date();

        const poolCycleCreate = await PoolCycleModel.createPoolCycle({ pool_id, manager_id, fish_count, fish_type, start_date })

        console.log('CHECKING CHECKING ', poolCycleCreate)

        const updatePool = await PoolModel.updatePoolStatus({pool_id, status: 'active', cycle_id: poolCycleCreate})

        res.status(200).json({ success: true, data: { created: poolCycleCreate } });
    } catch (error) {
        next(error)
    }
}

export const getFeedList = async (req, res, next) => {
    try {
        const feeds = await PoolFeedModel.findAllFeeds()
        const formattedFeeds = feeds.map((p) => {
            return {
                ...p,
                created: formatDate(p.created_at)
            }
        })
        res.json({ success: true, data: formattedFeeds })
    } catch (error) {
        next(error)
    }
}

export const addFeed = async (req, res, next) => {
    try {
        const { name, type, weight } = req.body;

        console.log('🔥add-feed:', name, type, weight)

        if (!name) {
            return res.status(400).json({ success: false, message: 'Name is required.' });
        }

        if (!type) {
            return res.status(400).json({ success: false, message: 'Type is required.' });
        }

        if (!weight) {
            return res.status(400).json({ success: false, message: 'Weight is required.' });
        }

        const id = await PoolFeedModel.createPoolFeed({ name, type, weight });
        res.status(201).json({ success: true, data: { id, name, type, weight } });

    } catch (error) {
        next(error)
    }
}

const generateFormattedDateForFileName = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`
}