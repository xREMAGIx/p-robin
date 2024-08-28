import { persistentAtom } from "@nanostores/persistent";
import dayjs from "dayjs";

export const expireShoppingCartTime = persistentAtom<string>(
  "cart-expire-time",
  dayjs().add(1, "day").toISOString(),
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

export const shoppingCart = persistentAtom<ProductData[]>("cart", [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export function addProductToCart(product: ProductData) {
  shoppingCart.set([...shoppingCart.get(), product]);
}

export function clearCart() {
  shoppingCart.set([]);
}
