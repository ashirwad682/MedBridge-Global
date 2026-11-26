import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import AmbientGlassBackground from "@/components/common/AmbientGlassBackground";
import { BookingProvider } from "@/components/booking/BookingContext";
import { AuthProvider } from "@/components/auth/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";

export const metadata: Metadata = {
  title: "MedBridge Global | Connected Healthcare",
  description:
    "Discover connected healthcare services, medical specialists, and modern diagnostic care with MedBridge Global.",
  openGraph: {
    title: "MedBridge Global | Connected Healthcare",
    description:
      "From trusted specialists to coordinated medical services, MedBridge Global brings healthcare closer together.",
    type: "website",
    locale: "en_US",
    siteName: "MedBridge Global",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('medbridge-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (stored === 'dark' || (!stored && prefersDark)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans relative selection:bg-purple-500/20 selection:text-purple-900 dark:selection:text-purple-200">
        <ThemeProvider>
          <AmbientGlassBackground />
          <AuthProvider>
            <BookingProvider>
              {children}
              <AuthModal />
              <ChatbotWidget />
            </BookingProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
