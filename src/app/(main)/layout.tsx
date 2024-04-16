import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
type Props = { children: React.ReactNode };

const layout = (props: Props) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      {props.children}
    </ClerkProvider>
  );
};

export default layout;
