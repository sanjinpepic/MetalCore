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
    default: 'MetalCore - Premium Metallurgy | Knife Steel Database',
    template: '%s | MetalCore',
  },
  description: 'The ultimate resource for knife steel composition, performance charts, and heat treatment protocols.',
  keywords: ['knife steel', 'metallurgy', 'M390', 'MagnaCut', 'steel composition', 'knife database', 'EDC', 'heat treatment'],
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
        url: '/og-image.jpg', // Placeholder
        width: 1200,
        height: 630,
        alt: 'MetalCore Interface',
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
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'MetalCore',
              applicationCategory: 'DatabaseApplication',
              operatingSystem: 'Any',
              description: 'The ultimate resource for knife steel composition, performance charts, and heat treatment protocols.',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            }),
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
