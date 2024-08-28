import React, { type HTMLAttributes } from "react";
import cls from "classnames";
import type { PropsWithChildren } from "react";

export interface IGlobalErrorBoundaryProps
  extends HTMLAttributes<HTMLDivElement> {}

export const GlobalErrorBoundary: React.FunctionComponent<
  PropsWithChildren<IGlobalErrorBoundaryProps>
> = ({ children, className, ...props }) => {
  return (
    <div {...props} className={cls(className)}>
      <p className="text-lg">ERROR</p>
    </div>
  );
};
