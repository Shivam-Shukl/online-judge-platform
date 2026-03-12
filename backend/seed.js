const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

const mongoose = require('mongoose');
require('dotenv').config();
const Problem = require('./models/Problem');

const problems = [
  {
    title: "Reverse a String",
    description: "Write a program that takes a single string as input and prints the reversed string.",
    difficulty: "Easy",
    testCases: [
      { input: "hello", expectedOutput: "olleh" },
      { input: "codegrader", expectedOutput: "redargedoc" },
      { input: "racecar", expectedOutput: "racecar" }
    ]
  },
  {
    title: "Sum of Two Numbers",
    description: "Read two integers and print their sum.",
    difficulty: "Easy",
    testCases: [
      { input: "5 7", expectedOutput: "12" },
      { input: "10 -2", expectedOutput: "8" },
      { input: "100 200", expectedOutput: "300" }
    ]
  },
  {
    title: "Even or Odd",
    description: "Given an integer, print 'even' if it is even otherwise print 'odd'.",
    difficulty: "Easy",
    testCases: [
      { input: "4", expectedOutput: "even" },
      { input: "7", expectedOutput: "odd" },
      { input: "0", expectedOutput: "even" }
    ]
  },
  {
    title: "Factorial",
    description: "Given a number N, print N! (factorial).",
    difficulty: "Easy",
    testCases: [
      { input: "5", expectedOutput: "120" },
      { input: "3", expectedOutput: "6" },
      { input: "1", expectedOutput: "1" }
    ]
  },
  {
    title: "Count Digits",
    description: "Given a number, print the count of digits.",
    difficulty: "Easy",
    testCases: [
      { input: "12345", expectedOutput: "5" },
      { input: "9", expectedOutput: "1" },
      { input: "1000", expectedOutput: "4" }
    ]
  },
  {
    title: "Check Palindrome String",
    description: "Given a string, print 'true' if it is palindrome else 'false'.",
    difficulty: "Easy",
    testCases: [
      { input: "madam", expectedOutput: "true" },
      { input: "hello", expectedOutput: "false" },
      { input: "racecar", expectedOutput: "true" }
    ]
  },
  {
    title: "Find Maximum in Array",
    description: "First input is N followed by N integers. Print maximum element.",
    difficulty: "Easy",
    testCases: [
      { input: "5 1 4 9 2 5", expectedOutput: "9" },
      { input: "3 -1 -5 -2", expectedOutput: "-1" },
      { input: "1 100", expectedOutput: "100" }
    ]
  },
  {
    title: "Find Minimum in Array",
    description: "First input N followed by N numbers. Print minimum value.",
    difficulty: "Easy",
    testCases: [
      { input: "4 3 7 1 9", expectedOutput: "1" },
      { input: "3 -1 -5 -2", expectedOutput: "-5" },
      { input: "1 100", expectedOutput: "100" }
    ]
  },
  {
    title: "Sum of Array",
    description: "Input N followed by N numbers. Print sum of array.",
    difficulty: "Easy",
    testCases: [
      { input: "5 1 2 3 4 5", expectedOutput: "15" },
      { input: "3 10 20 30", expectedOutput: "60" },
      { input: "1 100", expectedOutput: "100" }
    ]
  },
  {
    title: "Count Vowels",
    description: "Given a string count number of vowels.",
    difficulty: "Easy",
    testCases: [
      { input: "hello", expectedOutput: "2" },
      { input: "programming", expectedOutput: "3" },
      { input: "sky", expectedOutput: "0" }
    ]
  },
  {
    title: "Fibonacci Number",
    description: "Given N print Nth Fibonacci number.",
    difficulty: "Medium",
    testCases: [
      { input: "5", expectedOutput: "5" },
      { input: "7", expectedOutput: "13" },
      { input: "10", expectedOutput: "55" }
    ]
  },
  {
    title: "Palindrome Number",
    description: "Check whether given number is palindrome.",
    difficulty: "Medium",
    testCases: [
      { input: "121", expectedOutput: "true" },
      { input: "10", expectedOutput: "false" },
      { input: "1331", expectedOutput: "true" }
    ]
  },
  {
    title: "Prime Number",
    description: "Given number N check if it is prime.",
    difficulty: "Medium",
    testCases: [
      { input: "7", expectedOutput: "true" },
      { input: "10", expectedOutput: "false" },
      { input: "13", expectedOutput: "true" }
    ]
  },
  {
    title: "GCD of Two Numbers",
    description: "Given two numbers find their GCD.",
    difficulty: "Medium",
    testCases: [
      { input: "12 18", expectedOutput: "6" },
      { input: "100 25", expectedOutput: "25" },
      { input: "7 3", expectedOutput: "1" }
    ]
  },
  {
    title: "LCM of Two Numbers",
    description: "Given two numbers print LCM.",
    difficulty: "Medium",
    testCases: [
      { input: "4 6", expectedOutput: "12" },
      { input: "5 3", expectedOutput: "15" },
      { input: "10 15", expectedOutput: "30" }
    ]
  },
  {
    title: "Binary Search",
    description: "Given sorted array and target return index else -1.",
    difficulty: "Medium",
    testCases: [
      { input: "5 1 2 3 4 5 3", expectedOutput: "2" },
      { input: "4 2 4 6 8 5", expectedOutput: "-1" },
      { input: "3 10 20 30 20", expectedOutput: "1" }
    ]
  },
  {
    title: "Two Sum",
    description: "Given array find two numbers whose sum equals target and return indices.",
    difficulty: "Medium",
    testCases: [
      { input: "4 2 7 11 15 9", expectedOutput: "0 1" },
      { input: "3 3 2 4 6", expectedOutput: "1 2" },
      { input: "2 3 3 6", expectedOutput: "0 1" }
    ]
  },
  {
    title: "Remove Duplicates from Sorted Array",
    description: "Return length of array after removing duplicates.",
    difficulty: "Medium",
    testCases: [
      { input: "6 1 1 2 2 3 4", expectedOutput: "4" },
      { input: "5 1 2 3 4 5", expectedOutput: "5" },
      { input: "3 7 7 7", expectedOutput: "1" }
    ]
  },
  {
    title: "Move Zeros to End",
    description: "Move all zeros in array to end maintaining order.",
    difficulty: "Medium",
    testCases: [
      { input: "5 0 1 0 3 12", expectedOutput: "1 3 12 0 0" },
      { input: "3 0 0 1", expectedOutput: "1 0 0" },
      { input: "4 1 2 3 4", expectedOutput: "1 2 3 4" }
    ]
  },
  {
    title: "Longest Word in Sentence",
    description: "Find longest word in sentence.",
    difficulty: "Medium",
    testCases: [
      { input: "I love programming", expectedOutput: "programming" },
      { input: "hello world", expectedOutput: "hello" },
      { input: "AI is powerful", expectedOutput: "powerful" }
    ]
  },
  {
    title: "Anagram Check",
    description: "Check if two strings are anagrams.",
    difficulty: "Medium",
    testCases: [
      { input: "listen silent", expectedOutput: "true" },
      { input: "hello world", expectedOutput: "false" },
      { input: "evil live", expectedOutput: "true" }
    ]
  },
  {
    title: "Merge Sorted Arrays",
    description: "Merge two sorted arrays.",
    difficulty: "Medium",
    testCases: [
      { input: "3 1 3 5 3 2 4 6", expectedOutput: "1 2 3 4 5 6" },
      { input: "2 1 2 2 3 4", expectedOutput: "1 2 3 4" },
      { input: "1 5 1 6", expectedOutput: "5 6" }
    ]
  },
  {
    title: "Valid Parentheses",
    description: "Check if parentheses are valid.",
    difficulty: "Medium",
    testCases: [
      { input: "()[]{}", expectedOutput: "true" },
      { input: "(]", expectedOutput: "false" },
      { input: "([{}])", expectedOutput: "true" }
    ]
  },
  {
    title: "First Non Repeating Character",
    description: "Find first non repeating character in string.",
    difficulty: "Medium",
    testCases: [
      { input: "leetcode", expectedOutput: "l" },
      { input: "aabb", expectedOutput: "-1" },
      { input: "loveleetcode", expectedOutput: "v" }
    ]
  },
  {
    title: "Climbing Stairs",
    description: "Count ways to reach top if you can climb 1 or 2 steps.",
    difficulty: "Medium",
    testCases: [
      { input: "2", expectedOutput: "2" },
      { input: "3", expectedOutput: "3" },
      { input: "5", expectedOutput: "8" }
    ]
  },
  {
    title: "Maximum Subarray",
    description: "Find maximum sum subarray.",
    difficulty: "Hard",
    testCases: [
      { input: "9 -2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6" },
      { input: "1 1", expectedOutput: "1" },
      { input: "5 -1 -2 -3 -4 -5", expectedOutput: "-1" }
    ]
  },
  {
    title: "Longest Increasing Subsequence Length",
    description: "Find length of LIS.",
    difficulty: "Hard",
    testCases: [
      { input: "8 10 9 2 5 3 7 101 18", expectedOutput: "4" },
      { input: "6 0 1 0 3 2 3", expectedOutput: "4" },
      { input: "1 7", expectedOutput: "1" }
    ]
  },
  {
    title: "Coin Change",
    description: "Minimum coins needed to make amount.",
    difficulty: "Hard",
    testCases: [
      { input: "3 1 2 5 11", expectedOutput: "3" },
      { input: "3 2 5 10 3", expectedOutput: "-1" },
      { input: "1 1 0", expectedOutput: "0" }
    ]
  },
  {
    title: "Longest Palindromic Substring Length",
    description: "Find length of longest palindrome substring.",
    difficulty: "Hard",
    testCases: [
      { input: "babad", expectedOutput: "3" },
      { input: "cbbd", expectedOutput: "2" },
      { input: "a", expectedOutput: "1" }
    ]
  },
  {
    title: "Word Frequency",
    description: "Find most frequent word in sentence.",
    difficulty: "Hard",
    testCases: [
      { input: "the cat and the dog", expectedOutput: "the" },
      { input: "apple banana apple", expectedOutput: "apple" },
      { input: "one two three two", expectedOutput: "two" }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing problems to prevent duplicate title errors
    await Problem.deleteMany({});
    console.log("Cleared existing problems from the database.");

    // Insert the 30 new problems
    await Problem.insertMany(problems);
    console.log(`✅ Successfully added ${problems.length} new problems!`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
};

seedDatabase();