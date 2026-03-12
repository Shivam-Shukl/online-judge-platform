// ===============================
// 1. DNS FIX (for MongoDB Atlas SRV issues on Windows)
// ===============================
const dns = require("dns");

// Force Node.js to use Google DNS instead of broken system resolver
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");


// ===============================
// 2. IMPORTS
// ===============================
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

// ===============================
// 3. CUSTOM MODULES
// ===============================
const { generateFile } = require("./execute/generateFile");
const { executeCpp } = require("./execute/executeCpp");
const { executePy } = require("./execute/executePy");
const Problem = require("./models/Problem");
const User = require("./models/User");             
const bcrypt = require("bcryptjs");                
const jwt = require("jsonwebtoken");
// ===============================
// 4. APP INITIALIZATION
// ===============================
const app = express();


// ===============================
// 5. MIDDLEWARE
// ===============================
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// ===============================
// 6. DATABASE CONNECTION
// ===============================
console.log("Connecting to MongoDB...");

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:");
    console.error(err);
  });


// ===============================
// 7. ROUTES
// ===============================
app.post("/run", async (req, res) => {
  const { language = "cpp", code } = req.body;

  if (!code) {
    return res
      .status(400)
      .json({ success: false, error: "Empty code body!" });
  }

  let filepath;

  try {
    // Generate source file
    filepath = await generateFile(language, code);

    let output;

    // Execute based on language
    if (language === "cpp") {
      output = await executeCpp(filepath);
    } else if (language === "py") {
      output = await executePy(filepath);
    } else {
      return res
        .status(400)
        .json({ success: false, error: "Unsupported language!" });
    }

    // Send output
    res.json({
      success: true,
      filepath,
      output,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || err.stderr || err,
    });
  } finally {
    // ===============================
    // CLEANUP PHASE
    // ===============================
    if (filepath) {
      fs.unlink(filepath, (err) => {
        if (err) console.error(`Error deleting file ${filepath}`, err);
      });

      if (language === "cpp") {
        const jobId = path.basename(filepath).split(".")[0];

        const outPath = path.join(__dirname, "outputs", `${jobId}.out`);
        const exePath = path.join(__dirname, "outputs", `${jobId}.exe`);

        if (fs.existsSync(outPath)) fs.unlink(outPath, () => {});
        if (fs.existsSync(exePath)) fs.unlink(exePath, () => {});
      }
    }
  }
});

// Route to add a new problem to the database
app.post("/api/problems", async (req, res) => {
  try {
    const newProblem = new Problem(req.body);
    await newProblem.save();
    res.status(201).json({ success: true, problem: newProblem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Route to get all problems from the database
app.get("/api/problems", async (req, res) => {
  try {
    const problems = await Problem.find({});
    res.status(200).json({ success: true, problems });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Route to get a single problem by its ID
app.get("/api/problems/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ success: false, error: "Problem not found" });
    }
    res.status(200).json({ success: true, problem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===============================
// AUTHENTICATION ROUTES
// ===============================

// 1. Register a new user
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "Email already in use." });
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Login an existing user
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: "Invalid email or password." });
    }

    // Compare the typed password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Invalid email or password." });
    }

    // Generate the JWT Badge (Token)
    const token = jwt.sign(
      { userId: user._id, username: user.username }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" } // Badge expires in 7 days
    );

    res.status(200).json({ 
      success: true, 
      token, 
      user: { id: user._id, username: user.username, email: user.email } 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/submit", async (req, res) => {
    const { language = "cpp", code, problemId } = req.body;

    if (!code || !problemId) {
        return res.status(400).json({ success: false, error: "Missing code or problemId!" });
    }

    let filepath;
    try {
        // 1. Fetch the problem from the database
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ success: false, error: "Problem not found!" });
        }

        // 2. Generate the source code file
        filepath = await generateFile(language, code);

        // 3. Loop through all test cases
        let results = [];
        let allPassed = true;

        for (const testCase of problem.testCases) {
            // Generate the input file for this specific test case
            const inputPath = await generateInputFile(testCase.input);
            let output;
            let passed = false;

            try {
                // Execute code with the input file
                if (language === "cpp") {
                    output = await executeCpp(filepath, inputPath);
                } else if (language === "py") {
                    output = await executePy(filepath, inputPath);
                }

                // Clean up the output string (remove extra spaces/newlines)
                output = output.trim();
                const expected = testCase.expectedOutput.trim();

                // Compare output
                if (output === expected) {
                    passed = true;
                } else {
                    allPassed = false;
                }

                results.push({
                    input: testCase.input,
                    expectedOutput: expected,
                    userOutput: output,
                    passed: passed
                });

            } catch (err) {
                // If code crashes on a test case
                results.push({
                    input: testCase.input,
                    error: err.message || err.stderr || "Execution Error",
                    passed: false
                });
                allPassed = false;
            } finally {
                // Clean up the temporary input file
                if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            }
        }

        // 4. Send the final grade back!
        res.json({
            success: true,
            status: allPassed ? "Accepted" : "Wrong Answer",
            results: results
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    } finally {
        // Clean up source code files (same as your /run route)
        if (filepath && fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            if (language === "cpp") {
                const jobId = path.basename(filepath).split(".")[0];
                const outPath = path.join(__dirname, "outputs", `${jobId}.out`);
                const exePath = path.join(__dirname, "outputs", `${jobId}.exe`);
                if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
                if (fs.existsSync(exePath)) fs.unlinkSync(exePath);
            }
        }
    }
});

// ===============================
// 8. SERVER START
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});