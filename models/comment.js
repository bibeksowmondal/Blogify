const { Schema, model } = require('mongoose');

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },

    blog: {
      type: Schema.Types.ObjectId,
      ref: 'blog',
      required: true
    },

    // Nested replies (1 level)
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: 'comment',
      default: null
    },

    // Likes
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'user'
    }]
  },
  { timestamps: true }
);

module.exports = model('comment', commentSchema);
