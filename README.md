# Files.vc Uploader

A simple command-line tool to upload files to [files.vc](https://files.vc/).

## Features

- Upload files to files.vc directly from your terminal
- Associate uploads with your account ID to prevent file expiration
- Simple and easy to use

## Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` with your API key and account ID

## Configuration

Create a `.env` file in the root directory with the following variables:

```
FILES_VC_API_KEY=your-api-key-here
FILES_VC_ACCOUNT_ID=your-account-id-here
```

- **API Key**: Required for authentication with files.vc API
- **Account ID**: Optional. When provided, files will never expire and will be associated with your account

## Usage

```
node index.js <filepath>
```

### Options

- `-a, --account-id <id>`: Override the account ID from the environment variable

### Examples

Upload a file using the account ID from the environment:
```
node index.js path/to/your/file.jpg
```

Upload a file with a specific account ID (overriding the one in .env):
```
node index.js path/to/your/file.jpg -a 9750529490477327
```

## Notes

- Maximum file size: 10GB
- Files uploaded with an account ID will never expire
- Without an account ID, files may expire after some time

## API Documentation

For more information about the files.vc API, visit [https://files.vc/api](https://files.vc/api).