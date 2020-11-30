const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: { type: Number, required: true, default: 0 },
  review: { type: String, required: true },
  create_time: { type: String, default:null },
},
{
  versionKey: false,
});

module.exports = reviewSchema;
