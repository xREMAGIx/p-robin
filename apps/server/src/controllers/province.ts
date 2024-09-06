import { Elysia } from "elysia";
import { ERROR_CODES } from "../config/enums";
import { apiErrorSchema } from "../models/base";
import {
  ProvinceData,
  createProvinceParamSchema,
  deleteProvinceDataSchema,
  detailProvinceDataSchema,
  listProvinceOffsetPaginationDataSchema,
  listProvincePagePaginationDataSchema,
  listProvinceQuerySchema,
  multipleDeleteProvinceDataSchema,
  multipleDeleteProvinceParamSchema,
  provinceModel,
  updateProvinceParamSchema,
} from "../models/province";
import { ApiError } from "../utils/errors";
import {
  authenticatePlugin,
  idValidatePlugin,
  servicesPlugin,
} from "../utils/plugins";

export const provinceRoutes = new Elysia({
  name: "province-controller",
}).group(
  `api/provinces`,
  {
    detail: {
      tags: ["Province"],
    },
  },
  (app) =>
    app
      .use(servicesPlugin)
      .use(provinceModel)
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
          provinceService,
        }) => {
          const sortBy = sortByParams as keyof ProvinceData;
          const sortByList: (keyof ProvinceData)[] = [
            "name",
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

          const res = await provinceService.getListPagePagination({
            sortBy: sortBy,
            sortOrder: sortOrder,
            limit: Number(limit),
            page: Number(page),
            ...rest,
          });

          return {
            data: res.provinces,
            meta: res.meta,
          };
        },
        {
          query: listProvinceQuerySchema,
          response: {
            200: listProvincePagePaginationDataSchema,
            422: apiErrorSchema,
            500: apiErrorSchema,
          },
          detail: {
            summary: "Get Province List (page pagination)",
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
          provinceService,
        }) => {
          const sortBy = sortByParams as keyof ProvinceData;
          const sortByList: (keyof ProvinceData)[] = [
            "name",
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

          const res = await provinceService.getListOffsetPagination({
            sortBy: sortBy,
            sortOrder: sortOrder,
            limit: Number(limit),
            offset: Number(offset),
            ...rest,
          });

          return {
            data: res.provinces,
            meta: res.meta,
          };
        },
        {
          query: listProvinceQuerySchema,
          response: {
            200: listProvinceOffsetPaginationDataSchema,
            422: apiErrorSchema,
            500: apiErrorSchema,
          },
          detail: {
            summary: "Get Province List (offset pagination)",
          },
        }
      )
      .guard((innerApp) =>
        innerApp
          .use(idValidatePlugin)
          //* Get detail
          .get(
            "/:id",
            async ({ idParams, provinceService }) => {
              const data = await provinceService.getDetail({ id: idParams });

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
                200: detailProvinceDataSchema,
                401: apiErrorSchema,
                404: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Get Province Detail",
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
            async ({ body, userId, provinceService }) => {
              const data = await provinceService.create({ ...body, userId });

              return {
                data: data,
              };
            },
            {
              body: createProvinceParamSchema,
              response: {
                200: detailProvinceDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Create Province",
              },
            }
          )
          .delete(
            "/multiple-delete",
            async ({ body, provinceService }) => {
              const data = await provinceService.multipleDelete({ ...body });

              return {
                data: data,
              };
            },
            {
              body: multipleDeleteProvinceParamSchema,
              response: {
                200: multipleDeleteProvinceDataSchema,
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
            async ({ idParams, body, userId, provinceService }) => {
              const data = await provinceService.update({
                ...body,
                userId,
                id: idParams,
              });

              return {
                data,
              };
            },
            {
              body: updateProvinceParamSchema,
              response: {
                200: detailProvinceDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Update Province",
              },
            }
          )
          //* Delete
          .delete(
            "/:id",
            async ({ idParams, provinceService }) => {
              const res = await provinceService.delete({ id: idParams });

              return { data: res };
            },
            {
              response: {
                200: deleteProvinceDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Delete Province",
              },
            }
          )
      )
);
