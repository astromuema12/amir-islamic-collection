# Amir Islamic Collections

A premium Islamic products marketplace built with Next.js. Browse and purchase prayer mats, Qur'ans, hijabs, perfumes, and many more Islamic essentials from trusted sellers.

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Utility-first styling |
| **Drizzle ORM** | Type-safe database queries |
| **Neon (PostgreSQL)** | Serverless database |
| **Better Auth** | Authentication |
| **Paystack** | Payment processing |
| **Cloudinary** | Media storage |
| **Resend** | Email delivery |
| **Framer Motion** | Animations |
| **Zustand** | State management |
| **Zod** | Schema validation |
| **React Hook Form** | Form management |
| **Recharts** | Admin dashboard charts |
| **Stripe** | Seller payouts |

## Features

- **User roles**: Admin, seller, and customer dashboards
- **Product catalog**: 22 categories, brands, search, and advanced filtering
- **Shopping cart**: Persistent cart with quantity management
- **Wishlist**: Save products for later
- **Order management**: Full order lifecycle from pending to delivery
- **Reviews & ratings**: Authenticated product reviews
- **Coupons & discounts**: Promotional coupon system
- **Seller marketplace**: Seller profiles, storefronts, and product management
- **Payment integration**: Paystack for secure payments
- **Admin dashboard**: Analytics, user management, and platform oversight
- **Responsive design**: Mobile-first, works on all devices
- **SEO optimized**: Dynamic metadata, sitemap, and robots.txt

## Prerequisites

- Node.js 18+ (recommended: 20 LTS)
- npm 9+
- A Neon PostgreSQL database (free tier available at [neon.tech](https://neon.tech))
- Paystack account for payments
- Cloudinary account for image uploads
- Resend account for transactional emails

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/amir-islamic-collection.git
cd amir-islamic-collection
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

### 4. Configure your `.env`

```env
# Database
DATABASE_URL="postgresql://user:password@ep-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Better Auth
AUTH_SECRET="your-auth-secret-here"
AUTH_URL="http://localhost:3000"

# OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
CLOUDINARY_UPLOAD_PRESET="your-upload-preset"

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_xxxxxxxxxxxx"
PAYSTACK_SECRET_KEY="sk_test_xxxxxxxxxxxx"

# Resend
RESEND_API_KEY="re_xxxxxxxxxxxx"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Amir Islamic Collections"
```

### 5. Database setup

Generate the database schema and apply migrations:

```bash
npm run db:generate
npm run db:migrate
```

### 6. Seed the database (optional)

Populate the database with sample data:

```bash
npm run db:seed
```

### 7. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Commands

| Command | Description |
|---|---|
| `npm run db:generate` | Generate Drizzle migrations from schema |
| `npm run db:migrate` | Apply pending migrations to the database |
| `npm run db:seed` | Seed the database with sample data |
| `npm run db:studio` | Open Drizzle Studio browser-based DB viewer |

## Seeded Accounts

After running `npm run db:seed`, the following accounts are created:

| Role | Email | Password |
|---|---|---|
| Admin | admin@amirislamic.com | Admin123! |
| Seller | seller@amirislamic.com | Seller123! |
| User | user@amirislamic.com | User123! |

**Demo coupon**: `WELCOME10` — 10% off orders above $20 (max discount $50)

## Building for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

1. Push your repository to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Configure the following environment variables in Vercel dashboard:
   - `DATABASE_URL` — Your Neon PostgreSQL connection string
   - `AUTH_SECRET` — Generate with `openssl rand -base64 32`
   - `AUTH_URL` — Your production URL (e.g., `https://your-app.vercel.app`)
   - `NEXT_PUBLIC_APP_URL` — Same as AUTH_URL
   - Paystack, Cloudinary, and Resend keys
4. Deploy. Vercel automatically detects the Next.js configuration.

> **Note**: Drizzle migrations must be run manually after deployment. Connect to your Neon database using `psql` or the Neon console and run the SQL from the `drizzle/` folder, or set up a post-deploy script.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (shop)/            # Shop pages (products, cart, checkout)
│   ├── admin/             # Admin dashboard routes
│   ├── blog/              # Blog pages
│   ├── about/             # About us page
│   ├── contact/           # Contact page
│   ├── privacy/           # Privacy policy
│   ├── terms/             # Terms & conditions
│   └── ...
├── components/
│   ├── ui/                # Reusable UI components (shadcn/ui)
│   └── products/          # Product-related components
├── hooks/                 # Custom React hooks
├── lib/
│   ├── db/
│   │   ├── schema/        # Drizzle ORM schema definitions
│   │   ├── index.ts       # Database client setup
│   │   ├── migrate.ts     # Migration runner
│   │   └── seed.ts        # Database seeder
│   ├── auth.ts            # Better Auth configuration
│   ├── cloudinary.ts      # Cloudinary client
│   ├── constants.ts       # App-wide constants
│   ├── paystack.ts        # Paystack integration
│   ├── queries.ts         # Database query helpers
│   ├── resend.ts          # Email client
│   ├── utils.ts           # Utility functions
│   └── validations.ts     # Zod schemas
├── store/                 # Zustand state stores
│   ├── cart-store.ts
│   ├── wishlist-store.ts
│   └── ui-store.ts
└── types/                 # TypeScript type definitions
```

## API Documentation

The frontend communicates with the database directly through server components and server actions (no REST API layer). Key server actions are organized by domain in the `src/app/` route handlers.

### Authentication

Managed by Better Auth. Routes are protected via middleware at `src/middleware.ts`.

### Payment

Paystack integration handles checkout. The flow:
1. User proceeds to checkout
2. Backend creates a Paystack transaction
3. User is redirected to Paystack checkout
4. Webhook confirms payment and updates order status

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request.

### Code style

- TypeScript strict mode enabled
- ESLint and Prettier formatting
- Follow existing patterns for components and pages

## License

MIT License — see the [LICENSE](LICENSE) file for details.
