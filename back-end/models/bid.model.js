import { Schema, model } from 'mongoose';
const mongoosePaginate = require('mongoose-paginate-v2');

// Create Schema
const BidSchema = new Schema({
  user_id: {
    type: Number,
    required: true
  },
  card_id: {
    type: Number,
    required: true
  },
  bid_price: {
    type: Number,
    required: true
  },
  status: {
    type: String, 
    enum: ['Pending', 'Approved'],
    default: 'Pending'
  },
  register_date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

BidSchema.plugin(mongoosePaginate);
const Bid = model('bid', BidSchema);

export default Bid;
