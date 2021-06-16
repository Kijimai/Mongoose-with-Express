const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')

//import product.js from models
const Product = require('./models/product')

mongoose.connect('mongodb://localhost:27017/farmstandDB', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('Connection Established.')
  })
  .catch( err => {
    console.log('An error has occured: ')
    console.log(err)
  })

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))

app.get('/products', async (req, res) => {
  const products = await Product.find({})
  res.render('products/index', { products })
})

app.post('/products', async (req, res) => {
  const newProduct = new Product(req.body)
  await newProduct.save()
  res.redirect(`/products/${newProduct._id}`)
})

app.get('/products/new', async (req, res) => {
  res.render('products/new')
})

app.get('/products/:id', async (req, res) => {
  const { id } = req.params
  const foundProduct = await Product.findById(id)
  // if(foundProduct != id) {
  //   res.render('products/errorPage')
  // }
  res.render('products/show', { foundProduct })
})

app.get('/products/:id/edit', async (req, res) => {
  const { id } = req.params
  const product = await Product.findById(id)
  res.render('products/edit', { product })
})

app.listen(3000, () => {
  console.log('Listening on port 3000.')
})