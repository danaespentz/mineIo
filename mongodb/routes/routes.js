const express = require('express');
const mongoose = require('mongoose');
const ModelAsset = require('../models/asset');
const ModelConnector = require('../models/connector');
const router = express.Router();

//Post Method
router.post('/cataloguing/asset', async (req, res) => {
    const { model, pilot, interface: { connector, protocol, parameters } } = req.body;

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
            parameters: parameters.map(param => ({
                name: param.name,
                value: param.value
            }))
        }
    });

    try {
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

        if (!collectionName) {
            const directoryParam = asset.interface.parameters.find(param => param.name === 'directory');
            const directory = directoryParam ? directoryParam.value : null;
            if (directory) {
                return res.status(200).json({ message: `Data assets should be imported to Hadoop in ${directory}`});
            } else {
                return res.status(400).json({ message: "Collection name not specified" });
            }
        }

        let objects = req.body.values;

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