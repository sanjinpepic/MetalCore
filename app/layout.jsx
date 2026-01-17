import './globals.css'
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google'
import PageLoader from './components/PageLoader'

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
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${outfit.variable} font-sans`}>
        <PageLoader />
        {children}
      </body>
    </html>
  )
}
