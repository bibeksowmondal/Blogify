const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  fullname: { type: String },
  email: { type: String, required: true, unique: true },
  salt: { type: String },
  password: { type: String, required: true },
  profileUrl: { type: String, default: "/images/Avatar.webp" },
  role: { type: String, enum: ["USER", "admin"], default: "USER" }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, this.salt);

});

module.exports = model('user', userSchema);
