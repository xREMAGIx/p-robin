import { Elysia } from "elysia";
import { ERROR_CODES } from "../config/enums";
import { apiErrorSchema } from "../models/base";
import {
  GoodsIssueData,
  createGoodsIssueParamSchema,
  deleteGoodsIssueDataSchema,
  detailGoodsIssueDataSchema,
  detailGoodsIssueQueryParamSchema,
  listGoodsIssueOffsetPaginationDataSchema,
  listGoodsIssuePagePaginationDataSchema,
  listGoodsIssueQuerySchema,
  multipleDeleteGoodsIssueDataSchema,
  multipleDeleteGoodsIssueParamSchema,
  goodsIssueModel,
  updateGoodsIssueParamSchema,
} from "../models/goods-issue";
import { ApiError } from "../utils/errors";
import {
  authenticatePlugin,
  idValidatePlugin,
  servicesPlugin,
} from "../utils/plugins";

export const goodsIssueRoutes = new Elysia({
  name: "goods-issue-controller",
}).group(
  `api/goods-issues`,
  {
    detail: {
      tags: ["Goods Issue"],
    },
  },
  (app) =>
    app
      .use(servicesPlugin)
      .use(goodsIssueModel)
      .use(authenticatePlugin)
      //* List
      .get(
        "/page-pagination",
        async ({
          query: {
            sortBy: sortByParams,
            sortOrder = "desc",
            limit = 10,
            page = 1,
            ...rest
          },
          goodsIssueService,
        }) => {
          const sortBy = sortByParams as keyof GoodsIssueData;
          const sortByList: (keyof GoodsIssueData)[] = [
            "createdAt",
            "updatedAt",
          ];
          if (sortBy && !sortByList.includes(sortBy)) {
            throw new ApiError({
              status: "422",
              errorCode: ERROR_CODES.VALIDATE_ERROR_INVALID_SORT_BY,
              title: ERROR_CODES.VALIDATE_ERROR_INVALID_SORT_BY,
              messageCode: "invalid_sort_by",
            });
          }

          if (sortOrder !== "asc" && sortOrder !== "desc") {
            throw new ApiError({
              status: "422",
              errorCode: ERROR_CODES.VALIDATE_ERROR_INVALID_SORT_ORDER,
              title: ERROR_CODES.VALIDATE_ERROR_INVALID_SORT_ORDER,
              messageCode: "invalid_sort_order",
            });
          }

          const res = await goodsIssueService.getListPagePagination({
            sortBy: sortBy,
            sortOrder: sortOrder,
            limit: Number(limit),
            page: Number(page),
            ...rest,
          });

          return {
            data: res.goodsIssues,
            meta: res.meta,
          };
        },
        {
          query: listGoodsIssueQuerySchema,
          response: {
            200: listGoodsIssuePagePaginationDataSchema,
            422: apiErrorSchema,
            500: apiErrorSchema,
          },
          detail: {
            summary: "Get Goods Issue List (page pagination)",
          },
        }
      )
      .get(
        "/offset-pagination",
        async ({
          query: {
            sortBy: sortByParams,
            sortOrder = "desc",
            limit = 10,
            offset = 0,
            ...rest
          },
          goodsIssueService,
        }) => {
          const sortBy = sortByParams as keyof GoodsIssueData;
          const sortByList: (keyof GoodsIssueData)[] = [
            "createdAt",
            "updatedAt",
          ];
          if (sortBy && !sortByList.includes(sortBy)) {
            throw new ApiError({
              status: "422",
              errorCode: ERROR_CODES.VALIDATE_ERROR_INVALID_SORT_BY,
              title: ERROR_CODES.VALIDATE_ERROR_INVALID_SORT_BY,
              messageCode: "invalid_sort_by",
            });
          }

          if (sortOrder !== "asc" && sortOrder !== "desc") {
            throw new ApiError({
              status: "422",
              errorCode: ERROR_CODES.VALIDATE_ERROR_INVALID_SORT_ORDER,
              title: ERROR_CODES.VALIDATE_ERROR_INVALID_SORT_ORDER,
              messageCode: "invalid_sort_order",
            });
          }

          const res = await goodsIssueService.getListOffsetPagination({
            sortBy: sortBy,
            sortOrder: sortOrder,
            limit: Number(limit),
            offset: Number(offset),
            ...rest,
          });

          return {
            data: res.goodsIssues,
            meta: res.meta,
          };
        },
        {
          query: listGoodsIssueQuerySchema,
          response: {
            200: listGoodsIssueOffsetPaginationDataSchema,
            422: apiErrorSchema,
            500: apiErrorSchema,
          },
          detail: {
            summary: "Get Goods Issue List (offset pagination)",
          },
        }
      )
      .guard((innerApp) =>
        innerApp
          .use(idValidatePlugin)
          //* Get detail
          .get(
            "/:id",
            async ({ idParams, goodsIssueService, query: { ...queries } }) => {
              const data = await goodsIssueService.getDetail({
                id: idParams,
                ...queries,
              });

              if (!data) {
                throw new ApiError({
                  status: "404",
                  errorCode: ERROR_CODES.NOT_FOUND_DATA,
                  title: ERROR_CODES.NOT_FOUND_DATA,
                  messageCode: "not_found_data",
                });
              }

              return {
                data,
              };
            },
            {
              query: detailGoodsIssueQueryParamSchema,
              response: {
                200: detailGoodsIssueDataSchema,
                401: apiErrorSchema,
                404: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Get Goods Issue Detail",
              },
            }
          )
      )
      .guard((innerApp) =>
        innerApp
          //* Create
          .post(
            "/create",
            async ({ body, userId, goodsIssueService }) => {
              const data = await goodsIssueService.create({ ...body, userId });

              return {
                data: data,
              };
            },
            {
              body: createGoodsIssueParamSchema,
              response: {
                200: detailGoodsIssueDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Create Goods Issue",
              },
            }
          )
          .delete(
            "/multiple-delete",
            async ({ body, goodsIssueService }) => {
              const data = await goodsIssueService.multipleDelete({ ...body });

              return {
                data: data,
              };
            },
            {
              body: multipleDeleteGoodsIssueParamSchema,
              response: {
                200: multipleDeleteGoodsIssueDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Multiple Delete Goods Issue",
              },
            }
          )
          .use(idValidatePlugin)
          //* Update
          .put(
            "/:id",
            async ({ idParams, body, userId, goodsIssueService }) => {
              const data = await goodsIssueService.update({
                ...body,
                userId,
                id: idParams,
              });

              return {
                data,
              };
            },
            {
              body: updateGoodsIssueParamSchema,
              response: {
                200: detailGoodsIssueDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Update Goods Issue",
              },
            }
          )
          //* Delete
          .delete(
            "/:id",
            async ({ idParams, goodsIssueService }) => {
              const res = await goodsIssueService.delete({ id: idParams });

              return { data: res };
            },
            {
              response: {
                200: deleteGoodsIssueDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Delete Goods Issue",
              },
            }
          )
      )
);
