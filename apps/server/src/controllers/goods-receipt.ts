import { Elysia } from "elysia";
import { ERROR_CODES } from "../config/enums";
import { apiErrorSchema } from "../models/base";
import {
  GoodsReceiptData,
  createGoodsReceiptParamSchema,
  deleteGoodsReceiptDataSchema,
  detailGoodsReceiptDataSchema,
  goodsReceiptModel,
  listGoodsReceiptOffsetPaginationDataSchema,
  listGoodsReceiptPagePaginationDataSchema,
  listGoodsReceiptQuerySchema,
  multipleDeleteGoodsReceiptDataSchema,
  multipleDeleteGoodsReceiptParamSchema,
  updateGoodsReceiptParamSchema,
} from "../models/goods-receipt";
import { ApiError } from "../utils/errors";
import {
  authenticatePlugin,
  idValidatePlugin,
  servicesPlugin,
} from "../utils/plugins";

export const goodsReceiptRoutes = new Elysia({
  name: "goods-receipt-controller",
}).group(
  `api/goods-receipts`,
  {
    detail: {
      tags: ["Goods Receipt"],
    },
  },
  (app) =>
    app
      .use(servicesPlugin)
      .use(goodsReceiptModel)
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
          goodsReceiptService,
        }) => {
          const sortBy = sortByParams as keyof GoodsReceiptData;
          const sortByList: (keyof GoodsReceiptData)[] = [
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

          const res = await goodsReceiptService.getListPagePagination({
            sortBy: sortBy,
            sortOrder: sortOrder,
            limit: Number(limit),
            page: Number(page),
            ...rest,
          });

          return {
            data: res.goodsReceipts,
            meta: res.meta,
          };
        },
        {
          query: listGoodsReceiptQuerySchema,
          response: {
            200: listGoodsReceiptPagePaginationDataSchema,
            422: apiErrorSchema,
            500: apiErrorSchema,
          },
          detail: {
            summary: "Get Goods Receipt List (page pagination)",
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
          goodsReceiptService,
        }) => {
          const sortBy = sortByParams as keyof GoodsReceiptData;
          const sortByList: (keyof GoodsReceiptData)[] = [
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

          const res = await goodsReceiptService.getListOffsetPagination({
            sortBy: sortBy,
            sortOrder: sortOrder,
            limit: Number(limit),
            offset: Number(offset),
            ...rest,
          });

          return {
            data: res.goodsReceipts,
            meta: res.meta,
          };
        },
        {
          query: listGoodsReceiptQuerySchema,
          response: {
            200: listGoodsReceiptOffsetPaginationDataSchema,
            422: apiErrorSchema,
            500: apiErrorSchema,
          },
          detail: {
            summary: "Get Goods Receipt List (offset pagination)",
          },
        }
      )
      //* Get detail
      .guard((innerApp) =>
        innerApp.use(idValidatePlugin).get(
          "/:id",
          async ({ idParams, goodsReceiptService, query: { ...queries } }) => {
            const data = await goodsReceiptService.getDetail({
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
            response: {
              200: detailGoodsReceiptDataSchema,
              401: apiErrorSchema,
              404: apiErrorSchema,
              422: apiErrorSchema,
              500: apiErrorSchema,
            },
            detail: {
              summary: "Get Goods Receipt Detail",
            },
          }
        )
      )
      //* Create
      .guard((innerApp) =>
        innerApp
          .use(authenticatePlugin)
          .post(
            "/create",
            async ({ body, userId, goodsReceiptService }) => {
              const data = await goodsReceiptService.create({
                ...body,
                userId,
              });

              return {
                data,
              };
            },
            {
              body: createGoodsReceiptParamSchema,
              response: {
                200: detailGoodsReceiptDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Create Goods Receipt",
              },
            }
          )
          .delete(
            "/multiple-delete",
            async ({ body, goodsReceiptService }) => {
              const data = await goodsReceiptService.multipleDelete({
                ...body,
              });

              return {
                data: data,
              };
            },
            {
              body: multipleDeleteGoodsReceiptParamSchema,
              response: {
                200: multipleDeleteGoodsReceiptDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Multiple Delete Goods Receipt",
              },
            }
          )
          .use(idValidatePlugin)
          //* Update
          .put(
            "/:id",
            async ({ idParams, body, userId, goodsReceiptService }) => {
              const data = await goodsReceiptService.update({
                ...body,
                userId,
                id: idParams,
              });

              return {
                data,
              };
            },
            {
              body: updateGoodsReceiptParamSchema,
              response: {
                200: detailGoodsReceiptDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Update Goods Receipt",
              },
            }
          )
          //* Delete
          .delete(
            "/:id",
            async ({ idParams, goodsReceiptService }) => {
              const res = await goodsReceiptService.delete({ id: idParams });

              return { data: res };
            },
            {
              response: {
                200: deleteGoodsReceiptDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Delete Goods Receipt",
              },
            }
          )
      )
);
