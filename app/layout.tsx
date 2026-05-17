import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import { Toaster } from 'react-hot-toast';

// ── Fonts ────────────────────────────────────────────────
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

// ── Metadata ─────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: 'ChinaHut — Premium Imported Products',
    template: '%s | ChinaHut',
  },
  description:
    'Shop premium imported products from China — Electronics, Fashion, Beauty, Baby Goods, Pet Goods, and more.',
  keywords: ['china imports', 'electronics', 'fashion', 'beauty', 'baby goods', 'pet goods'],
  openGraph: {
    title: 'ChinaHut — Premium Imported Products',
    description: 'Your one-stop shop for premium imported goods from China.',
    type: 'website',
  },
};

// ── Root Layout ───────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        {/* ============================================================
            MICROSOFT CLARITY — Paste your Clarity script tag below.
            1. Go to https://clarity.microsoft.com/
            2. Create a project and copy the <script> snippet
            3. Replace the comment below with the full <script> tag
            Example:
            <script type="text/javascript">
              (function(c,l,a,r,i,t,y){ ... })(window, document, "clarity", "script", "YOUR_ID");
            </script>
            ============================================================ */}
        {/* === CLARITY_SCRIPT_PLACEHOLDER === */}
      </head>
      <body className="font-body bg-surface-50 text-gray-900 antialiased">
        <CartProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1a1a1a',
                color: '#fff',
                borderRadius: '10px',
                fontSize: '14px',
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
