import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import Elysia, { Static, t } from "elysia";
import { goodsIssueTable } from "../db-schema";
import { metaPaginationSchema, queryPaginationSchema } from "./base";
import {
  createGoodsIssueDetailParamSchema,
  listGoodsIssueDetailDataSchema,
} from "./goods-issue-detail";

export const baseSelectGoodsIssueSchema = createSelectSchema(goodsIssueTable);
export const baseInsertGoodsIssueSchema = createInsertSchema(goodsIssueTable);

export const GOODS_ISSUE_RELATION_LIST = ["detail", "detail-product"] as const;

export const goodsIssueRelationSchema = t.Object({
  includes: t.Optional(
    t.String({
      description: `${GOODS_ISSUE_RELATION_LIST.join(
        " | "
      )} (separate with comma)`,
    })
  ),
});

export const listGoodsIssueQuerySchema = t.Composite([
  queryPaginationSchema,
  t.Object({
    name: t.Optional(t.String()),
  }),

  goodsIssueRelationSchema,
]);

export const goodsIssueDataSchema = t.Composite([
  baseSelectGoodsIssueSchema,
  t.Object({
    detail: t.Optional(listGoodsIssueDetailDataSchema),
  }),
]);

export const listGoodsIssuePagePaginationDataSchema = t.Object({
  data: t.Array(goodsIssueDataSchema),
  meta: t.Pick(t.Required(metaPaginationSchema), [
    "limit",
    "page",
    "total",
    "totalPages",
  ]),
});

export const listGoodsIssueOffsetPaginationDataSchema = t.Object({
  data: t.Array(goodsIssueDataSchema),
  meta: t.Pick(t.Required(metaPaginationSchema), [
    "limit",
    "offset",
    "hasMore",
  ]),
});

export const detailGoodsIssueQueryParamSchema = t.Composite([
  goodsIssueRelationSchema,
]);

export const detailGoodsIssueDataSchema = t.Object({
  data: goodsIssueDataSchema,
});

export const createGoodsIssueParamSchema = t.Composite([
  t.Omit(baseInsertGoodsIssueSchema, ["id", "createdAt", "updatedAt"]),
  t.Object({
    detail: t.Array(
      t.Omit(createGoodsIssueDetailParamSchema, ["goodsIssueId"])
    ),
  }),
]);

export const updateGoodsIssueParamSchema = t.Partial(
  t.Composite([
    t.Omit(baseInsertGoodsIssueSchema, ["id", "createdAt", "updatedAt"]),
    t.Object({
      detail: t.Array(
        t.Omit(createGoodsIssueDetailParamSchema, ["goodsIssueId"])
      ),
    }),
  ])
);

export const deleteGoodsIssueDataSchema = t.Object({
  data: t.Object({ id: t.Number() }),
});

export const multipleDeleteGoodsIssueParamSchema = t.Object({
  ids: t.Array(t.Number()),
});

export const multipleDeleteGoodsIssueDataSchema = t.Object({
  data: t.Array(t.Object({ id: t.Number() })),
});

export type GoodsIssueData = Static<typeof baseSelectGoodsIssueSchema>;

export type GoodsIssueListPagePaginationData = Static<
  typeof listGoodsIssuePagePaginationDataSchema
>;

export type GetListGoodsIssueParams = Static<
  typeof listGoodsIssueQuerySchema
> & {
  sortBy?: keyof GoodsIssueData;
};

export type GetDetailGoodsIssueParams = {
  id: number;
} & Static<typeof detailGoodsIssueQueryParamSchema>;

export type CreateGoodsIssueParams = Static<typeof createGoodsIssueParamSchema>;
export type UpdateGoodsIssueParams = Static<
  typeof updateGoodsIssueParamSchema
> & {
  id: number;
};
export type DeleteGoodsIssueParams = {
  id: number;
};
export type DeleteMultipleGoodsIssueParams = Static<
  typeof multipleDeleteGoodsIssueParamSchema
>;

//* Model
export const goodsIssueModel = new Elysia({ name: "goods-issue-model" }).model({
  "goodsIssue.data": baseSelectGoodsIssueSchema,
});
