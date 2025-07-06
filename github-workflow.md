# GitHub Workflow for Project COLONAiVE™

This document outlines the process for pushing changes from Bolt to GitHub.

## Workflow Overview

1. Develop and test in Bolt
2. Deploy to Netlify preview from Bolt
3. Export tested code from Bolt
4. Push to GitHub
5. Automatic deployment to production via GitHub-Netlify integration

## Step-by-Step Process

### 1. Development in Bolt

- Make all code changes in Bolt
- Test thoroughly in the Bolt preview
- Fix any issues that arise

### 2. Preview Deployment

- Deploy to Netlify from Bolt using the "Deploy" button
- Test the preview deployment URL
- Share with stakeholders for feedback if needed

### 3. Export from Bolt

- Once satisfied with the changes, download the project as a ZIP file:
  - Click the "⋮" (three dots) menu in the top-right corner
  - Select "Download as ZIP"

### 4. Push to GitHub

#### First-time setup:
1. Create a new repository on GitHub (if not already done)
2. Clone the repository to your local machine
3. Extract the Bolt ZIP file and copy its contents to your local repository
4. Commit and push to GitHub

#### For subsequent updates:
1. Download the latest ZIP from Bolt
2. Extract and copy the files to your local repository
3. Review changes (consider using `git diff` to see what's changed)
4. Commit with a descriptive message
5. Push to GitHub

### 5. Production Deployment

- Netlify will automatically deploy from the GitHub repository
- Verify the production deployment at www.colonaive.ai

## Best Practices

- Always include a meaningful commit message describing what changed
- Consider using feature branches for major changes
- Test the Netlify preview thoroughly before pushing to GitHub
- Keep sensitive information (API keys, etc.) in environment variables, not in the code

## Troubleshooting

If you encounter issues with the GitHub-Netlify integration:
1. Check the Netlify build logs
2. Verify your Netlify build settings
3. Ensure the repository has the correct permissions for Netlify