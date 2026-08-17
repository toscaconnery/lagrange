import * as PlantationsModel from '../../models/plantations.model.js';
import * as PlantationActivityModel from '../../models/plantationActivity.model.js';
import * as PlantationExpenseModel from '../../models/plantationExpense.model.js';

export const listPlantations = async (req, res, next) => {
    try {
        const plantations = await PlantationsModel.findAllPlantations();
        res.json({ success: true, data: plantations });
    } catch (error) {
        next(error);
    }
};

export const addPlantation = async (req, res, next) => {
    try {
        console.log('--- creating plantation')
        const { name, area_ha } = req.body;
        console.log('---', name, area_ha)

        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Name is required.' });
        }

        if (!area_ha || isNaN(area_ha) || Number(area_ha) <= 0) {
            return res.status(400).json({ success: false, message: 'Valid area (Ha) is required.' });
        }
        console.log('--- params ok')

        const id = await PlantationsModel.createPlantation({ name: name.trim(), area_ha: Number(area_ha) });
        console.log('--- createPlantation ok')
        res.status(201).json({ success: true, data: { id, name: name.trim(), area_ha: Number(area_ha) } });
    } catch (error) {
        next(error);
    }
};

export const getPlantationDetail = async (req, res, next) => {
    try {
        const id = req.params.id;

        const plantation = await PlantationsModel.findPlantationById(id);
        if (!plantation) {
            return res.status(404).json({ success: false, message: 'Plantation not found.' });
        }

        const activities = await PlantationActivityModel.findActivitiesByPlantationId(id);

        res.json({ success: true, data: { ...plantation, activities } });
    } catch (error) {
        next(error);
    }
};

export const addPlantationActivity = async (req, res, next) => {
    try {
        const plantation_id = req.params.id;
        const { activity_type, description, amount, unit, activity_date, schedules } = req.body;

        // Verify plantation exists
        const plantation = await PlantationsModel.findPlantationById(plantation_id);
        if (!plantation) {
            return res.status(404).json({ success: false, message: 'Plantation not found.' });
        }

        if (!activity_type || !activity_type.trim()) {
            return res.status(400).json({ success: false, message: 'Activity type is required.' });
        }

        if (!activity_date) {
            return res.status(400).json({ success: false, message: 'Activity date is required.' });
        }

        const id = await PlantationActivityModel.createActivity({
            plantation_id,
            activity_type: activity_type.trim(),
            description: description?.trim() || null,
            amount: amount || null,
            unit: unit?.trim() || null,
            activity_date,
            schedules: schedules || [],
        });

        res.status(201).json({ success: true, data: { id } });
    } catch (error) {
        next(error);
    }
};

export const updatePlantationActivity = async (req, res, next) => {
    try {
        const activityId = req.params.activityId;
        const { activity_type, description, amount, unit, activity_date, schedules } = req.body;

        if (!activity_type || !activity_type.trim()) {
            return res.status(400).json({ success: false, message: 'Activity type is required.' });
        }

        if (!activity_date) {
            return res.status(400).json({ success: false, message: 'Activity date is required.' });
        }

        const affected = await PlantationActivityModel.updateActivity({
            id: activityId,
            activity_type: activity_type.trim(),
            description: description?.trim() || null,
            amount: amount || null,
            unit: unit?.trim() || null,
            activity_date,
            schedules: schedules || [],
        });

        if (affected === 0) {
            return res.status(404).json({ success: false, message: 'Activity not found.' });
        }

        res.json({ success: true, data: { id: Number(activityId) } });
    } catch (error) {
        next(error);
    }
};

// --- Expense Controllers ---

export const addActivityExpense = async (req, res, next) => {
    try {
        const { activityId } = req.params;
        const { description, amount, expense_date } = req.body;

        if (!description || !description.trim()) {
            return res.status(400).json({ success: false, message: 'Description is required.' });
        }

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({ success: false, message: 'Valid amount is required.' });
        }

        if (!expense_date) {
            return res.status(400).json({ success: false, message: 'Expense date is required.' });
        }

        const id = await PlantationExpenseModel.createExpense({
            activity_id: activityId,
            description: description.trim(),
            amount: Number(amount),
            expense_date
        });

        res.status(201).json({ success: true, data: { id } });
    } catch (error) {
        next(error);
    }
};

export const updateActivityExpense = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { description, amount, expense_date } = req.body;

        if (!description || !description.trim()) {
            return res.status(400).json({ success: false, message: 'Description is required.' });
        }

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({ success: false, message: 'Valid amount is required.' });
        }

        if (!expense_date) {
            return res.status(400).json({ success: false, message: 'Expense date is required.' });
        }

        const affected = await PlantationExpenseModel.updateExpense({
            id,
            description: description.trim(),
            amount: Number(amount),
            expense_date
        });

        if (affected === 0) {
            return res.status(404).json({ success: false, message: 'Expense not found.' });
        }

        res.json({ success: true, data: { id: Number(id) } });
    } catch (error) {
        next(error);
    }
};

export const deleteActivityExpense = async (req, res, next) => {
    try {
        const { id } = req.params;

        const affected = await PlantationExpenseModel.deleteExpense(id);

        if (affected === 0) {
            return res.status(404).json({ success: false, message: 'Expense not found.' });
        }

        res.json({ success: true });
    } catch (error) {
        next(error);
    }
};

export const deletePlantationDetail = async (req, res, next) => {
    try {
        const id = req.params.id;

        const plantation = await PlantationsModel.findPlantationById(id);
        if (!plantation) {
            return res.status(404).json({ success: false, message: 'Plantation not found.' });
        }

        const affected = await PlantationsModel.deletePlantation(id);

        if (affected === 0) {
            return res.status(404).json({ success: false, message: 'Plantation not found.' });
        }

        res.json({ success: true });
    } catch (error) {
        next(error);
    }
};

export const updatePlantationDetail = async (req, res, next) => {
    try {
        const plantation_id = req.params.id;
        const { name, area_ha } = req.body;
        console.log(plantation_id)

        // validation
        if (
            !String(name) ||
            !Number(area_ha) || 
            isNaN(area_ha) || // Ensure number is valid
            area_ha < 0 // Area can't be negative
        ) {
            return res.status(400).json({ success: false, message: 'Input error' });
        }

        const plantation = await PlantationsModel.findPlantationById(plantation_id);

        if (plantation === null) {
            return res.status(404).json({ success: false, message: 'Plantation not found.' });
        }

        const affected = await PlantationsModel.updatePlantation({
            name, area_ha, id: plantation_id
        })


        res.json({ success: true, plantation_id, name, area_ha, plantation, affected }); 

    } catch (error) {
        next(error);
    }
}