# Online Judge Platform

**Live Demo:** [https://shivam-judge-platform.vercel.app/](https://shivam-judge-platform.vercel.app/) 

**Backend:** [https://codegrader-backend.onrender.com](https://codegrader-backend.onrender.com)
## Description
This is a full-stack online code execution and judging platform, inspired by platforms like LeetCode. It allows users to read problem descriptions, write code in an integrated browser editor, and submit their solutions. The backend securely compiles and executes the code against predefined hidden test cases and returns the evaluation status (e.g., Accepted, Wrong Answer, Execution Error).

## The Problem It Solves
Building a reliable code execution engine requires safely handling untrusted user code. This platform solves the challenge of remote code execution by utilizing a containerized environment to compile and run C++ and Python scripts dynamically. It automates the grading process for algorithmic problems, making it an excellent tool for competitive programming practice and algorithmic education.

## Features
* **Multi-Language Support:** Compiles and executes C++ and Python 3.
* **Automated Grading:** Evaluates user submissions against multiple hidden test cases.
* **Secure Authentication:** User registration and login utilizing bcrypt for password hashing and JSON Web Tokens (JWT) for secure session management.
* **Problem Sandbox:** Clean, interactive UI for reading problems and writing code simultaneously.
* **Persistent Storage:** MongoDB integration to store user profiles, algorithmic problems, and test cases.

## Tech Stack & Services Used

**Frontend**
* React.js (Vite)
* React Router DOM
* Axios
* Hosted on: Vercel

**Backend & Execution Engine**
* Node.js & Express.js
* Docker (Custom image with Node 20, GCC/g++, and Python 3)
* Child Processes (for OS-level script execution)
* Hosted on: Render (Web Service)

**Database**
* MongoDB Atlas
* Mongoose ODM
