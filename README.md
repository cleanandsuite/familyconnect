# Our Family Legacy - Family Tree Website

A magical, Disney-inspired family tree website where family members can explore their roots, share photos, and stay connected. Built with modern web technologies and designed with warmth and storytelling in mind.

## Features

- **Magical Landing Page** - Disney-inspired storytelling hero with animated sparkles and warm colors
- **Interactive Family Tree** - D3.js-powered zoomable, pannable tree visualization showing how everyone is connected
- **Photo Gallery** - Upload and browse family photos with a beautiful lightbox viewer
- **Contact Directory** - Searchable family member directory with contact information
- **OAuth Authentication** - Secure sign-in system for family members
- **Family-Friendly Design** - Warm royal blue, gold, and forest green color palette with playful animations

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Framer Motion + D3.js
- **Backend:** Hono + tRPC + Drizzle ORM + MySQL
- **Auth:** OAuth 2.0 with Kimi
- **Hosting:** Ready for static deployment (GitHub Pages, Netlify, Vercel, etc.)

## Getting Started

### Prerequisites
- Node.js 20+
- MySQL database

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd family-tree
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# .env file is auto-generated with OAuth credentials
# Update DATABASE_URL if needed
```

4. Push database schema
```bash
npm run db:push
```

5. Start development server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in `dist/public/` ready for deployment to any static host.

### Deploy to GitHub Pages

1. Build the project: `npm run build`
2. Copy `dist/public` contents to your `gh-pages` branch
3. Enable GitHub Pages in repository settings

The site uses HashRouter for client-side routing compatibility with static hosting.

## Project Structure

```
.
├── api/                  # Backend API (tRPC routers)
│   ├── router.ts         # Main router
│   ├── family-router.ts  # Family members CRUD
│   ├── relationships-router.ts  # Family connections
│   ├── photos-router.ts  # Photo management
│   └── contact-router.ts # Contact info
├── db/
│   ├── schema.ts         # Database tables
│   └── relations.ts      # Drizzle relations
├── src/
│   ├── pages/            # Route pages
│   │   ├── Home.tsx      # Landing page
│   │   ├── TreePage.tsx  # Family tree (D3.js)
│   │   ├── GalleryPage.tsx
│   │   ├── DirectoryPage.tsx
│   │   └── Login.tsx
│   ├── components/
│   │   ├── Navigation.tsx
│   │   └── Sparkles.tsx  # Animated sparkles
│   └── App.tsx           # Routes
├── public/               # Static assets (hero images)
└── contracts/            # Shared types
```

## Database Schema

- **family_members** - Stores each person (name, birth date, bio, avatar, generation)
- **relationships** - Connects family members (parent, child, spouse, sibling)
- **photos** - Uploaded family photos with metadata
- **contact_info** - Phone, email, address for each member

## Customization

- Edit `src/index.css` to change the color palette
- Replace images in `public/` folder with your own family photos
- Modify `src/pages/Home.tsx` to update the landing page story
- Adjust the tree visualization in `src/pages/TreePage.tsx`

## License

Made with love for our family.
