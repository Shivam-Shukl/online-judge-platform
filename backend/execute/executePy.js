const { exec } = require('child_process');

const executePy = (filepath, inputPath) => { 
    return new Promise((resolve, reject) => {
        
        // FIXED: Added a space after python3
        const command = `python3 "${filepath}" < "${inputPath}"`; 
        
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
