const express = require('express')
const PORT = process.env.PORT || 3001
const app = express()
const bp = require('body-parser')
const {Topping, Pizza} = require('../db/index.js')

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
  const newTopping = await Topping.create(req.body)
  res.json(newTopping)
})

app.delete('/api/toppings/:id', async (req, res) => {
  const result = await Topping.deleteOne({_id: req.params.id})
  console.log('result:', result)
  res.json(result)
})

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))