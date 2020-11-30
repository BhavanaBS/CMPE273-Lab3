const mongoose = require('mongoose');

const { Schema } = mongoose;

const restDishSchema = new Schema({
  name: { type: String, required: true },
  ingredients: { type: String, required: true },
  price: { type: String, default: 0},
  category: { type: String, required: true },
  description: { type: String, required: true },
},
{
  versionKey: false,
});

mongoose.model('dish', restDishSchema);
module.exports = restDishSchema;
