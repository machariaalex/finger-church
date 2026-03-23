# Finger Church of Christ Website

**"Pointing the World to Jesus"**

A full-stack church website built with Next.js 14, TypeScript, Tailwind CSS, MongoDB, and NextAuth.

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables — copy `.env.local` and fill in your values:
```
MONGODB_URI=mongodb://localhost:27017/fingerchurch
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

3. Run the development server:
```bash
npm run dev
```

4. Seed the database (requires MongoDB running):
```bash
npm run seed
```

### Default Admin Account (after seeding)
- **Email:** admin@fingercofc.org
- **Password:** Admin@1234

## Project Structure

```
app/
  page.tsx          — Home
  church/           — About the church
  sermons/          — Sermon library
  events/           — Upcoming events
  news/             — Announcements
  gallery/          — Photo gallery
  resources/        — Bible study materials
  donations/        — Online giving
  login/            — Sign in
  register/         — Create account
  dashboard/        — Member area
  admin/            — Admin panel
  api/              — API routes
components/
  Navbar.tsx
  Footer.tsx
  Providers.tsx
lib/
  db.ts             — MongoDB connection
  auth.ts           — NextAuth config
  models/           — Mongoose models
  seed.ts           — Database seeder
```

## Deployment

- **Frontend:** Deploy to [Vercel](https://vercel.com)
- **Database:** Use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Media:** Configure [Cloudinary](https://cloudinary.com) for image uploads
- **Payments:** Set up [Stripe](https://stripe.com) for donations

## Church Information

**Address:** 2139 Finger Leapwood Road, Finger, TN 38334

**Service Times:**
- Sunday Worship — 9:30 AM
- Sunday Bible Study — 10:30 AM
- Sunday Second Worship — 11:30 AM
- Wednesday Bible Study — 6:00 PM
