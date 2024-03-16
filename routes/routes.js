const express = require('express');
const ModelAsset = require('../models/asset');
const ModelConnector = require('../models/connector');
const router = express.Router();

//Post Method
router.post('/cataloguing/asset', async (req, res) => {
    const asset = new ModelAsset({
        type: req.body.type,
        description: req.body.description,
        pilot: req.body.pilot,
        format: req.body.format,
        connector_type: req.body.connector_type,
        connector_id: req.body.connector_id
    })

    try {
        const assetToSave = await asset.save();
        res.status(200).json(assetToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Get all Method
router.get('/cataloguing/asset', async (req, res) => {
    try {
        const asset = await ModelAsset.find();
        res.json(asset)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get by ID Method
router.get('/cataloguing/asset/:id', async (req, res) => {
    try {
        const asset = await ModelAsset.findById(req.params.id);
        res.json(asset)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/cataloguing/asset/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const asset = await ModelAsset.findByIdAndDelete(id)
        res.send(`Document with ${asset.type} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.get('/cataloguing/asset/Pilot/:PilotName', async (req, res) => {
    try {
        const asset = await ModelAsset.find({ pilot: req.params.PilotName });
        res.json(asset)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Post Method
router.post('/cataloguing/connector', async (req, res) => {
    const connector = new ModelConnector({
        type: req.body.type,
        type_id: req.body.type_id
    })

    try {
        const connectorToSave = await connector.save();
        res.status(200).json(connectorToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Get all Method
router.get('/cataloguing/connector', async (req, res) => {
    try {
        const connector = await ModelConnector.find();
        res.json(connector)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get by ID Method
router.get('/cataloguing/connector/:id', async (req, res) => {
    try {
        const connector = await ModelConnector.findById(req.params.id);
        res.json(connector)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/cataloguing/connector/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const connector = await ModelConnector.findByIdAndDelete(id)
        res.send(`Document with ${connector.type} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.get('/cataloguing/connector/Type', async (req, res) => {
    try {
        const types = await ModelConnector.distinct('type');
        res.json(types);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.get('/cataloguing/connector/Type/:type_id', async (req, res) => {
    try {
        const connector = await ModelConnector.find({ type_id: req.params.type_id });
        res.json(connector)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router;