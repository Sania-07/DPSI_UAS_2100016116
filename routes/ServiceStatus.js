const express = require('express');
const router = express.Router();
const { ServiceStatus } = require('../models'); // Assume ServiceStatus is a model defined in models folder
const { authenticate } = require('../middleware/auth');
const { Op } = require('sequelize');

// Route to create a new service status
router.post('/', authenticate, async (req, res) => {
    try {
        const { order_id, status_description, update_time } = req.body;
        const serviceStatus = await ServiceStatus.create({ order_id, status_description, update_time });
        res.status(201).json(serviceStatus);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to get all service statuses
router.get('/', async (req, res) => {
    let { page = 1, limit = 10 } = req.query; // Default page 1 and limit 10 per page

    // Validate and parse limit to ensure it's a number
    limit = parseInt(limit, 10);

    try {
        const offset = (page - 1) * limit;

        const serviceStatuses = await ServiceStatus.findAndCountAll({
            offset,
            limit,
        });

        if (serviceStatuses.rows.length === 0) {
            res.status(404).json({ message: 'Service statuses not found' });
        } else {
            const totalCount = serviceStatuses.count;
            const totalPages = Math.ceil(totalCount / limit);

            const response = {
                totalCount,
                totalPages,
                currentPage: page,
                serviceStatuses: serviceStatuses.rows,
            };

            res.json(response);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get a service status by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const serviceStatus = await ServiceStatus.findByPk(id);
        if (!serviceStatus) throw new Error('Service status not found');
        res.json(serviceStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to update a service status by ID
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { order_id, status_description, update_time } = req.body;
        const serviceStatus = await ServiceStatus.findByPk(id);
        if (!serviceStatus) throw new Error('Service status not found');
        serviceStatus.order_id = order_id;
        serviceStatus.status_description = status_description;
        serviceStatus.update_time = update_time;
        await serviceStatus.save();
        res.json(serviceStatus);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to delete a service status by ID
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const serviceStatus = await ServiceStatus.findByPk(id);
        if (!serviceStatus) throw new Error('Service status not found');
        await serviceStatus.destroy();
        res.sendStatus(204);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
