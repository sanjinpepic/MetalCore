import './globals.css'
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google'
import PageLoader from './components/PageLoader'
import CookieConsent from '@/components/CookieConsent'
import { ConsentProvider } from '@/lib/hooks/use-consent'

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
  title: 'MetalCore - Premium Metallurgy',
  description: 'Premium metallurgy and knife analysis platform',
  manifest: '/manifest.json',
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
        <ConsentProvider>
          <PageLoader />
          <div className="flex-1">
            {children}
          </div>
          <CookieConsent />
        </ConsentProvider>
      </body>
    </html>
  )
}
