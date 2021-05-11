import { Schema, model } from 'mongoose';
const mongoosePaginate = require('mongoose-paginate-v2');

// Create Schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  team_id: {
    type: String,
    required: true
  },
  status: {
    type: String, 
    enum: ['Pending', 'Active'],
    default: 'Pending'
  },
  confirmationCode: { 
    type: String, 
    unique: true },
  register_date: {
    type: Date,
    default: Date.now
  },
  mana: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

UserSchema.plugin(mongoosePaginate);
const User = model('user', UserSchema);

export default User;
