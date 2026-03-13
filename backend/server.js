// ===============================
// 1. DNS FIX (for MongoDB Atlas SRV issues on Windows)
// ===============================
const dns = require("dns");
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
const { generateInputFile } = require("./execute/generateInputFile"); // FIXED: Added missing import
const { executeCpp } = require("./execute/executeCpp");
const { executePy } = require("./execute/executePy");
const { executeJava } = require("./execute/executeJava");
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
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });

// ===============================
// 7. ROUTES
// ===============================

// Basic Run Route (without test cases)
// Basic Run Route (Playground with Custom Input)
app.post("/run", async (req, res) => {
  // Now accepting 'input' from the frontend!
  const { language = "cpp", code, input = "" } = req.body;
  
  if (!code) return res.status(400).json({ success: false, error: "Empty code body!" });

  let filepath;
  let inputPath;
  try {
    // Generate the custom input file
    inputPath = await generateInputFile(input);
    let output;

    if (language === "cpp") {
      filepath = await generateFile(language, code);
      output = await executeCpp(filepath, inputPath);
    } else if (language === "py") {
      filepath = await generateFile(language, code);
      output = await executePy(filepath, inputPath);
    } else if (language === "java") {
      // Java handles its own file generation internally because of the class name rule
      output = await executeJava(code, inputPath);
    } else {
      return res.status(400).json({ success: false, error: "Unsupported language!" });
    }

    res.json({ success: true, output });
  } catch (err) {
    console.error("RUN ROUTE CRASH:", err);
    res.status(500).json({ success: false, error: err.message || err.stderr || err });
  } finally {
    // Cleanup files
    if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (filepath && fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      if (language === "cpp") {
        const jobId = path.basename(filepath).split(".")[0];
        const outPath = path.join(__dirname, "execute", "outputs", `${jobId}.out`);
        const exePath = path.join(__dirname, "execute", "outputs", `${jobId}.exe`);
        if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
        if (fs.existsSync(exePath)) fs.unlinkSync(exePath);
      }
    }
  }
});

// Full Submission Route (With Database Test Cases)
app.post("/submit", async (req, res) => {
    const { language = "cpp", code, problemId } = req.body;

    if (!code || !problemId) {
        return res.status(400).json({ success: false, error: "Missing code or problemId!" });
    }

    let filepath;
    try {
        const problem = await Problem.findById(problemId);
        if (!problem) return res.status(404).json({ success: false, error: "Problem not found!" });

        filepath = await generateFile(language, code);
        let results = [];
        let allPassed = true;

        for (const testCase of problem.testCases) {
            const inputPath = await generateInputFile(testCase.input);
            let output;
            let passed = false;

            try {
                if (language === "cpp") output = await executeCpp(filepath, inputPath);
                else if (language === "py") output = await executePy(filepath, inputPath);

                output = output.trim();
                const expected = testCase.expectedOutput.trim();

                if (output === expected) passed = true;
                else allPassed = false;

                results.push({
                    input: testCase.input,
                    expectedOutput: expected,
                    userOutput: output,
                    passed: passed
                });
            } catch (err) {
                results.push({
                    input: testCase.input,
                    error: err.message || "Execution Error",
                    passed: false
                });
                allPassed = false;
            } finally {
                if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            }
        }

        res.json({
            success: true,
            status: allPassed ? "Accepted" : "Wrong Answer",
            results: results
        });

    } catch (err) {
        console.error("SUBMIT ROUTE CRASH:", err); // FIXED: Added logging
        res.status(500).json({ success: false, error: err.message });
    } finally {
        if (filepath && fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            if (language === "cpp") {
                const jobId = path.basename(filepath).split(".")[0];
                const outDir = path.join(__dirname, "execute", "outputs");
                const outPath = path.join(outDir, `${jobId}.out`);
                const exePath = path.join(outDir, `${jobId}.exe`);
                if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
                if (fs.existsSync(exePath)) fs.unlinkSync(exePath);
            }
        }
    }
});

// Problem Management Routes
app.post("/api/problems", async (req, res) => {
  try {
    const newProblem = new Problem(req.body);
    await newProblem.save();
    res.status(201).json({ success: true, problem: newProblem });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.get("/api/problems", async (req, res) => {
  try {
    const problems = await Problem.find({});
    res.status(200).json({ success: true, problems });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.get("/api/problems/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ success: false, error: "Problem not found" });
    res.status(200).json({ success: true, problem });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// Auth Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, error: "Email already in use." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully!" });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, error: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, error: "Invalid credentials." });

    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ success: true, token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// ===============================
// 8. SERVER START
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});