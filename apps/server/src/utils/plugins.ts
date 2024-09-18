import { jwt } from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import { db } from "../config/database";
import { AUTH_TOKENS, ERROR_CODES } from "../config/enums";
import { queryPaginationModel } from "../models/base";
import AuthService from "../services/auth";
import DistrictService from "../services/district";
import GoodsIssueService from "../services/goods-issue";
import GoodsReceiptService from "../services/goods-receipt";
import InventoryService from "../services/inventory";
import ProductService from "../services/product";
import ProvinceService from "../services/province";
import WardService from "../services/ward";
import WarehouseService from "../services/warehouse";
import { TokenCookieHandler } from "./cookies";
import * as HTTPError from "./errors";
import { i18next } from "./translate";

export const tokenPlugin = new Elysia({ name: "token-plugin" })
  .use(
    jwt({
      name: "accessJwt",
      secret: process.env.JWT_SECRET ?? "iamasecret",
      exp: process.env.JWT_ACCESS_EXPIRATION ?? "1h",
    })
  )
  .use(
    jwt({
      name: "refreshJwt",
      secret: process.env.JWT_SECRET ?? "iamasecret",
      exp: process.env.JWT_REFRESH_EXPIRATION ?? "30d",
    })
  );

export const cookiePlugin = new Elysia({
  name: "token-cookie-plugin",
}).derive({ as: "scoped" }, ({ cookie }) => {
  return {
    tokenCookieHandler: new TokenCookieHandler(cookie),
  };
});

export const translatePlugin = new Elysia({ name: "translate-plugin" }).use(
  i18next()
);

export const authenticatePlugin = new Elysia({ name: "authenticate-plugin" })
  .use(tokenPlugin)
  .onBeforeHandle(
    { as: "scoped" },
    ({ cookie: { [AUTH_TOKENS.ACCESS_TOKEN]: accessToken } }) => {
      if (!accessToken.value) {
        throw new HTTPError.ApiError({
          status: "401",
          errorCode: ERROR_CODES.UNAUTHORIZED_ERROR_NO_TOKEN,
          title: ERROR_CODES.UNAUTHORIZED_ERROR_NO_TOKEN,
          messageCode: "no_token",
        });
      }
    }
  )
  .resolve(
    { as: "scoped" },
    async ({
      cookie: { [AUTH_TOKENS.ACCESS_TOKEN]: accessToken },
      accessJwt,
    }) => {
      const data = await accessJwt.verify(accessToken.value);

      if (!data) {
        throw new HTTPError.ApiError({
          status: "401",
          errorCode: ERROR_CODES.UNAUTHORIZED_ERROR_INVALID_TOKEN,
          title: ERROR_CODES.UNAUTHORIZED_ERROR_INVALID_TOKEN,
          messageCode: "invalid_token",
        });
      }

      if (!data["id"]) {
        throw new HTTPError.ApiError({
          status: "401",
          errorCode: ERROR_CODES.UNAUTHORIZED_ERROR_INVALID_TOKEN_DATA,
          title: ERROR_CODES.UNAUTHORIZED_ERROR_INVALID_TOKEN_DATA,
          messageCode: "invalid_auth_data",
        });
      }

      return {
        userId: Number(data["id"]),
      };
    }
  );

export const errorPlugin = new Elysia({ name: "error-plugin" })
  .use(translatePlugin)
  .error({
    ...HTTPError,
  })
  .onError({ as: "scoped" }, ({ code, error, set, translate }) => {
    switch (code) {
      case "ApiError": {
        set.status = parseInt(error.status, 10);

        return {
          errors: [
            {
              status: error.status,
              errorCode: error.errorCode,
              title: error.title,
              detail: translate
                ? translate(error.messageCode, { ns: "error" })
                : error.detail,
            },
          ],
        };
      }
      case "NOT_FOUND": {
        break;
      }
      case "INTERNAL_SERVER_ERROR":
      default:
        console.log(error.message);

        if (error.name === "PostgresError") {
          set.status = 400;

          return {
            errors: [
              {
                status: "400",
                code: "BAD_REQUEST",
                title: "BAD_REQUEST",
                detail: translate
                  ? translate("bad_request", { ns: "error" })
                  : "Bad request",
              },
            ],
          };
        }

        set.status = 500;

        return {
          errors: [
            {
              status: "500",
              code: "INTERNAL_SERVER_ERROR",
              title: "INTERNAL_SERVER_ERROR",
              detail: translate
                ? translate("internal_server", { ns: "error" })
                : "Internal Server",
            },
          ],
        };
    }
  });

export const queryPaginationPlugin = new Elysia({ name: "query-pagination" })
  .use(queryPaginationModel)
  .guard({
    query: "page.pagination.query",
  });

export const idValidatePlugin = new Elysia({
  name: "id-validate",
})
  .guard({
    as: "scoped",
    params: t.Object({
      id: t.Optional(
        t.Numeric({
          error: () => {
            throw new HTTPError.ApiError({
              status: "422",
              errorCode: ERROR_CODES.VALIDATE_ERROR_INVALID_ID,
              title: ERROR_CODES.VALIDATE_ERROR_INVALID_ID,
              messageCode: "invalid_id",
            });
          },
        })
      ),
    }),
    beforeHandle: ({ params }) => {
      const { id } = params;
      if (!id || +id < 1) {
        throw new HTTPError.ApiError({
          status: "422",
          errorCode: ERROR_CODES.VALIDATE_ERROR_INVALID_ID,
          title: ERROR_CODES.VALIDATE_ERROR_INVALID_ID,
          messageCode: "invalid_id",
        });
      }
    },
  })
  .resolve({ as: "scoped" }, ({ params }) => {
    return {
      idParams: Number(params.id),
    };
  });

export const databasePlugin = new Elysia({ name: "connect-db" }).decorate(
  "db",
  db
);

export const servicesPlugin = new Elysia({ name: "services-plugin" })
  .use(databasePlugin)
  .derive({ as: "scoped" }, ({ db }) => {
    return {
      authService: new AuthService(db),
      productService: new ProductService(db),
      provinceService: new ProvinceService(db),
      districtService: new DistrictService(db),
      wardService: new WardService(db),
      warehouseService: new WarehouseService(db),
      inventoryService: new InventoryService(db),
      goodsReceiptService: new GoodsReceiptService(db),
      goodsIssueService: new GoodsIssueService(db),
    };
  });
