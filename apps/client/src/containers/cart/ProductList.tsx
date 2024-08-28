import Icon from "@components/Icon/client";
import { shoppingCart } from "@stores/cartStore";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import React, { type HTMLAttributes } from "react";
import useLazyStore from "src/hooks/useLazyStore";

export interface ProductListCartProps extends HTMLAttributes<HTMLDivElement> {}

const ProductListCart: React.FunctionComponent<
  PropsWithChildren<ProductListCartProps>
> = ({ children, className, ...props }) => {
  const { data: cart } = useLazyStore(shoppingCart, []);

  return (
    <div
      {...props}
      className={clsx(className, "card card-compact bg-base-100 shadow-xl")}
    >
      <div className="card-body">
        {cart.map((product) => (
          <>
            <div className="divider first:hidden" />
            <div className="flex items-start">
              <div className="avatar w-16 mr-2 shrink-0">
                <div className="rounded">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
              <div className="flex-1">
                <b className="line-clamp-1">{product.name}</b>
                <p className="mt-1">Size, color, ...</p>
                {product.salePrice ? (
                  <div className="flex flex-wrap gap-2">
                    <b className="text-secondary font-bold text-lg">
                      {product.salePrice}
                    </b>
                    <span className="line-through text-sm">
                      {product.price}
                    </span>
                    <span className="badge badge-error text-xs ">
                      -{(product.salePrice / product.price) * 100}%
                    </span>
                  </div>
                ) : (
                  <b className="text-secondary mt-2 text-lg">{product.price}</b>
                )}
                <div className="mt-2 flex justify-between gap-2 flex-wrap">
                  <div className="join">
                    <button className="btn btn-sm w-12 join-item">-</button>
                    <input
                      className="input input-sm max-w-12 join-item"
                      value={1}
                    />
                    <button className="btn btn-sm w-12 join-item">+</button>
                  </div>
                  <button className="btn btn-sm btn-error btn-outline">
                    <Icon iconName="trash" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default ProductListCart;
