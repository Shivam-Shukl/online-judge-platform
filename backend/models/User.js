const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }]
}, { timestamps: true });

// This is the crucial line that makes findOne() work!
module.exports = mongoose.model('User', UserSchema);