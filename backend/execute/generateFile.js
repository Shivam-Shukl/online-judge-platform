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
    // Create the filename (e.g., '1234-abcd.cpp' or '1234-abcd.py')
    const filename = `${jobId}.${format}`;
    // Create the full path where the file will be saved
    const filepath = path.join(dirCodes, filename);
    
    // Write the actual code content into the file physically on your hard drive
    await fs.writeFileSync(filepath, content);
    
    return filepath;
};

module.exports = {
    generateFile,
};