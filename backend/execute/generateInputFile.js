const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirInputs = path.join(__dirname, 'inputs');

if (!fs.existsSync(dirInputs)) {
    fs.mkdirSync(dirInputs, { recursive: true });
}

const generateInputFile = async (input) => {
    const jobId = uuid();
    const inputFilename = `${jobId}.txt`;
    const inputFilePath = path.join(dirInputs, inputFilename);
    
    fs.writeFileSync(inputFilePath, input);
    return inputFilePath;
};

module.exports = {
    generateInputFile,
};