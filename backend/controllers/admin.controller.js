const mongoose = require('mongoose');

async function getCollections(req, res) {
    try {
        console.log(mongoose.connection.modelNames());
        res.json(mongoose.connection.modelNames());
    } catch (err) {
        res.json(err);
    }
}

async function getOneCollection(req, res) {
    try {
        const modelName = req.params.modelName;

        if (mongoose.connection.modelNames().includes(modelName)) {
            mongoose.connection
                .model(modelName)
                .find({})
                .then((results) => {
                    res.json(results);
                });
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.json(err);
    }
}

async function getOneDocument(req, res) {
    try {
        const modelName = req.params.modelName;
        const docId = req.params.docId;
        const document = await mongoose.connection
            .model(modelName)
            .findOne({ _id: docId })
            .exec();

        if (document) {
            res.json(document);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.json(err);
    }
}

async function deleteOneDocument(req, res) {
    try {
        const modelName = req.params.modelName;
        const docId = req.params.docId;

        res.json(
            await mongoose.connection.model(modelName).deleteOne({ _id: docId })
        );
    } catch (err) {
        res.json(err);
    }
}

module.exports = {
    getCollections,
    getOneCollection,
    getOneDocument,
    deleteOneDocument,
};
