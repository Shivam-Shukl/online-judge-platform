const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

// Define the directory where files will be saved
const dirCodes = path.join(__dirname, '../codes');

// If the 'codes' directory doesn't exist, create it
if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = async (format, content) => {
    // Generate a unique ID for the file
    const jobId = uuid();
    const filename = `${jobId}.${format}`;
    const filepath = path.join(dirCodes, filename);
    
    // Write the code to the file
    fs.writeFileSync(filepath, content);
    return filepath;
};

module.exports = {
    generateFile,
};