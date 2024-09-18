import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import Elysia, { Static, t } from "elysia";
import { goodsReceiptTable } from "../db-schema";
import { metaPaginationSchema, queryPaginationSchema } from "./base";
import {
  createGoodsReceiptDetailParamSchema,
  listGoodsReceiptDetailDataSchema,
} from "./goods-receipt-detail";

export const baseSelectGoodsReceiptSchema =
  createSelectSchema(goodsReceiptTable);

export const baseInsertGoodsReceiptSchema =
  createInsertSchema(goodsReceiptTable);

export const GOODS_RECEIPT_RELATION_LIST = [
  "detail",
  "detail-product",
] as const;

export const goodsReceiptRelationSchema = t.Object({
  includes: t.Optional(
    t.String({
      description: `${GOODS_RECEIPT_RELATION_LIST.join(
        " | "
      )} (separate with comma)`,
    })
  ),
});

export const listGoodsReceiptQuerySchema = t.Composite([
  queryPaginationSchema,
  t.Object({}),
  goodsReceiptRelationSchema,
]);

export const goodsReceiptDataSchema = t.Composite([
  baseSelectGoodsReceiptSchema,
  t.Object({
    detail: t.Optional(listGoodsReceiptDetailDataSchema),
  }),
]);

export const listGoodsReceiptPagePaginationDataSchema = t.Object({
  data: t.Array(goodsReceiptDataSchema),
  meta: t.Pick(t.Required(metaPaginationSchema), [
    "limit",
    "page",
    "total",
    "totalPages",
  ]),
});

export const listGoodsReceiptOffsetPaginationDataSchema = t.Object({
  data: t.Array(goodsReceiptDataSchema),
  meta: t.Pick(t.Required(metaPaginationSchema), [
    "limit",
    "offset",
    "hasMore",
  ]),
});

export const detailGoodsReceiptQueryParamSchema = t.Composite([
  goodsReceiptRelationSchema,
]);

export const detailGoodsReceiptDataSchema = t.Object({
  data: goodsReceiptDataSchema,
});

export const createGoodsReceiptParamSchema = t.Composite([
  t.Omit(baseInsertGoodsReceiptSchema, ["id", "createdAt", "updatedAt"]),
  t.Object({
    detail: t.Array(
      t.Omit(createGoodsReceiptDetailParamSchema, ["goodsReceiptId"])
    ),
  }),
]);

export const updateGoodsReceiptParamSchema = t.Partial(
  t.Composite([
    t.Omit(baseInsertGoodsReceiptSchema, ["id", "createdAt", "updatedAt"]),
    t.Object({
      detail: t.Array(
        t.Omit(createGoodsReceiptDetailParamSchema, ["goodsReceiptId"])
      ),
    }),
  ])
);

export const deleteGoodsReceiptDataSchema = t.Object({
  data: t.Object({ id: t.Number() }),
});

export const multipleDeleteGoodsReceiptParamSchema = t.Object({
  ids: t.Array(t.Number()),
});

export const multipleDeleteGoodsReceiptDataSchema = t.Object({
  data: t.Array(t.Object({ id: t.Number() })),
});

export type GoodsReceiptData = Static<typeof baseSelectGoodsReceiptSchema>;

export type GoodsReceiptListPagePaginationData = Static<
  typeof listGoodsReceiptPagePaginationDataSchema
>;

export type GetListGoodsReceiptParams = Static<
  typeof listGoodsReceiptQuerySchema
> & {
  sortBy?: keyof GoodsReceiptData;
};

export type GetDetailGoodsReceiptParams = {
  id: number;
} & Static<typeof detailGoodsReceiptQueryParamSchema>;

export type CreateGoodsReceiptParams = Static<
  typeof createGoodsReceiptParamSchema
>;
export type UpdateGoodsReceiptParams = Static<
  typeof updateGoodsReceiptParamSchema
> & {
  id: number;
};
export type DeleteGoodsReceiptParams = {
  id: number;
};
export type DeleteMultipleGoodsReceiptParams = Static<
  typeof multipleDeleteGoodsReceiptParamSchema
>;

//* Model
export const goodsReceiptModel = new Elysia({
  name: "goods-receipt-model",
}).model({
  "goodsReceipt.data": baseSelectGoodsReceiptSchema,
});
