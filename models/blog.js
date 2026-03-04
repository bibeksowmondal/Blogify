const { Schema, model } = require('mongoose');

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      default: ''
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

// ✅ THIS LINE IS CRITICAL
module.exports = model('blog', blogSchema);
