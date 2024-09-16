import { Elysia } from "elysia";
import { ERROR_CODES } from "../config/enums";
import { apiErrorSchema } from "../models/base";
import {
  InventoryData,
  createInventoryParamSchema,
  deleteInventoryDataSchema,
  detailInventoryDataSchema,
  inventoryModel,
  listInventoryOffsetPaginationDataSchema,
  listInventoryPagePaginationDataSchema,
  listInventoryQuerySchema,
  multipleDeleteInventoryDataSchema,
  multipleDeleteInventoryParamSchema,
  updateInventoryParamSchema,
} from "../models/inventory";
import { ApiError } from "../utils/errors";
import {
  authenticatePlugin,
  idValidatePlugin,
  servicesPlugin,
} from "../utils/plugins";

export const inventoryRoutes = new Elysia({
  name: "inventory-controller",
}).group(
  `api/inventorys`,
  {
    detail: {
      tags: ["Inventory"],
    },
  },
  (app) =>
    app
      .use(servicesPlugin)
      .use(inventoryModel)
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
          inventoryService,
        }) => {
          const sortBy = sortByParams as keyof InventoryData;
          const sortByList: (keyof InventoryData)[] = [
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

          const res = await inventoryService.getListPagePagination({
            sortBy: sortBy,
            sortOrder: sortOrder,
            limit: Number(limit),
            page: Number(page),
            ...rest,
          });

          return {
            data: res.inventorys,
            meta: res.meta,
          };
        },
        {
          query: listInventoryQuerySchema,
          response: {
            200: listInventoryPagePaginationDataSchema,
            422: apiErrorSchema,
            500: apiErrorSchema,
          },
          detail: {
            summary: "Get Inventory List (page pagination)",
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
          inventoryService,
        }) => {
          const sortBy = sortByParams as keyof InventoryData;
          const sortByList: (keyof InventoryData)[] = [
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

          const res = await inventoryService.getListOffsetPagination({
            sortBy: sortBy,
            sortOrder: sortOrder,
            limit: Number(limit),
            offset: Number(offset),
            ...rest,
          });

          return {
            data: res.inventorys,
            meta: res.meta,
          };
        },
        {
          query: listInventoryQuerySchema,
          response: {
            200: listInventoryOffsetPaginationDataSchema,
            422: apiErrorSchema,
            500: apiErrorSchema,
          },
          detail: {
            summary: "Get Inventory List (offset pagination)",
          },
        }
      )
      //* Get detail
      .guard((innerApp) =>
        innerApp.use(idValidatePlugin).get(
          "/:id",
          async ({ idParams, inventoryService }) => {
            const data = await inventoryService.getDetail({ id: idParams });

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
              200: detailInventoryDataSchema,
              401: apiErrorSchema,
              404: apiErrorSchema,
              422: apiErrorSchema,
              500: apiErrorSchema,
            },
            detail: {
              summary: "Get Inventory Detail",
            },
          }
        )
      )
      //* Create
      .guard((innerApp) =>
        innerApp
          .post(
            "/create",
            async ({ body, userId, inventoryService }) => {
              const data = await inventoryService.create({ ...body, userId });

              return {
                data: data,
              };
            },
            {
              body: createInventoryParamSchema,
              response: {
                200: detailInventoryDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Create Inventory",
              },
            }
          )
          .delete(
            "/multiple-delete",
            async ({ body, inventoryService }) => {
              const data = await inventoryService.multipleDelete({ ...body });

              return {
                data: data,
              };
            },
            {
              body: multipleDeleteInventoryParamSchema,
              response: {
                200: multipleDeleteInventoryDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Multiple Delete Inventory",
              },
            }
          )
          .use(idValidatePlugin)
          //* Update
          .put(
            "/:id",
            async ({ idParams, body, userId, inventoryService }) => {
              const data = await inventoryService.update({
                ...body,
                userId,
                id: idParams,
              });

              return {
                data,
              };
            },
            {
              body: updateInventoryParamSchema,
              response: {
                200: detailInventoryDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Update Inventory",
              },
            }
          )
          //* Delete
          .delete(
            "/:id",
            async ({ idParams, inventoryService }) => {
              const res = await inventoryService.delete({ id: idParams });

              return { data: res };
            },
            {
              response: {
                200: deleteInventoryDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Delete Inventory",
              },
            }
          )
      )
);
