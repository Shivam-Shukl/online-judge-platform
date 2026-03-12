const mongoose = require('mongoose');

// Define how a single test case looks
const TestCaseSchema = new mongoose.Schema({
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true }
});

// Define how the overall problem looks
const ProblemSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
    testCases: [TestCaseSchema] // Array of test cases
});

module.exports = mongoose.model('Problem', ProblemSchema);