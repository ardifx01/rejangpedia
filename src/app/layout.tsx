import Navbar from "@/components/Navbar";
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import "./globals.css";

export const metadata = {
  title: "rejangpedia - Punyo Kito Galo",
  description: "Rejangpedia adalah ensiklopedia digital yang mengulas budaya, sejarah, dan warisan Rejang. Temukan artikel menarik, foto-foto bersejarah, dan banyak lagi!",

  // SEO Keywords
  keywords: [
    "Rejangpedia",
    "Budaya Rejang",
    "Sejarah Rejang",
    "Warisan budaya Rejang",
    "Ensiklopedia Rejang",
    "Bahasa Rejang",
    "Artikel sejarah Indonesia",
    "Rejang Bengkulu",
  ],

  // Open Graph (OG) Meta Tags for better social media previews
  openGraph: {
    title: "Rejangpedia - Punyo Kito Galo",
    type: "website",
    url: "https://rejangpedia.vercel.app", // Update if this changes
    description: "Ensiklopedia digital budaya Rejang. Jelajahi sejarah, bahasa, dan warisan budaya Rejang di Rejangpedia!",
    images: [
      {
        url: "/logo.png", // Featured image for OG (should be at least 1200x630 for best results)
        width: 1200,
        height: 630,
        alt: "Rejangpedia Logo",
      },
    ],
  },

  // Twitter Card meta tags for optimized sharing on Twitter
  twitter: {
    card: "summary_large_image",
    site: "@rejangpedia", // Optional: Twitter handle (if available)
    title: "Rejangpedia - Punyo Kito Galo",
    description: "Ensiklopedia digital budaya Rejang. Jelajahi sejarah, bahasa, dan warisan budaya Rejang di Rejangpedia!",
    images: ["/logo.png"],
  },

  // Optional - favicon/logo setup
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <title>Rejangpedia - Punyo Kito Galo</title>
        <meta name="description" content="Ensiklopedia budaya Rejang yang membahas sejarah, bahasa, dan budaya warisan leluhur masyarakat Rejang." />
        <meta name="keywords" content="Rejangpedia, Budaya Rejang, Sejarah Rejang, Ensiklopedia, Bahasa Rejang, Warisan Budaya" />
        <meta name="google-site-verification" content="5hgD0z6jKEII9VOKwLGeuBVCvR_BcV2607yUgpqJqIU" />
      </head>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
