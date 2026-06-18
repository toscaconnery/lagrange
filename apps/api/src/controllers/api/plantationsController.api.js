import * as PlantationsModel from '../../models/plantations.model.js';
import * as PlantationActivityModel from '../../models/plantationActivity.model.js';

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
        const { name, area_ha } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Name is required.' });
        }

        if (!area_ha || isNaN(area_ha) || Number(area_ha) <= 0) {
            return res.status(400).json({ success: false, message: 'Valid area (Ha) is required.' });
        }

        const id = await PlantationsModel.createPlantation({ name: name.trim(), area_ha: Number(area_ha) });
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
        const { activity_type, description, amount, unit, activity_date } = req.body;

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
            activity_date
        });

        res.status(201).json({ success: true, data: { id } });
    } catch (error) {
        next(error);
    }
};