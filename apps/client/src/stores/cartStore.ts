import { persistentAtom } from "@nanostores/persistent";
import dayjs from "dayjs";

type ProductData = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  description?: string | null;
  barcode?: string | null;
  price: number;
  salePrice?: number | null;
  costPrice: number;
  createdByUserId: number;
  updatedByUserId: number;
  status: number;
};

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
