import clsx from "clsx";
import React, { type HTMLAttributes } from "react";
import x from "@assets/icons/ic_x.svg";
import facebook from "@assets/icons/ic_fb.svg";
import menu from "@assets/icons/ic_menu.svg";
import messageReply from "@assets/icons/ic_message_reply.svg";
import shoppingCart from "@assets/icons/ic_shopping_cart.svg";
import trash from "@assets/icons/ic_trash.svg";

const iconList = {
  menu,
  x,
  facebook,
  messageReply,
  shoppingCart,
  trash,
};

export type IconName = keyof typeof iconList;

export type IconSize = "2" | "3" | "4" | "5" | "6" | "7" | "8";

interface IconProps extends HTMLAttributes<HTMLImageElement> {
  iconName: IconName;
  size?: IconSize;
}

const sizeVariants = {
  "2": "w-2 h-2",
  "3": "w-3 h-3",
  "4": "w-4 h-4",
  "5": "w-5 h-5",
  "6": "w-6 h-6",
  "7": "w-7 h-7",
  "8": "w-8 h-8",
};

const Icon: React.FC<IconProps> = ({ iconName, size = "6", className }) => (
  <img
    aria-label={iconName}
    alt={`icon-${iconName}`}
    src={iconList[iconName].src}
    loading="lazy"
    className={clsx(`${sizeVariants[size]}`, className)}
  />
);

export default Icon;
