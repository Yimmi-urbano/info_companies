const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3234;

mongoose.connect('mongodb+srv://data_user:wY1v50t8fX4lMA85@cluster0.entyyeb.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Collection = require('./Modelo');
app.use(express.json());
app.use(cors());

app.post('/company', async (req, res) => {
  try {
    const newDocument = new Collection(req.body);
    await newDocument.save();
    res.status(201).json(newDocument);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/company/:userId/:storeId', async (req, res) => {
  try {
    const { userId, storeId } = req.params;
    const document = await Collection.findOne({ userId, storeId });
    if (document) {
      res.status(200).json(document);
    } else {
      res.status(404).json({ error: 'Documento no encontrado' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/company', async (req, res) => {
  try {
    const { userId, domain } = req.query;
    let query = {};

    if (userId) {
      query.userId = userId;
    }

    if (domain) {
      query.domain = domain;
    }

    const documents = await Collection.find(query);

    if (documents.length > 0) {
      res.status(200).json(documents);
    } else {
      res.status(200).json([]);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});




app.put('/company/:userId/:storeId', async (req, res) => {
  try {
    const { userId, storeId } = req.params;
    const existingDocument = await Collection.findOne({ userId, storeId });

    if (!existingDocument) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    const updatedDocument = deepMerge(existingDocument, req.body);
    await updatedDocument.save();

    res.status(200).json(updatedDocument);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] instanceof Object) {
      target[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

app.delete('/company/:userId/:storeId', async (req, res) => {
  try {
    const { userId, storeId } = req.params;
    const deletedDocument = await Collection.findOneAndRemove({ userId, storeId });
    if (deletedDocument) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Documento no encontrado' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});

