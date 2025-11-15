# Project Source Run Guide

---

## Problem 1 – Node.js Script

This is a simple Node.js script located in `src/problem1`.

### Steps to Run:

1. Open a terminal and navigate to the problem1 directory:

```bash
cd src/problem1
```

2. Make sure you have Node.js installed (v14+ recommended).

3. Run the script:

```bash
node index.js
```

> The script will execute and output the results to the console.

---

## Problem 2 – Vite React + TypeScript Project

This is a React application built with Vite and TypeScript.

The source code is located in src/problem2.

### Steps to Run (Development):

1. Open a terminal and navigate to the project directory:

```bash
cd src/problem2
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

## Problem 3 – React Component Anti-Pattern Review

This section focuses on identifying and refactoring anti-patterns in a React + TypeScript component.

The source code is located in src/problem3

### Files Included:

1. WalletPage.tsx: Refactored version of the original component with performance and architectural improvements.

2. anti-patterns-notes.md: Documentation listing all identified anti-patterns, their impact, and the solutions applied.


### General Notes

- Make sure Node.js (v14+) and npm/yarn are installed on your machine.
- Problem 1 is a standalone Node.js script and does not require additional dependencies.
- Problem 2 is a full React + TypeScript project using Vite.
- For Problem 2, the default port is usually `5173`, but Vite may assign another if it's already in use.
- Any static assets (images, icons) should be placed in the `public` folder or imported correctly in components.
- Problem 3 is a refactored React component intended for code review only. It does not include full context, dependencies, or surrounding infrastructure to run independently.

---

## 🔗 Code Challenge Reference

You can view the original code challenge description here:  
[Code Challenge – Notion Link](https://s5tech.notion.site/Code-Challenge-05cdb9e0d1ce432a843f763b5d5f7497)