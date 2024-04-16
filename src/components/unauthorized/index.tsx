import React from "react";
import GradientText from "../golbal/GradientText";
import Link from "next/link";

const Unauthorized = () => {
  return (
    <div className="h-screen w-screen p-4 text-center flex justify-center items-center  flex-col">
      <div className="text-4xl md:text-6xl">
        <GradientText
          text={"Unauthorized Access"}
          from="red"
          to="blue"
          size="3.75rem"
        />
      </div>
      <p className="mt-1 text-muted-foreground">
        Contact support or your agency owner to get access{" "}
      </p>
      <Link
        href={"/"}
        className="mt-4 bg-transparent 
        p-3 rounded-md border-[2px] 
        hover:animate-bounce
        "
      >
        <GradientText text={" Back to Home"} from="red" to="blue" />
      </Link>
    </div>
  );
};

export default Unauthorized;
