const { exec } = require('child_process');

const executePy = (filepath, inputPath) => { 
    return new Promise((resolve, reject) => {
        // FIXED: Added space and quotes for safe path execution
        // PRO TIP: When you deploy to Render, you might need to change "python" to "python3"
        const command = `python "${filepath}" < "${inputPath}"`; 
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject({ error, stderr });
            }
            if (stderr) {
                return reject(stderr);
            }
            resolve(stdout);
        });
    });
};

module.exports = { executePy };