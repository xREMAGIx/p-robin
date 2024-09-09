import { Elysia } from "elysia";
import { ERROR_CODES } from "../config/enums";
import { apiErrorSchema } from "../models/base";
import {
  WardData,
  createWardParamSchema,
  deleteWardDataSchema,
  detailWardDataSchema,
  listWardOffsetPaginationDataSchema,
  listWardPagePaginationDataSchema,
  listWardQuerySchema,
  multipleDeleteWardDataSchema,
  multipleDeleteWardParamSchema,
  updateWardParamSchema,
  wardModel,
} from "../models/ward";
import { ApiError } from "../utils/errors";
import {
  authenticatePlugin,
  idValidatePlugin,
  servicesPlugin,
} from "../utils/plugins";

export const wardRoutes = new Elysia({
  name: "ward-controller",
}).group(
  `api/wards`,
  {
    detail: {
      tags: ["Ward"],
    },
  },
  (app) =>
    app
      .use(servicesPlugin)
      .use(wardModel)
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
          wardService,
        }) => {
          const sortBy = sortByParams as keyof WardData;
          const sortByList: (keyof WardData)[] = [
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

          const res = await wardService.getListPagePagination({
            sortBy: sortBy,
            sortOrder: sortOrder,
            limit: Number(limit),
            page: Number(page),
            ...rest,
          });

          return {
            data: res.wards,
            meta: res.meta,
          };
        },
        {
          query: listWardQuerySchema,
          response: {
            200: listWardPagePaginationDataSchema,
            422: apiErrorSchema,
            500: apiErrorSchema,
          },
          detail: {
            summary: "Get Ward List (page pagination)",
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
          wardService,
        }) => {
          const sortBy = sortByParams as keyof WardData;
          const sortByList: (keyof WardData)[] = [
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

          const res = await wardService.getListOffsetPagination({
            sortBy: sortBy,
            sortOrder: sortOrder,
            limit: Number(limit),
            offset: Number(offset),
            ...rest,
          });

          return {
            data: res.wards,
            meta: res.meta,
          };
        },
        {
          query: listWardQuerySchema,
          response: {
            200: listWardOffsetPaginationDataSchema,
            422: apiErrorSchema,
            500: apiErrorSchema,
          },
          detail: {
            summary: "Get Ward List (offset pagination)",
          },
        }
      )
      //* Detail
      .guard((innerApp) =>
        innerApp.use(idValidatePlugin).get(
          "/:id",
          async ({ idParams, wardService, query: { ...queries } }) => {
            const data = await wardService.getDetail({
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
              200: detailWardDataSchema,
              401: apiErrorSchema,
              404: apiErrorSchema,
              422: apiErrorSchema,
              500: apiErrorSchema,
            },
            detail: {
              summary: "Get Ward Detail",
            },
          }
        )
      )
      //* With authorized
      .guard((innerApp) =>
        innerApp
          .use(authenticatePlugin)
          //* Create
          .post(
            "/create",
            async ({ body, userId, wardService }) => {
              const data = await wardService.create({ ...body, userId });

              return {
                data: data,
              };
            },
            {
              body: createWardParamSchema,
              response: {
                200: detailWardDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Create Ward",
              },
            }
          )
          //* Multiple delete
          .delete(
            "/multiple-delete",
            async ({ body, wardService }) => {
              const data = await wardService.multipleDelete({ ...body });

              return {
                data: data,
              };
            },
            {
              body: multipleDeleteWardParamSchema,
              response: {
                200: multipleDeleteWardDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Multiple Delete Ward",
              },
            }
          )
          .use(idValidatePlugin)
          //* Update
          .put(
            "/:id",
            async ({ idParams, body, userId, wardService }) => {
              const data = await wardService.update({
                ...body,
                userId,
                id: idParams,
              });

              return {
                data,
              };
            },
            {
              body: updateWardParamSchema,
              response: {
                200: detailWardDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Update Ward",
              },
            }
          )
          //* Delete
          .delete(
            "/:id",
            async ({ idParams, wardService }) => {
              const res = await wardService.delete({ id: idParams });

              return { data: res };
            },
            {
              response: {
                200: deleteWardDataSchema,
                401: apiErrorSchema,
                422: apiErrorSchema,
                500: apiErrorSchema,
              },
              detail: {
                summary: "Delete Ward",
              },
            }
          )
      )
);
