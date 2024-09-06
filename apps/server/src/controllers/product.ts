import { Elysia } from "elysia";
import { ERROR_CODES } from "../config/enums";
import { apiErrorSchema } from "../models/base";
import {
  ProductData,
  createProductParamSchema,
  deleteProductDataSchema,
  detailProductDataSchema,
  listProductOffsetPaginationDataSchema,
  listProductPagePaginationDataSchema,
  listProductQuerySchema,
  multipleDeleteProductDataSchema,
  multipleDeleteProductParamSchema,
  productModel,
  updateProductParamSchema,
} from "../models/product";
import { ApiError } from "../utils/errors";
import {
  authenticatePlugin,
  idValidatePlugin,
  servicesPlugin,
} from "../utils/plugins";

export const productRoutes = new Elysia({
  name: "product-controller",
}).group(
  `api/products`,
  {
    detail: {
      tags: ["Product"],
    },
  },
  (app) =>
    app
      .use(servicesPlugin)
      .use(productModel)
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
          productService,
        }) => {
          const sortBy = sortByParams as keyof ProductData;
          const sortByList: (keyof ProductData)[] = [
            "name",
            "price",
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

          const res = await productService.getListPagePagination({
            sortBy: sortBy,
            sortOrder: sortOrder,
            limit: Number(limit),
            page: Number(page),
            ...rest,
          });

          return {
            data: res.products,
            meta: res.meta,
          };
        },
        {
          query: listProductQuerySchema,
          response: {
            200: listProductPagePaginationDataSchema,
            422: apiErrorSchema,
            500: apiErrorSchema,
          },
          detail: {
            summary: "Get Product List (page pagination)",
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
          productService,
        }) => {
          const sortBy = sortByParams as keyof ProductData;
          const sortByList: (keyof ProductData)[] = [
            "name",
            "price",
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

          const res = await productService.getListOffsetPagination({
            sortBy: sortBy,
            sortOrder: sortOrder,
            limit: Number(limit),
            offset: Number(offset),
            ...rest,
          });

          return {
            data: res.products,
            meta: res.meta,
          };
        },
        {
          query: listProductQuerySchema,
          response: {
            200: listProductOffsetPaginationDataSchema,
            422: apiErrorSchema,
            500: apiErrorSchema,
          },
          detail: {
            summary: "Get Product List (offset pagination)",
          },
        }
      )
      //* Get detail
      .guard((innerApp) =>
        innerApp.use(idValidatePlugin).get(
          "/:id",
          async ({ idParams, productService }) => {
            const data = await productService.getDetail({ id: idParams });

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
              200: detailProductDataSchema,
              401: apiErrorSchema,
              404: apiErrorSchema,
              422: apiErrorSchema,
              500: apiErrorSchema,
            },
            detail: {
              summary: "Get Product Detail",
            },
          }
        )
      )
      .guard((innerApp) =>
        innerApp
          .use(authenticatePlugin)
          //* Create
          .post(
            "/create",
            async ({ body, userId, productService }) => {
              const data = await productService.create({ ...body, userId });

              return {
                data: data,
              };
            },
            {
              body: createProductParamSchema,
              response: {
                200: detailProductDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Create Product",
              },
            }
          )
          .delete(
            "/multiple-delete",
            async ({ body, productService }) => {
              const data = await productService.multipleDelete({ ...body });

              return {
                data: data,
              };
            },
            {
              body: multipleDeleteProductParamSchema,
              response: {
                200: multipleDeleteProductDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Multiple Delete Product",
              },
            }
          )
          .use(idValidatePlugin)
          //* Update
          .put(
            "/:id",
            async ({ idParams, body, userId, productService }) => {
              const data = await productService.update({
                ...body,
                userId,
                id: idParams,
              });

              return {
                data,
              };
            },
            {
              body: updateProductParamSchema,
              response: {
                200: detailProductDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Update Product",
              },
            }
          )
          //* Delete
          .delete(
            "/:id",
            async ({ idParams, productService }) => {
              const res = await productService.delete({ id: idParams });

              return { data: res };
            },
            {
              response: {
                200: deleteProductDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Delete Product",
              },
            }
          )
      )
);
