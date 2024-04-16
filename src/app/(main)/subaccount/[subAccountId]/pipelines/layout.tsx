import BlurPage from "@/components/golbal/BlurPage";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return <BlurPage>{children}</BlurPage>;
};

export default layout;
