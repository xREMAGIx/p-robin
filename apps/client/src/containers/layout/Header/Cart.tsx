import Icon from "@components/Icon/client";
import { ROUTE } from "@config/enums";
import {
  clearCart,
  expireShoppingCartTime,
  shoppingCart,
} from "@stores/cartStore";
import clsx from "clsx";
import dayjs from "dayjs";
import type { PropsWithChildren } from "react";
import React, { useEffect, type HTMLAttributes } from "react";
import useLazyStore from "src/hooks/useLazyStore";

export interface HeaderCartProps extends HTMLAttributes<HTMLDivElement> {}

const HeaderCart: React.FunctionComponent<
  PropsWithChildren<HeaderCartProps>
> = ({ children, className, ...props }) => {
  const { data: cart } = useLazyStore(shoppingCart, []);

  const { data: $expireShoppingCartTime } = useLazyStore(
    expireShoppingCartTime,
    dayjs().toISOString()
  );

  useEffect(() => {
    if (dayjs($expireShoppingCartTime).diff(dayjs(), "day") > 0) {
      clearCart();
    }
  }, [$expireShoppingCartTime]);

  return (
    <div {...props} className={clsx(className)}>
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn m-1">
          <Icon iconName="shoppingCart" />
          {!!cart.length && (
            <div className="badge badge-error">
              {cart.length > 100 ? "+99" : cart.length}
            </div>
          )}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-80 p-2 shadow"
        >
          {cart.length ? (
            <>
              <div className="flex gap-2 justify-between">
                <b>{cart.length} products</b>
                <a href={ROUTE.CART}>
                  <span className="text-secondary">Show all</span>
                </a>
              </div>
              <div className="divider my-2" />
              {cart.map((product) => (
                <li key={product.id}>
                  <a href={`${ROUTE.PRODUCTS}/${product.id}`}>
                    <div className="flex">
                      <div className="avatar mr-2">
                        <div className="w-12 rounded">
                          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <b className="line-clamp-1">{product.name}</b>
                        <p className="mt-1">Size, color, ...</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {product.salePrice ? (
                            <>
                              <b className="text-secondary">
                                {product.salePrice}
                              </b>
                              <span className="line-through text-sm">
                                {product.price}
                              </span>
                              <span className="badge badge-error text-xs">
                                -{(product.salePrice / product.price) * 100}%
                              </span>
                            </>
                          ) : (
                            <b className="text-secondary">{product.price}</b>
                          )}
                        </div>
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </>
          ) : (
            <p className="text-center">Empty</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HeaderCart;
