import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainNav from "@/components/MainNav";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NDC Ticketing System",
  description: "Developed by Louiskhen Yagdulas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col h-screen">
            <nav className="flex flex-col items-center border-b px-5 py-3">
              <div className="max-w-6xl w-full">
                <MainNav />
              </div>
            </nav>
            <main className="flex flex-grow items-center justify-center">
              <div className="max-w-6xl w-full">{children}</div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
