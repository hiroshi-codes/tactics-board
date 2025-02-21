import React, { ButtonHTMLAttributes, ReactNode } from "react";

import { IconBaseProps, IconType } from "react-icons";

function IconButton({
  children,
  Icon,
  iconProps,
  buttonProps,
  className = "",
  color = "blue",
  size = 20,
}: {
  children?: ReactNode;
  Icon: IconType;
  iconProps?: IconBaseProps;
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  className?: string;
  color?: string;
  size?: number;
}) {
  const clicking = React.useRef(false);
  let classColor = "";
  switch (color) {
    case "blue":
      classColor = "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300";
      break;
    case "lime":
      classColor = "bg-lime-700 hover:bg-lime-800 focus:ring-lime-300";
      break;
    case "red":
      classColor = "bg-red-700 hover:bg-red-800 focus:ring-red-300";
      break;
    case "green":
      classColor = "bg-green-700 hover:bg-green-800 focus:ring-green-300";
      break;
    default:
      break;
  }
  if (buttonProps?.disabled && !clicking.current) {
    classColor = "bg-gray-700 hover:bg-gray-800 focus:ring-gray-300";
  }
  const onClick: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    clicking.current = true;
    if (buttonProps?.onClick) await buttonProps.onClick(e);
    clicking.current = false;
  };
  return (
    <button
      type="button"
      className={`text-white focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-1 inline-flex items-center me-2 ${classColor} ${className}`}
      {...buttonProps}
      onClick={onClick}
    >
      <Icon size={size} {...iconProps} />
      {children}
    </button>
  );
}

export default IconButton;
