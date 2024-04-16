import Image from "next/image";
import React from "react";
import stripeLogo from "../../../../../../../../../../../../../public/stripelogo.png";
type Props = {};

const CheckoutPlaceHolder = (props: Props) => {
  return (
    <div
      draggable
      onDragStart={(e) => {
        if (e.type === null) return;
        e.dataTransfer.setData("componentType", "paymentForm");
      }}
      className="h-14 w-14 bg-muted/70 rounded-lg p-2 flex justify-center items-center gap-[4px] cursor-pointer"
    >
      <Image
        src={stripeLogo}
        alt="stripe logo"
        height={60}
        width={60}
        className=" object-cover"
      />
    </div>
  );
};

export default CheckoutPlaceHolder;
