const express = require('express');
const mongoose = require('mongoose');
const ModelAsset = require('../models/asset');
const ModelConnector = require('../models/connector');
const router = express.Router();
const import_to_hadoop = require('../models/import_to_hadoop');

/**
 * @swagger
 * /api/cataloguing/asset:
 *   post:
 *     description: Create a new asset
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: asset
 *         description: The asset to add
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             model:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                 type:
 *                   type: string
 *                 format:
 *                   type: string
 *               required:
 *                 - description
 *                 - type
 *                 - format
 *             pilot:
 *               type: string
 *             interface:
 *               type: object
 *               properties:
 *                 connector:
 *                   type: string
 *                 protocol:
 *                   type: string
 *                 parameters:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       value:
 *                         type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request
 */
router.post('/cataloguing/asset', async (req, res) => {
    try {
        const { model, pilot, interface } = req.body;

        // Check if model is provided
        if (!model || !model.description || !model.type || !model.format) {
            return res.status(400).json({ message: "Model description, type, and format are required." });
        }

        // Extract interface properties
        let connector, protocol, parameters;
        if (interface) {
            ({ connector, protocol, parameters } = interface);
        }

        // Create new asset instance
        const asset = new ModelAsset({
            model: {
                description: model.description,
                type: model.type,
                format: model.format
            },
            pilot: pilot,
            interface: {
                name: connector,
                protocol: protocol,
                parameters: parameters ? parameters.map(param => ({
                    name: param.name,
                    value: param.value
                })) : []
            }
        });

        // Save asset to database
        const assetToSave = await asset.save();
        res.status(200).json(assetToSave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/*JSON object example

{
	"model": {
		"description": "Sample asset",
		"type": "sensorial",
		"format": "json"
	},
	"pilot": "Pilot4",
	"interface": {
		"connector": "mongo",
		"protocol": "http",
		"parameters": [
			{
				"name": "server",
				"value": "mongo_ip"
			},
			{
				"name": "port",
				"value": "portnum"
			},
			{
				"name": "collection",
				"value": "collection_name"
			},
			{
				"name": "username",
				"value": "user"
			},
			{
				"name": "password",
				"value": "pass"
			}
		]
	}
}

*/

//Get all Method
/**
 * @swagger
 * /api/cataloguing/asset:
 *   get:
 *     summary: Display all assets
 *     description: Display all assets
 *     produces:
 *      - application/json
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Bad request
 */
router.get('/cataloguing/asset', async (req, res) => {
    try {
        const assets = await ModelAsset.find();
        res.json({ Asset: assets }); // Wrap assets in an object with key 'Asset'
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//Get by ID Method
/**
 * @swagger
 * /api/cataloguing/asset/{id}:
 *   get:
 *     summary: Display asset with ID
 *     description: Display asset with ID
 *     produces:
 *      - application/json
 *     parameters:
 *      - in: path
 *        name: id
 *        description: Dispay Asset from DB.
 *        schema:
 *          type: string
 *          required:
 *            - id
 *          properties:
 *            id:
 *              type: string
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Bad request
 */
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
/**
 * @swagger
 * /api/cataloguing/asset/{id}:
 *   delete:
 *     summary: Display asset with ID
 *     description: Display asset with ID
 *     produces:
 *      - application/json
 *     parameters:
 *      - in: path
 *        name: id
 *        description: Dispay Asset from DB.
 *        schema:
 *          type: string
 *          required:
 *            - id
 *          properties:
 *            id:
 *              type: string
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Bad request
 */
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
/**
 * @swagger
 * /api/cataloguing/asset/Pilot/{PilotName}:
 *   get:
 *     summary: Display all asset in a pilot
 *     description: Display all asset in a pilot
 *     produces:
 *      - application/json
 *     parameters:
 *      - in: path
 *        name: PilotName
 *        description: Dispay Assets from DB.
 *        schema:
 *          type: string
 *          required:
 *            - PilotName
 *          properties:
 *            PilotName:
 *              type: string
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Bad request
 */
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
/**
 * @swagger
 * /api/cataloguing/connector:
 *   post:
 *     summary: Create a connector
 *     description: Create a connector
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: connector
 *         description: The connector to add
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             protocol:
 *               type: string
 *             parameters:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   value:
 *                     type: string
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Bad request
 */
router.post('/cataloguing/connector', async (req, res) => {
    const connector = new ModelConnector({
        name: req.body.name,
        protocol: req.body.protocol,
        parameters: {
            name: req.body.parameters_name,
            value: req.body.parameters_value,
        }
    })

    try {
        const connectorToSave = await connector.save();
        res.status(200).json(connectorToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

/*JSON object example

{
    "name": "mongodb",
    "protocol": "http",
    "parameters_name": "mongo",
    "parameters_value": "cluster0"
}

*/

//Get all Method
/**
 * @swagger
 * /api/cataloguing/connector:
 *   get:
 *     summary: Get all connectors
 *     description: Get all connectors
 *     produces:
 *      - application/json
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Bad request
 */
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
/**
 * @swagger
 * /api/cataloguing/connector/{id}:
 *   get:
 *     summary: Get connector with ID
 *     description: Get connector with ID
 *     produces:
 *      - application/json
 *     parameters:
 *      - in: path
 *        name: id
 *        description: Dispay Connector from DB.
 *        schema:
 *          type: string
 *          required:
 *            - id
 *          properties:
 *            id:
 *              type: string
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Bad request
 */
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
/**
 * @swagger
 * /api/cataloguing/connector/{id}:
 *   delete:
 *     summary: Delete connector with ID
 *     description: Delete connector with ID
 *     produces:
 *      - application/json
 *     parameters:
 *      - in: path
 *        name: id
 *        description: Dispay Connector from DB.
 *        schema:
 *          type: string
 *          required:
 *            - id
 *          properties:
 *            id:
 *              type: string
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Bad request
 */
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

/**
 * @swagger
 * /api/cataloguing/connectorTypes:
 *   get:
 *     summary: Get all connector types
 *     description: Get all connector types
 *     produces:
 *      - application/json
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Bad request
 */
router.get('/cataloguing/connectorTypes', async (req, res) => {
    try {
        const types = await ModelConnector.distinct('name');
        res.json(types);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


router.post('/data/upload/:asset_id', async (req, res) => {
    try {
        const asset = await ModelAsset.findById(req.params.asset_id);
        if (!asset) {
            return res.status(404).json({ message: "Asset not found" });
        }

        const collectionParam = asset.interface.parameters.find(param => param.name === 'collection');
        const collectionName = collectionParam ? collectionParam.value : null;
        let objects = req.body.values;

        if (!collectionName) {
            const directoryParam = asset.interface.parameters.find(param => param.name === 'directory');
            const directory = directoryParam ? directoryParam.value : null;
            if (directory) {
                console.log(objects);
                console.log(directory);
                import_to_hadoop(objects,directory);
                return res.status(200).json({ message: `Data assets should be imported to Hadoop in ${directory}`});
            } else {
                return res.status(400).json({ message: "Collection name not specified" });
            }
        }

        if (!Array.isArray(objects)) {
            objects = [objects];
        }
        const collection = mongoose.connection.collection(collectionName);
        await Promise.all(objects.map(async (object) => {
            await collection.insertOne(object);
        }));

        res.status(200).json({ message: 'Data assets successfully imported' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/data/get/:asset_id', async (req, res) => {
    try {
        const asset = await ModelAsset.findById(req.params.asset_id);
        if (!asset) {
            return res.status(404).json({ message: "Asset not found" });
        }
        const collectionParam = asset.interface.parameters.find(param => param.name === 'collection');
        const collectionName = collectionParam ? collectionParam.value : null;
        if (!collectionName) {
            const directoryParam = asset.interface.parameters.find(param => param.name === 'directory');
            const directory = directoryParam ? directoryParam.value : null;
            if (directory) {
                return res.status(200).json({ message: `Data assets are stored to Hadoop in ${directory}`});
            } else {
                return res.status(400).json({ message: "Collection name not specified" });
            }
        }
        const collection = mongoose.connection.collection(collectionName);
        const data = await collection.find({}).toArray();
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router;

//maybe take the credentials and make a connection everytime 
//connection with hadoop
//hadoop api maybe better cli ?
//api with the import tool(arcdfs)