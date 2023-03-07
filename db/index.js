if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB is connected!'))
  .catch(err => console.log('MongoDB connection error:', err))

const Topping = mongoose.model('topping', {
  name: String,
  category: String
})

const Pizza = mongoose.model('pizza', {
  name: String,
  toppings: [String]
})

module.exports = { Topping, Pizza }