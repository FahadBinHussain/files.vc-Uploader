# Files.vc Uploader

A simple command-line tool and Node.js module to upload files to [files.vc](https://files.vc/).

## Features

- Upload files to files.vc directly from your terminal
- Associate uploads with your account ID to prevent file expiration
- Use as a standalone CLI tool or as a module in your Node.js projects
- Simple and easy to use

## Installation

### As a standalone CLI tool

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` with your API key and account ID
4. Make it globally available (optional):
   ```
   npm install -g .
   ```

### As a Git Submodule

To use this project as a submodule in your existing project:

1. Add the submodule to your project:
   ```
   git submodule add https://github.com/username/filesvc-uploader.git path/to/filesvc-uploader
   ```
2. Install dependencies:
   ```
   cd path/to/filesvc-uploader
   npm install
   ```
3. Import and use in your project:
   ```javascript
   const { uploadFile } = require('./path/to/filesvc-uploader/lib/uploader');
   ```

## Configuration

### For CLI usage

Create a `.env` file in the root directory with the following variables:

```
FILES_VC_API_KEY=your-api-key-here
FILES_VC_ACCOUNT_ID=your-account-id-here
```

- **API Key**: Required for authentication with files.vc API
- **Account ID**: Optional. When provided, files will never expire and will be associated with your account

### For Module usage

When using as a module, you need to provide the API key and optionally the account ID directly to the function:

```javascript
const { uploadFile } = require('filesvc-uploader');

// Upload a file
try {
  const result = await uploadFile('path/to/file.jpg', {
    apiKey: 'your-api-key-here',
    accountId: 'your-account-id-here', // Optional
    logger: console.log // Optional
  });
  
  console.log('Upload successful!');
  console.log('Page URL:', result.page_url);
  console.log('Direct File URL:', result.file_url);
} catch (error) {
  console.error('Upload failed:', error.message);
}
```

## CLI Usage

```
filesvc-uploader <filepath> [options]
```

### Options

- `-a, --account-id <id>`: Override the account ID from the environment variable
- `-k, --api-key <key>`: Override the API key from the environment variable

### Examples

Upload a file using the account ID from the environment:
```
filesvc-uploader path/to/your/file.jpg
```

Upload a file with a specific account ID (overriding the one in .env):
```
filesvc-uploader path/to/your/file.jpg -a 9750529490477327
```

## Module API

### `uploadFile(filePath, options)`

Uploads a file to files.vc.

#### Parameters

- `filePath` (string): Path to the file to upload
- `options` (object): Upload options
  - `apiKey` (string): Files.vc API key
  - `accountId` (string, optional): Account ID to associate with the upload
  - `logger` (function, optional): Logger function (defaults to console.log)

#### Returns

Promise that resolves to an object containing:
- `page_url`: URL to the file page
- `file_url`: Direct URL to the file

#### Throws

- Error if the file doesn't exist
- Error if the file size exceeds 10GB
- Error if the upload fails

## Notes

- Maximum file size: 10GB
- Files uploaded with an account ID will never expire
- Without an account ID, files may expire after some time

## API Documentation

For more information about the files.vc API, visit [https://files.vc/api](https://files.vc/api).