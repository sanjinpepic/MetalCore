import './globals.css'
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google'
import PageLoader from './components/PageLoader'
import CookieConsent from '@/components/CookieConsent'
import { ConsentProvider } from '@/lib/hooks/use-consent'
import { OnboardingProvider } from '@/context/OnboardingContext'
import OnboardingOverlay from '@/components/onboarding/OnboardingOverlay'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL('https://metalcore.io'),
  title: {
    default: 'MetalCore — Knife Steel Database | Composition, Properties & Reviews',
    template: '%s | MetalCore',
  },
  description: 'The ultimate knife steel database. Compare composition, edge retention, toughness, and heat treatment data for 250+ steels including M390, MagnaCut, S30V, VG-10, and more.',
  keywords: [
    'knife steel database', 'knife steel comparison', 'best knife steel', 'knife steel chart',
    'M390 steel', 'MagnaCut steel', 'S30V steel', 'VG-10 steel', 'D2 steel', 'CPM steel',
    'steel composition', 'steel properties', 'edge retention', 'toughness', 'corrosion resistance',
    'heat treatment', 'powder metal steel', 'stainless steel knives',
    'metallurgy', 'blade steel', 'knife making', 'EDC knife steel',
  ],
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://metalcore.io',
    siteName: 'MetalCore',
    title: 'MetalCore - Premium Metallurgy',
    description: 'Premium metallurgy and knife analysis platform.',
    images: [
      {
        // Use existing app icon as fallback until a dedicated OG image is added
        url: '/icons/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'MetalCore logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MetalCore',
    description: 'Premium metallurgy and knife analysis platform',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MetalCore',
  },
}

export const viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${outfit.variable} font-sans min-h-screen flex flex-col`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'MetalCore',
                url: 'https://metalcore.io',
                description: 'The ultimate knife steel database. Compare 250+ steels by composition, edge retention, toughness, and heat treatment.',
                potentialAction: {
                  '@type': 'SearchAction',
                  target: { '@type': 'EntryPoint', urlTemplate: 'https://metalcore.io/?search={search_term_string}' },
                  'query-input': 'required name=search_term_string',
                },
              },
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'MetalCore',
                url: 'https://metalcore.io',
                logo: 'https://metalcore.io/icons/icon-512x512.png',
                description: 'MetalCore provides the most comprehensive knife steel database on the internet, covering composition, performance, and heat treatment for 250+ steels.',
              },
              {
                '@context': 'https://schema.org',
                '@type': 'SoftwareApplication',
                name: 'MetalCore',
                applicationCategory: 'DatabaseApplication',
                operatingSystem: 'Any',
                description: 'Interactive knife steel comparison tool with 250+ steels, performance charts, and heat treatment data.',
                offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
                featureList: ['Steel composition lookup', 'Performance comparison', 'Heat treatment curves', 'Side-by-side steel comparison', 'Knife database'],
              },
            ]),
          }}
        />
        <ConsentProvider>
          <OnboardingProvider>
            <PageLoader />
            <div className="flex-1">
              {children}
            </div>
            <OnboardingOverlay />
            <CookieConsent />
          </OnboardingProvider>
        </ConsentProvider>
      </body>
    </html>
  )
}
