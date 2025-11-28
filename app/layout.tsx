import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "../lib/LanguageContext";
import { AuthProvider } from "../lib/UserContext";
import { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const pacifico = localFont({
  src: "./fonts/Pacifico-Regular.ttf",
  variable: "--font-pacifico",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/Inter-Italic-VariableFont_opsz_wght.ttf",
  variable: "--font-inter",
  display: "swap",
});

const robotoMono = localFont({
  src: "./fonts/RobotoMono-Italic-VariableFont_wght.ttf",
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://supplier.sa"),
  title: {
    default: "Supplier.sa | المنصة الشاملة للموردين في السعودية",
    template: "%s | Supplier.sa",
  },
  description:
    "Supplier.sa helps businesses in Saudi Arabia discover, compare, and connect with trusted suppliers. منصة الموردين في السعودية لاكتشاف ومقارنة والتواصل مع أفضل الموردين.",
  keywords: [
    "suppliers",
    "business directory",
    "B2B marketplace",
    "Saudi Arabia",
    "KSA suppliers",
    "procurement",
    "tenders",
    "saudi business",
    "electronics suppliers",
    "construction suppliers",
    "wholesale",
    "logistics",
    "manufacturing",
    "verified suppliers",
    "ecommerce B2B",
    "سعودية",
    "موردين",
    "سوق الجملة",
    "دليل الأعمال",
    "منصة الموردين",
    "شركات",
    "مؤسسات",
    "توريد",
    "شراء",
    "مناقصات",
  ],
  applicationName: "Supplier.sa",
  authors: [{ name: "Supplier.sa" }],
  creator: "Supplier.sa",
  publisher: "Supplier.sa",
  category: "Business",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://supplier.sa/",
  },
  openGraph: {
    type: "website",
    url: "https://supplier.sa/",
    siteName: "Supplier.sa",
    title: "Supplier.sa | المنصة الشاملة للموردين في السعودية",
    description:
      "اكتشف وتواصل مع أفضل الموردين في السعودية. Discover and connect with trusted suppliers across KSA.",
    locale: "ar_SA",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Supplier.sa | Trusted Suppliers in Saudi Arabia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@supplier_sa",
    creator: "@supplier_sa",
    title: "Supplier.sa",
    description:
      "Discover and connect with trusted suppliers across Saudi Arabia | اكتشف وتواصل مع أفضل الموردين في السعودية",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="rtl">
      <body
        className={`${inter.variable} ${pacifico.variable} ${robotoMono.variable} font-sans`}
      >
        <AuthProvider>
          <LanguageProvider>
            {children}
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={true}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              toastStyle={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "1rem",
                direction: "rtl",
                textAlign: "right",
              }}
            />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
