# Fastbreak Events Dashboard

A full-stack sports event management application built with Next.js 15+, TypeScript, Tailwind CSS, and Supabase. Features a dark sports-tech aesthetic with teal/cyan accents, matching the Fastbreak.ai design language.

## Features

- 🔐 **Authentication**: Email/password and Google OAuth via Supabase Auth
- 🛡️ **Protected Routes**: Automatic redirect to login for unauthenticated users
- 📊 **Dashboard**: View all events with search and filter capabilities
- ✏️ **CRUD Operations**: Create, read, update, and delete events
- 🏟️ **Multi-Venue Support**: Each event can have multiple venues
- 🔍 **Server-Side Search & Filter**: Real-time database queries for search and sport filtering
- 🎨 **Modern UI**: Built with shadcn/ui components, dark theme, responsive design
- 📱 **Responsive**: Works seamlessly on mobile, tablet, and desktop

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Forms**: react-hook-form + zod validation
- **Notifications**: Sonner (toast notifications)
- **Date Formatting**: date-fns

## Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- Google OAuth credentials (for Google sign-in)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Fastbreak-Interview
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Run the SQL schema from `supabase/schema.sql` to create tables and RLS policies

### 4. Configure Environment Variables ⚠️ REQUIRED

**You must create a `.env.local` file before running the application**, otherwise you'll get an error about missing Supabase credentials.

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

You can find these values in your Supabase project settings:
- **Project URL**: Settings → API → Project URL
- **Anon Key**: Settings → API → Project API keys → `anon` `public`

**Important**: 
- Copy the `.env.local` file from the root directory
- Replace the placeholder values with your actual Supabase credentials
- Never commit `.env.local` to git (it should be in `.gitignore`)

### 5. Configure Google OAuth (Optional but Recommended)

1. Go to **Authentication → Providers** in your Supabase dashboard
2. Enable **Google** provider
3. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
4. Add redirect URL to Google OAuth settings:
   - **Authorized redirect URIs**: `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`
   - For local development: `http://localhost:3000/auth/callback`

#### Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure consent screen if prompted
6. Add authorized redirect URI: `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`
7. Copy Client ID and Client Secret to Supabase

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Create Your First Account

1. Navigate to `/signup`
2. Create an account with email/password or use Google OAuth
3. You'll be redirected to the dashboard

## Project Structure

```
├── app/
│   ├── (app)/              # Protected app routes
│   │   ├── dashboard/      # Dashboard page
│   │   └── events/        # Event CRUD pages
│   ├── (auth)/             # Public auth routes
│   │   ├── login/         # Login page
│   │   └── signup/        # Signup page
│   ├── auth/               # Auth callback route
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page (redirects)
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── AppShell.tsx   # App shell layout
│   │   ├── TopNav.tsx     # Top navigation
│   │   ├── EventCard.tsx  # Event card component
│   │   ├── EventForm.tsx  # Event form component
│   │   └── VenueMultiInput.tsx # Venue input component
│   ├── lib/
│   │   ├── actions/       # Server actions
│   │   │   ├── auth.ts    # Auth actions
│   │   │   ├── events.ts  # Event CRUD actions
│   │   │   └── safe-action.ts # Action helper
│   │   ├── supabase/      # Supabase utilities
│   │   │   └── server.ts  # Server-side Supabase client
│   │   └── validators/    # Zod schemas
│   │       └── event.ts   # Event validation
├── supabase/
│   └── schema.sql         # Database schema and RLS
└── qa-testing/            # Selenium test suite
    ├── test_auth.py
    ├── test_dashboard.py
    └── test_integration.py
```

## Key Features Explained

### Server-Side Data Fetching

All database interactions happen server-side using:
- **Server Actions** for mutations (create, update, delete)
- **Server Components** for data fetching (dashboard list)

No direct Supabase client calls from client components - all data flows through server actions.

### Row Level Security (RLS)

The database uses Supabase RLS policies to ensure:
- Users can only see/modify their own events
- Venue management is scoped to event ownership
- Secure multi-tenant data isolation

### Search & Filter

- **Search**: Server-side ILIKE query on event names
- **Filter**: Server-side WHERE clause on sport type
- Both update URL query params and trigger server refetch
- Uses React Suspense for loading states

### Multi-Venue Support

- Events can have multiple venues
- Venues are stored in a separate table with a join table
- Venue names are unique across the system
- Venues are created on-the-fly when adding to events

## Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Import project to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**:
   In Vercel project settings, add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=https://your-vercel-app.vercel.app
   ```

4. **Update Supabase Redirect URLs**:
   - In Supabase: Authentication → URL Configuration
   - Add your Vercel URL to **Redirect URLs**: `https://your-vercel-app.vercel.app/auth/callback`
   - Update **Site URL**: `https://your-vercel-app.vercel.app`

5. **Update Google OAuth** (if using):
   - In Google Cloud Console, add to authorized redirect URIs:
     `https://your-vercel-app.vercel.app/auth/callback`

6. **Deploy**:
   - Vercel will automatically deploy on push to main branch
   - Or click "Deploy" in the Vercel dashboard

### Build for Production

```bash
npm run build
npm start
```

## Testing

### Run Selenium Tests

See [qa-testing/README.md](./qa-testing/README.md) for detailed testing instructions.

Quick start:
```bash
cd qa-testing
pip install -r requirements.txt
pytest
```

## Verification Checklist

After setup, verify the following:

- [ ] **Authentication**
  - [ ] Can sign up with email/password
  - [ ] Can sign in with email/password
  - [ ] Can sign in with Google OAuth
  - [ ] Unauthenticated users are redirected to `/login`
  - [ ] Sign out works correctly

- [ ] **Dashboard**
  - [ ] Dashboard loads with events list
  - [ ] Search by name refetches from database
  - [ ] Filter by sport refetches from database
  - [ ] Empty state shows when no events
  - [ ] Loading skeletons appear during fetch

- [ ] **CRUD Operations**
  - [ ] Can create new event with multiple venues
  - [ ] Can edit existing event
  - [ ] Can delete event (with confirmation dialog)
  - [ ] Form validation works correctly
  - [ ] Toast notifications appear on success/error

- [ ] **Venues**
  - [ ] Can add multiple venues to an event
  - [ ] Can remove venues from event
  - [ ] Venue names are unique
  - [ ] Venues persist correctly

- [ ] **RLS Security**
  - [ ] Users can only see their own events
  - [ ] Users cannot access other users' events
  - [ ] Database policies enforce ownership

- [ ] **UI/UX**
  - [ ] Dark theme with teal/cyan accents
  - [ ] Responsive on mobile, tablet, desktop
  - [ ] Loading states on buttons and pages
  - [ ] Error handling with user-friendly messages

## Troubleshooting

### "Invalid API key" error
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Check Supabase project settings

### OAuth redirect errors
- Ensure redirect URL is added to Supabase and Google OAuth settings
- Check `NEXT_PUBLIC_SITE_URL` matches your deployment URL

### RLS policy errors
- Verify schema.sql was run in Supabase SQL Editor
- Check that RLS is enabled on all tables
- Review policy conditions in Supabase dashboard

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors: `npm run build`
- Verify all environment variables are set

## License

This project is part of the Fastbreak interview challenge.
