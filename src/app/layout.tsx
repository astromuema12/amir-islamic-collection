import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { headers } from "next/headers"
import "./globals.css"
import { Providers } from "@/components/layout/providers"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration"
import { InstallAppPrompt } from "@/components/pwa/install-app-prompt"
import { APP_NAME, APP_DESCRIPTION, APP_URL } from "@/lib/constants"
import { getCurrentUser } from "@/lib/auth"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
})

const siteUrl = APP_URL

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0F766E" },
    { media: "(prefers-color-scheme: dark)", color: "#0F766E" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} - Premium Islamic Products Marketplace`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "Islamic products",
    "prayer mats",
    "Quran",
    "hijabs",
    "perfumes",
    "Islamic clothing",
    "Muslim gifts",
    "Eid gifts",
    "Ramadan collection",
    "Islamic books",
    "tasbih",
    "abaya",
    "thobe",
  ],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  publisher: APP_NAME,
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: APP_NAME,
    title: `${APP_NAME} - Premium Islamic Products Marketplace`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: APP_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} - Premium Islamic Products Marketplace`,
    description: APP_DESCRIPTION,
    images: ["/og-image.png"],
    creator: "@amirislamic",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { url: "/icon-maskable-192.png", sizes: "192x192", type: "image/png", rel: "maskable" },
      { url: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", rel: "maskable" },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_NAME,
  },
  applicationName: "Amir Islamic",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "verification_token",
  },
  category: "shopping",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: APP_NAME,
  description: APP_DESCRIPTION,
  url: siteUrl,
  telephone: "+254759632162",
  email: "amirislamiccollections@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nairobi",
    addressCountry: "KE",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "50000",
  },
  openingHours: "Mo-Su 08:00-22:00",
  areaServed: "Worldwide",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Islamic Products",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Prayer Mats" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Holy Qur'an" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Hijabs" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Perfumes" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Islamic Clothing" } },
    ],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let user = null
  try {
    user = await getCurrentUser()
  } catch {
    // ignore
  }

  const nonce = (await headers()).get("x-nonce") || undefined

  return (
    <html
      lang="en"
      dir="ltr"
      className={`${inter.variable} ${playfairDisplay.variable} h-full antialiased`}
      suppressHydrationWarning
      nonce={nonce}
    >
      <head>
        <link rel="preconnect" href="https://imgproxy.attic.sh" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers nonce={nonce}>
          <Header user={user} />
          <main className="flex-1">{children}</main>
          <Footer />
          <InstallAppPrompt />
        </Providers>
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}
