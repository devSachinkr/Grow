import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
 
import { ThemeProvider } from "./providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "./providers/modal-provider";
const font = DM_Sans({ subsets:["latin"] });
export const metadata: Metadata = {
  title: "Grow | Simply run your agency with grow",
  description: "Solutions for all your growth needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en"  suppressHydrationWarning>
        <body className={font.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ModalProvider>
            {children}
            </ModalProvider>
            <Toaster/>
          </ThemeProvider>
          </body>
      </html>
  );
}
