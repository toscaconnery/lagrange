import ExcelJS from 'exceljs';
import * as PoolModel from '../../models/pool.model.js'
import * as PoolUserModel from '../../models/poolUser.model.js'
import * as PoolFishTypeModel from '../../models/poolFishType.model.js'

export const getPools = async (req, res, next) => {
    try {
        const pools = await PoolModel.findAllPools()
        res.json({ success: true, data: pools })
    } catch (error) {
        next(error);
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
            return res.status(400).json({ success: false, message: 'Name required.' });
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
        const pools = await PoolModel.findAllPools();

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Pools');

        // Define columns with widths
        sheet.columns = [
            { header: 'ID',           key: 'id',           width: 5 },
            { header: 'Label',        key: 'label',        width: 25 },
            { header: 'Status',       key: 'status',       width: 10 },
            { header: 'Manager',      key: 'manager',      width: 20 },
            { header: 'Owner',        key: 'owner',        width: 20 },
            { header: 'Fish Species', key: 'fish_species', width: 20 },
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

const generateFormattedDateForFileName = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`
}