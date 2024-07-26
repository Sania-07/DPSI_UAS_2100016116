const express = require('express');
const router = express.Router();
const { ServiceOrder } = require('../models'); // Assume ServiceOrder is a model defined in models folder
const { authenticate } = require('../middleware/auth');
const { Op } = require('sequelize');

// Route to create a new service order
router.post('/', authenticate, async (req, res) => {
    try {
        const { user_id, service_type, service_description, service_date, service_status } = req.body;
        const serviceOrder = await ServiceOrder.create({ user_id, service_type, service_description, service_date, service_status });
        res.status(201).json(serviceOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to get all service orders
router.get('/', async (req, res) => {
    let { page = 1, limit = 10 } = req.query; // Default page 1 and limit 10 per page

    // Validate and parse limit to ensure it's a number
    limit = parseInt(limit, 10);

    try {
        const offset = (page - 1) * limit;

        const serviceOrders = await ServiceOrder.findAndCountAll({
            offset,
            limit,
        });

        if (serviceOrders.rows.length === 0) {
            res.status(404).json({ message: 'Service orders not found' });
        } else {
            const totalCount = serviceOrders.count;
            const totalPages = Math.ceil(totalCount / limit);

            const response = {
                totalCount,
                totalPages,
                currentPage: page,
                serviceOrders: serviceOrders.rows,
            };

            res.json(response);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get a service order by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const serviceOrder = await ServiceOrder.findByPk(id);
        if (!serviceOrder) throw new Error('Service order not found');
        res.json(serviceOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to update a service order by ID
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, service_type, service_description, service_date, service_status } = req.body;
        const serviceOrder = await ServiceOrder.findByPk(id);
        if (!serviceOrder) throw new Error('Service order not found');
        serviceOrder.user_id = user_id;
        serviceOrder.service_type = service_type;
        serviceOrder.service_description = service_description;
        serviceOrder.service_date = service_date;
        serviceOrder.service_status = service_status;
        await serviceOrder.save();
        res.json(serviceOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to delete a service order by ID
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const serviceOrder = await ServiceOrder.findByPk(id);
        if (!serviceOrder) throw new Error('Service order not found');
        await serviceOrder.destroy();
        res.sendStatus(204);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
