import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ClientLayout } from "@/components/client-layout";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hope Hospital",
  description: "Hospital Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <ClientLayout>
            {children}
          </ClientLayout>
          <Toaster />
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.onerror = function(message, source, lineno, colno, error) {
                console.error('Global error:', { message, source, lineno, colno, error });
                return false;
              };
              
              window.onunhandledrejection = function(event) {
                console.error('Unhandled promise rejection:', event.reason);
                event.preventDefault();
              };
            `,
          }}
        />
      </body>
    </html>
  );
}
