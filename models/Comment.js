const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  docType: {
    type: String,
    required: true
  },
  commentId: {
    type: String,
    required: true
  },
  tounamentId: {
    type: String,
    required: true
  },
  commentorId: {
    type: String,
    required: true
  },
  commmentData: {
    type: String,
    required: true
  },
  commentTime: {
    type: Date,
    default: Date.now
  }
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
