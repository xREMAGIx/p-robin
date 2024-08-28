import clsx from "clsx";
import type { PropsWithChildren } from "react";
import React, { type HTMLAttributes } from "react";

export interface InfoCartProps extends HTMLAttributes<HTMLDivElement> {}

export const InfoCart: React.FunctionComponent<
  PropsWithChildren<InfoCartProps>
> = ({ children, className, ...props }) => {
  return (
    <div
      {...props}
      className={clsx(className, "card card-compact bg-base-100 shadow-xl")}
    >
      <div className="card-body">
        <b className="text-lg">Cart info</b>
        <div className="divider" />
        <div className="flex justify-between">
          <span>Total price</span>
          <b>90000</b>
        </div>
        <div className="flex justify-between">
          <span>Discount</span>
          <b>-90000</b>
        </div>
        <div className="divider" />
        <div className="flex justify-between">
          <span className="text-xl">Total</span>
          <b className="text-xl">90000</b>
        </div>
      </div>
      <button className="mt-4 btn btn-primary">Order</button>
    </div>
  );
};
