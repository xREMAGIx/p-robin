import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import Elysia, { Static, t } from "elysia";
import { goodsReceiptDetailTable, productTable } from "../db-schema";
import { metaPaginationSchema, queryPaginationSchema } from "./base";

export const baseSelectGoodsReceiptDetailSchema = createSelectSchema(
  goodsReceiptDetailTable
);

const baseSelectProductSchema = createSelectSchema(productTable);

export const baseInsertGoodsReceiptDetailSchema = createInsertSchema(
  goodsReceiptDetailTable
);

export const goodsReceiptDetailDataSchema = t.Composite([
  baseSelectGoodsReceiptDetailSchema,
  t.Object({
    product: t.Optional(t.Nullable(t.Composite([baseSelectProductSchema]))),
  }),
]);

export const listGoodsReceiptDetailQuerySchema = t.Composite([
  queryPaginationSchema,
  t.Object({}),
]);

export const listGoodsReceiptDetailDataSchema = t.Array(
  goodsReceiptDetailDataSchema
);

export const listGoodsReceiptDetailPagePaginationDataSchema = t.Object({
  data: t.Array(goodsReceiptDetailDataSchema),
  meta: t.Pick(t.Required(metaPaginationSchema), [
    "limit",
    "page",
    "total",
    "totalPages",
  ]),
});

export const listGoodsReceiptDetailOffsetPaginationDataSchema = t.Object({
  data: t.Array(goodsReceiptDetailDataSchema),
  meta: t.Pick(t.Required(metaPaginationSchema), [
    "limit",
    "offset",
    "hasMore",
  ]),
});

export const detailGoodsReceiptDetailDataSchema = t.Object({
  data: goodsReceiptDetailDataSchema,
});

export const createGoodsReceiptDetailParamSchema = t.Composite([
  t.Omit(baseInsertGoodsReceiptDetailSchema, ["id", "createdAt", "updatedAt"]),
  t.Object({}),
]);

export const updateGoodsReceiptDetailParamSchema = t.Composite([
  t.Omit(baseInsertGoodsReceiptDetailSchema, ["id", "createdAt", "updatedAt"]),
  t.Object({}),
]);

export const deleteGoodsReceiptDetailDataSchema = t.Object({
  data: t.Object({ id: t.Number() }),
});

export const multipleDeleteGoodsReceiptDetailParamSchema = t.Object({
  ids: t.Array(t.Number()),
});

export const multipleDeleteGoodsReceiptDetailDataSchema = t.Object({
  data: t.Array(t.Object({ id: t.Number() })),
});

export type GoodsReceiptDetailData = Static<
  typeof baseSelectGoodsReceiptDetailSchema
>;

export type GoodsReceiptDetailListPagePaginationData = Static<
  typeof listGoodsReceiptDetailPagePaginationDataSchema
>;

export type GetListGoodsReceiptDetailParams = Static<
  typeof listGoodsReceiptDetailQuerySchema
> & {
  sortBy?: keyof GoodsReceiptDetailData;
};

export type GetDetailGoodsReceiptDetailParams = {
  id: number;
};

export type CreateGoodsReceiptDetailParams = Static<
  typeof createGoodsReceiptDetailParamSchema
>;
export type UpdateGoodsReceiptDetailParams = Static<
  typeof updateGoodsReceiptDetailParamSchema
> & {
  id: number;
};
export type DeleteGoodsReceiptDetailParams = {
  id: number;
};
export type DeleteMultipleGoodsReceiptDetailParams = Static<
  typeof multipleDeleteGoodsReceiptDetailParamSchema
>;

//* Model
export const goodsReceiptDetailModel = new Elysia({
  name: "goods-receipt-detail-model",
}).model({
  "goodsReceiptDetail.data": baseSelectGoodsReceiptDetailSchema,
});
