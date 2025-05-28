#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const { program } = require('commander');
const chalk = require('chalk');
require('dotenv').config();

// Get API key and account ID from environment variables
const API_KEY = process.env.FILES_VC_API_KEY;
const ACCOUNT_ID = process.env.FILES_VC_ACCOUNT_ID;

// Configure the command-line interface
program
  .name('filesvc-uploader')
  .description('A simple command-line tool to upload files to files.vc')
  .version('1.0.0')
  .argument('<filepath>', 'Path to the file you want to upload')
  .option('-a, --account-id <id>', 'Optional account ID to associate with the upload (overrides environment variable)')
  .parse(process.argv);

const options = program.opts();
const filePath = program.args[0];

// Check if file exists
if (!fs.existsSync(filePath)) {
  console.error(chalk.red(`Error: File not found at ${filePath}`));
  process.exit(1);
}

// Check if API key is set
if (!API_KEY) {
  console.error(chalk.red('Error: API key is not set. Please set the FILES_VC_API_KEY environment variable.'));
  console.log(chalk.yellow('You can create a .env file with FILES_VC_API_KEY=your-api-key or set it in your environment.'));
  process.exit(1);
}

// Function to upload file
async function uploadFile(filePath, accountId) {
  try {
    console.log(chalk.blue(`Uploading ${path.basename(filePath)} to files.vc...`));
    
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    
    // Set headers - X-API-Key works based on our test
    const headers = {
      'X-API-Key': API_KEY,
      ...form.getHeaders()
    };
    
    // Add account ID if provided
    if (accountId) {
      headers['X-Account-ID'] = accountId;
      console.log(chalk.blue(`Using account ID: ${accountId} (files will never expire)`));
    }
    
    const response = await axios.post('https://api.files.vc/upload', form, { headers });
    
    if (response.data && (response.data.file_url || response.data.page_url)) {
      console.log(chalk.green('Upload successful!'));
      
      if (response.data.page_url) {
        console.log(chalk.yellow('Page URL:'), chalk.cyan(response.data.page_url));
      }
      
      if (response.data.file_url) {
        console.log(chalk.yellow('Direct File URL:'), chalk.cyan(response.data.file_url));
      }
      
      return response.data;
    } else {
      console.error(chalk.red('Upload failed: Unexpected response format'));
      console.log(chalk.yellow('Response data:'), response.data);
      return null;
    }
  } catch (error) {
    console.error(chalk.red('Upload failed:'), error.response?.data || error.message);
    return null;
  }
}

// Main execution
(async () => {
  try {
    const fileStats = fs.statSync(filePath);
    const fileSizeMB = fileStats.size / (1024 * 1024);
    
    console.log(chalk.blue(`File size: ${fileSizeMB.toFixed(2)} MB`));
    
    // Check if file size is within limits (10GB)
    if (fileSizeMB > 10 * 1024) {
      console.error(chalk.red('Error: File size exceeds the 10GB limit'));
      process.exit(1);
    }
    
    // Use command line account ID if provided, otherwise use the one from environment
    const accountId = options.accountId || ACCOUNT_ID;
    await uploadFile(filePath, accountId);
  } catch (error) {
    console.error(chalk.red('An unexpected error occurred:'), error.message);
    process.exit(1);
  }
})(); 