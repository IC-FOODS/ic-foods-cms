# IC-FOODS Website

A modern, professional website for the International Consortium for Food Systems Research (IC-FOODS). Built with React, Vite, and Tailwind CSS, using CSV files as the data source.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
ic-foods-web/
├── public/
│   └── images/          # Static images (logo, hero, placeholders)
├── src/
│   ├── assets/
│   │   └── styles/      # Additional styles if needed
│   ├── components/
│   │   ├── layout/      # Navbar, Footer, PageWrapper
│   │   ├── ui/          # Button, Card, SectionHeader, Badge
│   │   └── common/      # Hero, CallToAction, Stats
├── public/
│   ├── data/            # CSV data files
│   │   ├── team.csv
│   │   ├── projects.csv
│   │   ├── publications.csv
│   │   └── events.csv
│   └── images/          # Static images
│   ├── pages/           # Page components
│   ├── utils/           # CSV parser and data loaders
│   ├── App.jsx          # Main app with routing
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
└── package.json
```

## 📊 CSV Data Management

### How CSV Updates Content

All dynamic content (team members, projects, publications, events) is loaded from CSV files in `public/data/`. The website automatically parses these files and renders the content.

**To update content:**

1. Edit the relevant CSV file in `public/data/`
2. Save the file
3. The changes will appear on the website (refresh if needed)

### CSV File Formats

#### `public/data/team.csv`
```csv
name,title,affiliation,bio,photo,email,linkedin
Dr. John Doe,Director,University Name,"Bio text here",/images/photo.jpg,email@example.com,https://linkedin.com/in/johndoe
```

#### `public/data/projects.csv`
```csv
title,description,status,start_year,end_year,link
Project Name,Project description,active,2020,2025,https://project-link.com
```

#### `public/data/publications.csv`
```csv
title,authors,journal,year,doi,link
"Paper Title","Author1, Author2","Journal Name",2023,10.1234/example,https://doi.org/10.1234/example
```

#### `public/data/events.csv`
```csv
title,date,location,description,link
Event Name,2024-06-15,Location,"Event description",https://event-link.com
```

**Important Notes:**
- Use quotes for fields containing commas
- Dates should be in ISO format (YYYY-MM-DD)
- Photo paths should be relative to the public folder
- Empty fields are allowed but may cause display issues

## 🎨 Adding New Pages

1. Create a new page component in `src/pages/`
2. Import and add route in `src/App.jsx`:
   ```jsx
   import NewPage from './pages/NewPage';
   
   <Route path="/new-page" element={<NewPage />} />
   ```
3. Add navigation link in `src/components/layout/Navbar.jsx`

## 🗄️ Migrating to a Database

The current architecture is designed to make database migration straightforward:

### Current Architecture
- CSV files in `public/data/`
- `utils/csvParser.js` - Parses CSV text
- `utils/dataLoader.js` - Fetches and loads CSV data

### Migration Steps

1. **Set up API endpoints** (e.g., REST API, GraphQL)
2. **Update data loaders** in `utils/dataLoader.js`:
   ```javascript
   // Before (CSV)
   export async function loadTeamData() {
     return fetchAndParseCSV('/data/team.csv');
   }
   
   // After (API)
   export async function loadTeamData() {
     const response = await fetch('/api/team');
     return response.json();
   }
   ```
3. **Keep the same data structure** - The component code doesn't need to change if the API returns the same object structure
4. **Update CSV parsing** - Remove `csvParser.js` if no longer needed, or keep for admin CSV import functionality

### Benefits of Current Structure
- Components are decoupled from data source
- Easy to swap CSV for API calls
- Same data structure expected by components
- Can run both CSV and API in parallel during migration

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to change the color scheme:
```javascript
colors: {
  primary: {
    // Your color palette
  }
}
```

### Fonts
Change fonts in `index.html` and `tailwind.config.js`:
- Update Google Fonts link in `index.html`
- Update `fontFamily` in `tailwind.config.js`

### Styling
- Global styles: `src/index.css`
- Component styles: Tailwind classes in component files
- Custom utilities: Add to `tailwind.config.js` under `extend`

## 🖼️ Images

Place images in `public/images/`:
- `logo.png` - Site logo
- `hero.jpg` - Hero section image
- `placeholders/` - Team photos and other images

Update image paths in:
- CSV files (team photos)
- Component props (hero image)

## ♿ Accessibility

The website follows accessibility best practices:
- Semantic HTML elements
- ARIA labels where appropriate
- Keyboard navigation support
- Proper contrast ratios
- Alt text for images (add as needed)

## 📱 Responsive Design

The website is fully responsive:
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Mobile hamburger menu
- Responsive grids and layouts

## 🧪 Development

### Code Structure
- **Components**: Reusable, well-documented
- **Pages**: Route-level components
- **Utils**: Pure functions for data processing
- **Data**: CSV files only (no hardcoded data)

### Best Practices
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic to utils
- Use Tailwind for styling (avoid inline styles)
- Follow existing naming conventions

## 📦 Dependencies

- **React 18** - UI framework
- **React Router 6** - Client-side routing
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Icon library
- **PapaParse** - CSV parsing

## 🚢 Deployment

### Build
```bash
npm run build
```

Output will be in `dist/` directory.

### Deployment Options
- **Vercel**: Connect GitHub repo, auto-deploy
- **Netlify**: Drag and drop `dist/` folder
- **GitHub Pages**: Use GitHub Actions
- **Any static host**: Upload `dist/` contents

### Environment Variables
Currently none required. If adding API endpoints later, use environment variables for API URLs.

## 📝 License

This project is proprietary. All rights reserved.

## 🤝 Contributing

1. Follow the existing code style
2. Update CSV files for content changes
3. Test on multiple screen sizes
4. Ensure accessibility standards
5. Document any new features

## 📧 Support

For questions or issues, contact the development team.

---

**Built with ❤️ for IC-FOODS**

