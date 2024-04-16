import React from "react";

type Props = {
  text?: string;
  to?: string;
  from?: string;
  classes?: string;
  size?: string;
  children?: React.ReactNode;
};

const GradientText = ({ text, from, to, classes, size, children }: Props) => {
  return (
    <div
      className={`bg-gradient-to-r from-${from}-700 to-${to}-600 text-transparent bg-clip-text relative`}
    >
      <div
        className={`font-mono font-bold  ${classes} `}
        style={{ fontSize: size ? size : "1.5rem" }}
      >
        {text} {children && children}
      </div>
    </div>
  );
};

export default GradientText;
