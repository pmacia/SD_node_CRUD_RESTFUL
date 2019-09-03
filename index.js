'use strict'

const port = process.env.PORT || 3000

const express = require('express');
const logger =require('morgan')
const mongojs = require('mongojs');
const cors = require('cors');

const app = express();

var db = mongojs("SD");						// Enlazamos con la DB "SD"
var id = mongojs.ObjectID;					// Función para convertir un id textual en un objectID


// middlewares
var allowCrossTokenHeader = (req, res, next) => {
	res.header("Access-Control-Allow-Headers", "*");
	return next();
};

var allowCrossTokenOrigin = (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	return next();
};

app.use(cors());
app.use(allowCrossTokenHeader);
app.use(allowCrossTokenOrigin);

app.use(logger('dev'))      // probad tiny, short, common, combined
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Añadimos un trigger para cambiar de colección (tabla) dinámicamente
app.param("coleccion", (req, res, next, coleccion)=>{
    req.collection = db.collection(coleccion)
    return next()
})

// Routes
app.get('/api', (req, res, next) =>{
    db.getCollectionNames((err, colecciones) => {
        if(err) return next(err)
        res.json(colecciones)
    })
})

app.get('/api/:coleccion', (req, res, next) =>{
    req.collection.find((err, coleccion) => {
        if(err) return next(err)
        res.json(coleccion)
    })
})

app.get('/api/:coleccion/:id', (req, res, next) =>{
    req.collection.findOne({_id: id(req.params.id)},(err, elemento) => {
        if(err) return next(err)
        res.json(elemento)
    })
})

app.post('/api/:coleccion', (req, res, next) =>{
    const elemento = req.body

    req.collection.save(elemento, (err, coleccionGuardada) => {
        if(err) return next(err)
        res.json(coleccionGuardada)
    })
})

app.put('/api/:coleccion/:id', (req, res, next) => {
	console.log('PUT /api/:coleccion/:id');
	console.log(req.params.id);
	console.log(req.body);

	let elementoId = req.params.id;
	let elementoNuevo = req.body;

	req.collection.update({_id: id(elementoId)}, {$set: elementoNuevo}, {safe: true, multi: false}, (err, result) => {
		if (err) return next(err);
		res.json(result);
	});
});

app.delete('/api/:coleccion/:id', (req, res, next) => {
	console.log('DELETE /api/:coleccion/:id');
	console.log(req.params.id);
	console.log(req.collection);

	let elementoId = req.params.id;
	
	req.collection.remove({_id: id(elementoId)}, (err, result) => {
		if (err) return next(err);
		res.json(result);
	});
});


// Iniciamos la aplicación
app.listen(port, () => {
	console.log(`API REST ejecutándose en http://localhost:${port}/api/:coleccion/:id`);
});
