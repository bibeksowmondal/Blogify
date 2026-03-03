

const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: 'Invalid email format'
      }
    },

    password: {
      type: String,
      required: true,
      minlength: 8
    },

    profileUrl: {
      type: String,
      default: '/images/Avatar.webp'
    },

    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER'
    }
  },
  { timestamps: true }
);

/* =========================
   Hash password before save
   ========================= */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12); // stronger than 10
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

/* =========================
   Compare password method
   ========================= */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = model('User', userSchema);