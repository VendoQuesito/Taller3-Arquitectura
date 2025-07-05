const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  videoId: String,
  likes: [String],
  comments: [{
    userId: String,
    comment: String,
    date: { type: Date, default: Date.now }
  }]
});

const Interaction = mongoose.model('Interaction', interactionSchema);

module.exports = Interaction;
