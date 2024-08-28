import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import Elysia, { Static, t } from "elysia";
import { productTable } from "../db-schema";
import { metaPaginationSchema, queryPaginationSchema } from "./base";

export const baseSelectProductSchema = createSelectSchema(productTable);

export const baseInsertProductSchema = createInsertSchema(productTable);

export const listProductQuerySchema = t.Composite([
  queryPaginationSchema,
  t.Object({
    barcode: t.Optional(t.String()),
    name: t.Optional(t.String()),
  }),
]);

export const listProductPagePaginationDataSchema = t.Object({
  data: t.Array(baseSelectProductSchema),
  meta: t.Pick(t.Required(metaPaginationSchema), [
    "limit",
    "page",
    "total",
    "totalPages",
  ]),
});

export const listProductOffsetPaginationDataSchema = t.Object({
  data: t.Array(baseSelectProductSchema),
  meta: t.Pick(t.Required(metaPaginationSchema), [
    "limit",
    "offset",
    "hasMore",
  ]),
});

export const detailProductDataSchema = t.Object({
  data: baseSelectProductSchema,
});

export const createProductParamSchema = t.Composite([
  t.Omit(baseInsertProductSchema, [
    "id",
    "createdAt",
    "updatedAt",
    "price",
    "costPrice",
  ]),
  t.Object({
    price: t.Optional(t.Numeric()),
    costPrice: t.Optional(t.Numeric()),
  }),
]);

export const updateProductParamSchema = t.Composite([
  t.Omit(baseInsertProductSchema, [
    "id",
    "createdAt",
    "updatedAt",
    "price",
    "costPrice",
  ]),
  t.Object({
    price: t.Optional(t.Numeric()),
    costPrice: t.Optional(t.Numeric()),
  }),
]);

export const deleteProductDataSchema = t.Object({
  data: t.Object({ id: t.Number() }),
});

export type ProductData = Static<typeof baseSelectProductSchema>;

export type ProductListPagePaginationData = Static<
  typeof listProductPagePaginationDataSchema
>;

export type GetListProductParams = Static<typeof listProductQuerySchema> & {
  sortBy?: keyof ProductData;
};

export type GetDetailProductParams = {
  id: number;
};

export type CreateProductParams = Static<typeof createProductParamSchema>;
export type UpdateProductParams = Static<typeof updateProductParamSchema> & {
  id: number;
};
export type DeleteProductParams = {
  id: number;
};

//* Model
export const productModel = new Elysia({ name: "product-model" }).model({
  "product.data": baseSelectProductSchema,
});
