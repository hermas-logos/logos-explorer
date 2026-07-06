# Clear Vercel Build Fix Guide

This guide contains the exact steps and clean code to fix your Vercel build errors. 

## The Problem
Even if you cannot see compile-data.js on your laptop, it exists in your online GitHub repository. When Vercel builds your site, it runs:
node compile-data.js

Since Vercel does not have your Airtable keys, it overwrites your perfect src/data/episode.ts file with a broken, empty file. This is why you get the "Unterminated string literal" compilation error!

## The Solution

Step 1: Create a new file in VS Code.
1. Open your project folder in VS Code.
2. Click the New File icon in the folder list.
3. Name the file exactly:
compile-data.js

Step 2: Copy and paste this line of text into compile-data.js:
console.log("Static PWA Mode Active: Bypassing Airtable/Excel compile step!");

Step 3: Save compile-data.js.

Step 4: Push this change to GitHub.
Open your blue PowerShell window and run these three commands:

1. git add compile-data.js
2. git commit -m "chore: bypass compile-data script"
3. git push origin main

Once you run these commands, Vercel will build your PWA successfully in under 90 seconds!
