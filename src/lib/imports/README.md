# Job Import Scripts

This directory contains scripts for importing job data from various APIs into the database.

## APIJobs Import Script

The `apijobs.ts` script imports job data from the APIJobs API.

### Setup

1. Add your APIJobs API key to your environment variables:
   ```bash
   export APIJOBS_API_KEY="your_api_key_here"
   ```

2. Make sure your database is running and migrations are applied:
   ```bash
   npx drizzle-kit migrate
   ```

### Usage

#### Basic usage (imports 50 "software engineer" jobs):
```bash
npm run import:jobs
```

#### With custom query:
```bash
npm run import:jobs "react developer"
```

#### With custom query and size:
```bash
npm run import:jobs "python developer" 100
```

#### Direct execution:
```bash
npx tsx src/lib/imports/apijobs.ts "frontend developer" 25
```

### Features

- **Duplicate Prevention**: Uses job ID from API as database ID and skips jobs that already exist
- **Error Handling**: Continues importing even if individual jobs fail
- **Sentry Integration**: All errors are automatically reported to Sentry
- **Detailed Logging**: Shows progress and results of the import process
- **Flexible Data Storage**: Stores all job data in the `data` JSON field for future use
- **ID Consistency**: Uses the same job ID from the API in the database for easy reference

### Database Schema

Jobs are stored in the `job` table with the following structure:
- `title`: Job title
- `description`: Job description
- `location`: Job location
- `provider`: Set to "apijobs"
- `data`: JSON field containing all additional job information (company, salary, etc.)

### Error Handling

The script includes comprehensive error handling:
- Individual job import failures don't stop the entire process
- All errors are logged to the console
- Critical errors are sent to Sentry for monitoring
- The script exits with code 1 if any errors occurred
