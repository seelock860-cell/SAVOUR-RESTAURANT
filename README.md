# SAVOURÉ RESTAURANT — Luxury Fine Dining & Ordering Platform
### Designed & Developed by LOCKVEX ⚡ Professional Website Development

SAVOURÉ RESTAURANT is a premier, production-ready luxury restaurant web application built with React 19, TypeScript, Vite, and Tailwind CSS. It features a complete digital culinary menu, customer ordering system with direct WhatsApp order dispatch, table reservation management, and an executive administration portal.

---

## 🚀 One-Click Deployment to Vercel

### Option A: Deploy via GitHub (Recommended)
1. **Push this project to your GitHub account**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Savoure Restaurant by LOCKVEX"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   git push -u origin main
   ```
2. **Go to [Vercel.com](https://vercel.com) and log in**.
3. **Click "Add New" > "Project"** and select your GitHub repository.
4. **Vercel will automatically detect**:
   - Framework Preset: **Vite**
   - Build Command: `vite build`
   - Output Directory: `dist`
5. **Add Environment Variables (Optional)**:
   - `VITE_WHATSAPP_NUMBER`: `2349024971419`
   - `VITE_SUPABASE_URL`: *(Your Supabase Project URL if using Supabase)*
   - `VITE_SUPABASE_ANON_KEY`: *(Your Supabase Anon Public Key)*
6. **Click "Deploy"**. Your luxury website will be live in less than 60 seconds with a custom `.vercel.app` URL and free SSL!

---

### Option B: Deploy via Vercel CLI
If you have Node.js and the Vercel CLI installed:
```bash
# 1. Install dependencies
npm install

# 2. Deploy directly
npx vercel

# 3. Deploy to production
npx vercel --prod
```

---

## ⚙️ Environment Variables (`.env`)

Create a `.env` file in the root directory (or enter them in Vercel Project Settings > Environment Variables):

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number for orders & inquiries | `2349024971419` |
| `VITE_LOCKVEX_URL` | LOCKVEX consultation WhatsApp link | `https://wa.me/2349024971419?...` |
| `VITE_SUPABASE_URL` | *(Optional)* Supabase project URL | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | *(Optional)* Supabase anonymous API key | `eyJhbGciOiJIUzI1NiIsIn...` |

> **Note**: Even without Supabase configured, the website runs in an ultra-fast **Offline / Local Sandbox Mode** with complete persistence in browser storage (`localStorage`), allowing you to test orders, menu edits, and reservations immediately.

---

## 🔐 Executive Admin Portal

- Access the Admin Dashboard by clicking the **"Executive Admin Login"** link in the website footer.
- **Admin Username**: `lockvex`
- **Admin Password**: `lockvex234`

### Capabilities in Admin Dashboard:
- **Menu Manager**: Add new dishes, upload food photos from phone/computer, edit prices in ₦, toggle chef signatures, and delete items.
- **Orders Manager**: Track incoming dining and delivery orders in real time, update order lifecycle (`Pending` -> `Preparing` -> `Out for Delivery` -> `Delivered`).
- **Table Reservations**: Review guest bookings, party sizes, VIP seating preferences, and date/time slots.
- **Restaurant Settings**: Live configuration for restaurant name, tagline, address, dining hours, and WhatsApp contact numbers.
- **Supabase Cloud Sync**: Copy the pre-generated SQL schema with one click and run it in the Supabase SQL Editor.

---

## 📁 Project Structure

```text
├── vercel.json                 # Vercel SPA routing and build configuration
├── package.json                # NPM dependencies and scripts (vite build, dev, lint)
├── vite.config.ts              # Vite + Tailwind CSS configuration
├── tsconfig.json               # TypeScript strict configuration
├── index.html                  # HTML5 entry with Google Fonts & SEO OpenGraph tags
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules for node_modules and build output
└── src/
    ├── main.tsx                # Application mounting & root rendering
    ├── App.tsx                 # Root layout, navigation, and modal assembly
    ├── index.css               # Tailwind CSS theme tokens & custom animations
    ├── types.ts                # TypeScript interfaces (MenuItem, Order, Reservation, etc.)
    ├── assets/
    │   └── images/             # High-resolution culinary photography assets
    ├── components/
    │   ├── Navbar.tsx          # 3-zone luxury navigation with offset scrolling
    │   ├── Hero.tsx            # Full-viewport hero statement with primary CTAs
    │   ├── FeaturedMeals.tsx   # Chef's signature meals carousel
    │   ├── MenuSection.tsx     # Digital catalog with 6 categories & search
    │   ├── FloatingWhatsApp.tsx# Pumping animated WhatsApp contact button
    │   ├── CartDrawer.tsx      # Ordering system, delivery fee & checkout
    │   ├── ReservationModal.tsx# Table reservation form with ticket reference
    │   ├── StoryAndAmbience.tsx# Brand philosophy, testimonials & location
    │   ├── AdminDashboard.tsx  # Executive operations management portal
    │   ├── LockvexModal.tsx    # LOCKVEX Agency portfolio & contact modal
    │   └── Footer.tsx          # Luxury footer, legal disclaimer & credit
    ├── context/
    │   └── RestaurantContext.tsx # Central state management & storage sync
    ├── data/
    │   └── initialData.ts      # Menu catalog, pricing in ₦, and presets
    └── lib/
        ├── supabase.ts         # Supabase client & SQL initialization script
        └── whatsapp.ts         # WhatsApp wa.me phone formatting helpers
```

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start local development server on port 3000
npm run dev

# Compile TypeScript & check for errors
npm run lint

# Create production build
npm run build
```

---

## ⚡ Agency Credit
Website Designed & Developed by **LOCKVEX ⚡ Professional Website Development**.
