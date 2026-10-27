const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.methods.toSafe = function () {
  return { id: this._id, name: this.name, email: this.email, phone: this.phone, address: this.address };
};

module.exports = mongoose.model('User', userSchema);