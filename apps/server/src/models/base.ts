import { Elysia, Static, t } from "elysia";

export const queryPaginationSchema = t.Partial(
  t.Object({
    sortBy: t.String(),
    sortOrder: t.Union([t.Literal("asc"), t.Literal("desc")]),
    limit: t.Numeric(),
    page: t.Numeric(),
    offset: t.Numeric(),
  })
);

export const metaPaginationSchema = t.Partial(
  t.Object({
    limit: t.Number(),
    page: t.Number(),
    total: t.Number(),
    totalPages: t.Number(),
    offset: t.Number(),
    hasMore: t.Boolean(),
  })
);

export const apiErrorSchema = t.Object({
  errors: t.Array(
    t.Object({
      status: t.String(),
      errorCode: t.String(),
      title: t.String(),
      detail: t.Optional(t.String()),
    })
  ),
});

export type QueryPaginationParams = Static<typeof queryPaginationSchema>;

export type MetaPaginationData = Static<typeof metaPaginationSchema>;

export type ErrorData = Static<typeof apiErrorSchema>;

export type WithAuthenParams<T> = T & { userId: number };

//* Model
export const queryPaginationModel = new Elysia({ name: "base-model" }).model({
  "page.pagination.query": queryPaginationSchema,
  "page.pagination.meta": metaPaginationSchema,
});
