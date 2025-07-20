import type { Metadata } from "next";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const metadata: Metadata = {
  title: "Weather App",
  description: "Lexiden",
  
};

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-200 via-white to-blue-50 backdrop-blur font-sans text-lg font-medium text-blue-900">
        <GoogleOAuthProvider clientId={clientId}>
          <main className="w-full flex-1 flex flex-col justify-center items-center">{children}</main>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}