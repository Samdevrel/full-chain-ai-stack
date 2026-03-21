import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Full-Chain AI Stack | @samdevrel",
  description: "Interactive demo of Full-Chain AI Agent architecture. Perceive → Reason → Execute → Communicate across on-chain and off-chain.",
  keywords: ["AI agents", "full-chain", "multi-agent", "orchestration", "Web3"],
  authors: [{ name: "Sam", url: "https://x.com/samdevrel" }],
  openGraph: {
    title: "Full-Chain AI Stack Simulator",
    description: "See how AI agents coordinate across multiple chains",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@samdevrel",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
