const express = require('express')
const PORT = process.env.PORT || 3001
const app = express()
const bp = require('body-parser')
const { Topping, Pizza } = require('../db/index.js')

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/../client/build'))

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server' })
})

app.get('/api/toppings', async (req, res) => {
  const toppings = await Topping.find()
  res.json(toppings)
})

app.post('/api/toppings', async (req, res) => {
  const record = await Topping.findOne({ name: req.body.name })
  if (record) {
    return res.status(400).json({ message: `The topping ${req.body.name} already exists.` })
  }
  const newTopping = await Topping.create(req.body)
  res.json(newTopping)
})

app.put('/api/toppings/:id', async (req, res) => {
  const id = req.params.id
  const updatedTopping = await Topping.updateOne({ _id: id }, req.body)
  console.log('updatedTopping:', updatedTopping)
  res.json(updatedTopping)
})

app.delete('/api/toppings/:id', async (req, res) => {
  const result = await Topping.deleteOne({ _id: req.params.id })
  console.log('result:', result)
  res.json(result)
})

app.get('/api/pizzas', async (req, res) => {
  const pizzas = await Pizza.find()
  res.json(pizzas)
})

app.post('/api/pizzas', async (req, res) => {
  const record = await Pizza.findOne({ name: req.body.name })
  if (record) {
    return res.status(400).json({ message: `The pizza with name ${req.body.name} already exists.` })
  }
  const newPizza = await Pizza.create(req.body)
  console.log('newPizza:', newPizza)
  res.json(newPizza)
})

app.put('/api/pizzas/:id', async (req, res) => {
  const id = req.params.id
  const updatedPizza = await Pizza.updateOne({ _id: id }, req.body)
  console.log('updatedPizza:', updatedPizza)
  res.json(updatedPizza)
})

app.delete('/api/pizzas/:id', async (req, res) => {
  const result = await Pizza.deleteOne({ _id: req.params.id })
  console.log('result:', result)
  res.json(result)
})

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))