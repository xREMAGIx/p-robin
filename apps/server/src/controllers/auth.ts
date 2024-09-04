import { Elysia } from "elysia";
import { AUTH_TOKENS, ERROR_CODES } from "../config/enums";
import {
  authModel,
  loginDataSchema,
  loginParamsSchema,
  refreshTokenDataSchema,
  registerDataSchema,
  registerParamsSchema,
} from "../models/auth";
import { apiErrorSchema } from "../models/base";
import { ApiError } from "../utils/errors";
import {
  authenticatePlugin,
  cookiePlugin,
  servicesPlugin,
  tokenPlugin,
} from "../utils/plugins";

export const authRoutes = new Elysia({
  name: "auth-controller",
}).group(
  `api/auth`,
  {
    detail: {
      tags: ["Auth"],
    },
  },
  (app) =>
    app
      .use(tokenPlugin)
      .use(cookiePlugin)
      .use(servicesPlugin)
      .use(authModel)
      //* Login
      .post(
        "/login",
        async ({
          body,
          accessJwt,
          refreshJwt,
          authService,
          tokenCookieHandler,
        }) => {
          const { username, password } = body;

          const user = await authService.login({
            username,
            password,
          });

          await tokenCookieHandler.createNewTokenCookie(
            "ACCESS_TOKEN",
            accessJwt,
            user.id.toString()
          );

          await tokenCookieHandler.createNewTokenCookie(
            "REFRESH_TOKEN",
            refreshJwt,
            user.id.toString()
          );

          return {
            data: user,
          };
        },
        {
          body: loginParamsSchema,
          response: {
            200: loginDataSchema,
            422: apiErrorSchema,
            500: apiErrorSchema,
          },
          detail: {
            summary: "Login",
          },
        }
      )
      //*Register
      .post(
        "/register",
        async ({ body, authService }) => {
          const { username, email, password } = body;
          const user = await authService.register({
            username,
            email,
            password,
          });

          return {
            data: user,
          };
        },
        {
          body: registerParamsSchema,
          response: {
            200: registerDataSchema,
            401: apiErrorSchema,
            422: apiErrorSchema,
            500: apiErrorSchema,
          },
          detail: {
            summary: "Register",
          },
        }
      )
      //* Refresh-token
      .post(
        "/refresh-token",
        async ({
          accessJwt,
          refreshJwt,
          cookie: { [AUTH_TOKENS.REFRESH_TOKEN]: refreshToken },
          tokenCookieHandler,
        }) => {
          const refreshData = await refreshJwt.verify(refreshToken.value);

          if (!refreshData) {
            throw new ApiError({
              status: "401",
              errorCode: ERROR_CODES.UNAUTHORIZED_ERROR_INVALID_TOKEN,
              title: ERROR_CODES.UNAUTHORIZED_ERROR_INVALID_TOKEN,
              messageCode: "invalid_token",
            });
          }

          if (!refreshData["id"]) {
            throw new ApiError({
              status: "401",
              errorCode: ERROR_CODES.UNAUTHORIZED_ERROR_INVALID_TOKEN_DATA,
              title: ERROR_CODES.UNAUTHORIZED_ERROR_INVALID_TOKEN_DATA,
              messageCode: "invalid_auth_data",
            });
          }

          await tokenCookieHandler.createNewTokenCookie(
            "ACCESS_TOKEN",
            accessJwt,
            Number(refreshData["id"]).toString()
          );

          await tokenCookieHandler.createNewTokenCookie(
            "REFRESH_TOKEN",
            refreshJwt,
            Number(refreshData["id"]).toString()
          );

          return {
            data: null,
          };
        },
        {
          response: {
            200: refreshTokenDataSchema,
            401: apiErrorSchema,
            500: apiErrorSchema,
          },
          detail: {
            summary: "Refresh Token",
          },
        }
      )
      //* Profile
      .use(authenticatePlugin)
      .get(
        "/profile",
        async ({ authService, userId }) => {
          const user = await authService.getProfile({
            userId,
          });

          return user;
        },
        {
          detail: {
            summary: "Profile",
          },
        }
      )
      //* Logout
      .post(
        "/logout",
        ({ cookie: { [AUTH_TOKENS.ACCESS_TOKEN]: accessToken } }) => {
          accessToken.set({
            value: "",
            maxAge: 0,
            secure: true,
            httpOnly: true,
            sameSite: "none",
          });
          return "Delete cookie!!!";
        },
        {
          detail: {
            summary: "Logout",
          },
        }
      )
);
