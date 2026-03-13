const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "codes");
const dirOutputs = path.join(__dirname, "outputs");

if (!fs.existsSync(dirCodes)) fs.mkdirSync(dirCodes, { recursive: true });
if (!fs.existsSync(dirOutputs)) fs.mkdirSync(dirOutputs, { recursive: true });

const executeJava = async (code, inputPath) => {
    const jobId = uuid();
    // Create a unique folder for this specific Java run
    const jobFolder = path.join(dirCodes, jobId);
    fs.mkdirSync(jobFolder, { recursive: true });

    // Save the code as Main.java inside that unique folder
    const filepath = path.join(jobFolder, "Main.java");
    fs.writeFileSync(filepath, code);

    return new Promise((resolve, reject) => {
        // Compile the Java file, then run it, feeding the custom input
        const command = `javac "${filepath}" && cd "${jobFolder}" && java Main < "${inputPath}"`;

        exec(command, (error, stdout, stderr) => {
            // Cleanup the unique folder after execution
            fs.rmSync(jobFolder, { recursive: true, force: true });

            if (error) return reject({ error, stderr });
            if (stderr) return reject(stderr);
            resolve(stdout);
        });
    });
};

module.exports = { executeJava };