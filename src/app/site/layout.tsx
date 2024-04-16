import Navigation from "@/components/site/nav-bar/Navigation";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import React from "react";

type Props = { children: React.ReactNode };

const layout = ({ children }: Props) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }} >
    <main>
      <Navigation />
      {children}
    </main>
    </ClerkProvider>
  );
};

export default layout;
