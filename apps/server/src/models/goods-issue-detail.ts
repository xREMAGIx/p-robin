import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import Elysia, { Static, t } from "elysia";
import { goodsIssueDetailTable } from "../db-schema";
import { metaPaginationSchema, queryPaginationSchema } from "./base";

export const baseSelectGoodsIssueDetailSchema = createSelectSchema(
  goodsIssueDetailTable
);

export const baseInsertGoodsIssueDetailSchema = createInsertSchema(
  goodsIssueDetailTable
);

export const listGoodsIssueDetailQuerySchema = t.Composite([
  queryPaginationSchema,
  t.Object({}),
]);

export const listGoodsIssueDetailDataSchema = t.Array(
  baseSelectGoodsIssueDetailSchema
);

export const listGoodsIssueDetailPagePaginationDataSchema = t.Object({
  data: t.Array(baseSelectGoodsIssueDetailSchema),
  meta: t.Pick(t.Required(metaPaginationSchema), [
    "limit",
    "page",
    "total",
    "totalPages",
  ]),
});

export const listGoodsIssueDetailOffsetPaginationDataSchema = t.Object({
  data: t.Array(baseSelectGoodsIssueDetailSchema),
  meta: t.Pick(t.Required(metaPaginationSchema), [
    "limit",
    "offset",
    "hasMore",
  ]),
});

export const detailGoodsIssueDetailDataSchema = t.Object({
  data: baseSelectGoodsIssueDetailSchema,
});

export const createGoodsIssueDetailParamSchema = t.Composite([
  t.Omit(baseInsertGoodsIssueDetailSchema, ["id", "createdAt", "updatedAt"]),
  t.Object({}),
]);

export const updateGoodsIssueDetailParamSchema = t.Composite([
  t.Omit(baseInsertGoodsIssueDetailSchema, ["id", "createdAt", "updatedAt"]),
  t.Object({}),
]);

export const deleteGoodsIssueDetailDataSchema = t.Object({
  data: t.Object({ id: t.Number() }),
});

export const multipleDeleteGoodsIssueDetailParamSchema = t.Object({
  ids: t.Array(t.Number()),
});

export const multipleDeleteGoodsIssueDetailDataSchema = t.Object({
  data: t.Array(t.Object({ id: t.Number() })),
});

export type GoodsIssueDetailData = Static<
  typeof baseSelectGoodsIssueDetailSchema
>;

export type GoodsIssueDetailListPagePaginationData = Static<
  typeof listGoodsIssueDetailPagePaginationDataSchema
>;

export type GetListGoodsIssueDetailParams = Static<
  typeof listGoodsIssueDetailQuerySchema
> & {
  sortBy?: keyof GoodsIssueDetailData;
};

export type GetDetailGoodsIssueDetailParams = {
  id: number;
};

export type CreateGoodsIssueDetailParams = Static<
  typeof createGoodsIssueDetailParamSchema
>;
export type UpdateGoodsIssueDetailParams = Static<
  typeof updateGoodsIssueDetailParamSchema
> & {
  id: number;
};
export type DeleteGoodsIssueDetailParams = {
  id: number;
};
export type DeleteMultipleGoodsIssueDetailParams = Static<
  typeof multipleDeleteGoodsIssueDetailParamSchema
>;

//* Model
export const goodsIssueDetailModel = new Elysia({
  name: "goods-issue-detail-model",
}).model({
  "goodsIssueDetail.data": baseSelectGoodsIssueDetailSchema,
});
