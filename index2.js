'use strict'

const port = process.env.PORT || 3000;
const express = require('express');
const syslog = require('morgan');

const app = express();

// Declaramos los middleware 
app.use(syslog('dev'));	// Probar diferencias con: tiny, short, dev, common, combined
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/api/product', (req, res) => {
	res.status(200).send({products: []});
})

app.get('/api/product/:productID', (req, res) => {
	res.status(200).send({products: `${req.params.productID}`});
})

app.post('/api/product', (req, res) => {
	//console.log("***********************************************************+\n")
	//console.log(req)
	console.log(req.body)
	res.status(200).send({products: 'El producto se ha recibido'})
})

app.put('/api/product/:productID', (req, res) => {
	res.status(200).send({products: `${req.params.productID}`})
})

app.delete('/api/product/:productID', (req, res) => {
	res.status(200).send({products: `${req.params.productID}`})
})

app.listen(port, () => {
	console.log(`API REST ejecutándose en http://localhost:${port}/api/product`)
})
