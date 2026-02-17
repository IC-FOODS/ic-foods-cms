


# IC-FOODS Website

International Center for Food Ontology Operability Data and Semantics website built with React, TypeScript, and Vite.

## Features

- Dynamic content management via CSV files (projects, partners, team, publications)
- Responsive design with Tailwind CSS
- Modern React with TypeScript
- Fast development with Vite

## Run Locally

**Prerequisites:** Node.js 20+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open your browser at `http://localhost:3000`

## Testing (Containerized Required)

CMS validation must run in the CMS container, not directly on host.

1. Run CMS tests:
   ```bash
   docker compose -f docker-compose.cms.yml run --rm cms-test
   ```
2. Run CMS dev server in container:
   ```bash
   docker compose -f docker-compose.cms.yml up cms-dev
   ```

This keeps agent/dev behavior consistent with runtime dependencies and avoids host-environment drift.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deploy to GitHub Pages

This repository is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Instructions

This workflow auto-detects `VITE_BASE_PATH`:
- repository named `*.github.io` -> `/`
- all other repos -> `/<repo-name>/`
- optional override via repository variable `VITE_BASE_PATH`


1. **Enable GitHub Pages in your repository:**
   - Go to your repository settings
   - Navigate to "Pages" in the left sidebar
   - Under "Source", select "GitHub Actions"

2. **Push to main/master branch:**
   - The GitHub Actions workflow (`.github/workflows/pages.yml`) will automatically:
     - Build the project
     - Deploy to GitHub Pages
   - The workflow runs on every push to `main` or `master` branch

3. **Configure base path (if needed):**
   - If your repository is NOT named `username.github.io`, you need to set the base path
   - Add a repository secret or environment variable in GitHub Actions:
     - Name: `VITE_BASE_PATH`
     - Value: `/your-repo-name/` (with leading and trailing slashes)
   - Or update `.github/workflows/pages.yml` to set it in the build step
   - If your repo IS named `username.github.io`, no configuration needed (uses `/`)

4. **Access your site:**
   - If your repository is `username/repo-name`, your site will be at:
     - `https://username.github.io/repo-name/`
   - If your repository is `username/username.github.io`, your site will be at:
     - `https://username.github.io/`

### Manual Deployment

If you prefer to deploy manually:

```bash
npm run build
# Then push the dist folder to the gh-pages branch
```

## Data Management

Content is managed through CSV files in the `public/` directory:
- `public/projects.csv` - Research projects and guidelines
- `public/partners_list.csv` - Partner organizations
- `public/about_team.csv` - Team members
- `public/publications.csv` - Research publications

Edit these CSV files to update the website content without changing code.

## Project Structure

```
├── public/          # Static assets and CSV data files
├── pages/           # React page components
├── components/      # Reusable React components
├── App.tsx          # Main app component with routing
├── index.tsx        # Entry point
└── vite.config.ts  # Vite configuration
```
