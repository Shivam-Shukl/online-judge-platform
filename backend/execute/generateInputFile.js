const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirInputs = path.join(__dirname, '../inputs');

// Create the inputs directory if it doesn't exist
if (!fs.existsSync(dirInputs)) {
    fs.mkdirSync(dirInputs, { recursive: true });
}

const generateInputFile = async (input) => {
    const jobId = uuid();
    const input_filename = `${jobId}.txt`;
    const input_filepath = path.join(dirInputs, input_filename);
    
    // Write the database test case input into this text file
    fs.writeFileSync(input_filepath, input);
    
    return input_filepath;
};

module.exports = {
    generateInputFile,
};