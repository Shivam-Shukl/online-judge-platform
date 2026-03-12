const { exec } = require('child_process');

const executePy = (filepath, inputPath) => { // <-- ADDED inputPath
    return new Promise((resolve, reject) => {
        // Feed the input file into the python script using <
        const command = `python ${filepath} < ${inputPath}`; 
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject({ error, stderr });
            }
            if (stderr) {
                reject(stderr);
            }
            resolve(stdout);
        });
    });
};

module.exports = { executePy };