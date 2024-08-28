import cls from "classnames";
import React, { HTMLAttributes } from "react";
import dashboard from "/icons/ic-dashboard.svg";
import menu from "/icons/ic-menu.svg";
import userHexagon from "/icons/ic-user_hexagon.svg";
import chevronRight from "/icons/ic-chevron_right.svg";
import chevronLeft from "/icons/ic-chevron_left.svg";

const iconList = {
  menu,
  dashboard,
  userHexagon,
  chevronRight,
  chevronLeft,
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
    src={iconList[iconName]}
    loading="lazy"
    className={cls(`${sizeVariants[size]}`, className)}
  />
);

export default Icon;
