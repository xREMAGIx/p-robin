import { Elysia } from "elysia";
import { ERROR_CODES } from "../config/enums";
import { apiErrorSchema } from "../models/base";
import {
  WarehouseData,
  createWarehouseParamSchema,
  deleteWarehouseDataSchema,
  detailWarehouseDataSchema,
  listWarehouseOffsetPaginationDataSchema,
  listWarehousePagePaginationDataSchema,
  listWarehouseQuerySchema,
  multipleDeleteWarehouseDataSchema,
  multipleDeleteWarehouseParamSchema,
  warehouseModel,
  updateWarehouseParamSchema,
} from "../models/warehouse";
import { ApiError } from "../utils/errors";
import {
  authenticatePlugin,
  idValidatePlugin,
  servicesPlugin,
} from "../utils/plugins";

export const warehouseRoutes = new Elysia({
  name: "warehouse-controller",
}).group(
  `api/warehouses`,
  {
    detail: {
      tags: ["Warehouse"],
    },
  },
  (app) =>
    app
      .use(servicesPlugin)
      .use(warehouseModel)
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
          warehouseService,
        }) => {
          const sortBy = sortByParams as keyof WarehouseData;
          const sortByList: (keyof WarehouseData)[] = [
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

          const res = await warehouseService.getListPagePagination({
            sortBy: sortBy,
            sortOrder: sortOrder,
            limit: Number(limit),
            page: Number(page),
            ...rest,
          });

          return {
            data: res.warehouses,
            meta: res.meta,
          };
        },
        {
          query: listWarehouseQuerySchema,
          response: {
            200: listWarehousePagePaginationDataSchema,
            422: apiErrorSchema,
            500: apiErrorSchema,
          },
          detail: {
            summary: "Get Warehouse List (page pagination)",
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
          warehouseService,
        }) => {
          const sortBy = sortByParams as keyof WarehouseData;
          const sortByList: (keyof WarehouseData)[] = [
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

          const res = await warehouseService.getListOffsetPagination({
            sortBy: sortBy,
            sortOrder: sortOrder,
            limit: Number(limit),
            offset: Number(offset),
            ...rest,
          });

          return {
            data: res.warehouses,
            meta: res.meta,
          };
        },
        {
          query: listWarehouseQuerySchema,
          response: {
            200: listWarehouseOffsetPaginationDataSchema,
            422: apiErrorSchema,
            500: apiErrorSchema,
          },
          detail: {
            summary: "Get Warehouse List (offset pagination)",
          },
        }
      )
      //* Get detail
      .guard((innerApp) =>
        innerApp.use(idValidatePlugin).get(
          "/:id",
          async ({ idParams, warehouseService }) => {
            const data = await warehouseService.getDetail({ id: idParams });

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
              200: detailWarehouseDataSchema,
              401: apiErrorSchema,
              404: apiErrorSchema,
              422: apiErrorSchema,
              500: apiErrorSchema,
            },
            detail: {
              summary: "Get Warehouse Detail",
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
            async ({ body, userId, warehouseService }) => {
              const data = await warehouseService.create({ ...body, userId });

              return {
                data: data,
              };
            },
            {
              body: createWarehouseParamSchema,
              response: {
                200: detailWarehouseDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Create Warehouse",
              },
            }
          )
          .delete(
            "/multiple-delete",
            async ({ body, warehouseService }) => {
              const data = await warehouseService.multipleDelete({ ...body });

              return {
                data: data,
              };
            },
            {
              body: multipleDeleteWarehouseParamSchema,
              response: {
                200: multipleDeleteWarehouseDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Multiple Delete Warehouse",
              },
            }
          )
          .use(idValidatePlugin)
          //* Update
          .put(
            "/:id",
            async ({ idParams, body, userId, warehouseService }) => {
              const data = await warehouseService.update({
                ...body,
                userId,
                id: idParams,
              });

              return {
                data,
              };
            },
            {
              body: updateWarehouseParamSchema,
              response: {
                200: detailWarehouseDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Update Warehouse",
              },
            }
          )
          //* Delete
          .delete(
            "/:id",
            async ({ idParams, warehouseService }) => {
              const res = await warehouseService.delete({ id: idParams });

              return { data: res };
            },
            {
              response: {
                200: deleteWarehouseDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Delete Warehouse",
              },
            }
          )
      )
);
