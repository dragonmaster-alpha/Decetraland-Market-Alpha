import { Schema, model } from 'mongoose';
const mongoosePaginate = require('mongoose-paginate-v2');

// Create Schema
const CardSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  card_name: {
    type: String,
    required: true
  },
  card_desc: {
    type: String,
    required: true
  },
  card_price: {
    type: Number,
    required: true
  },
  img_url: {
    type: String,
    required: true
  },
  status: {
    type: String, 
    enum: ['Pending', 'Sold', 'Active'],
    default: 'Active'
  },
  owner: {
      type: String,
      default: 'no'
  },
  register_date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

CardSchema.plugin(mongoosePaginate);
const Card = model('card', CardSchema);

export default Card;
