import jwt from "@elysiajs/jwt";
import { Cookie } from "elysia";
import { AUTH_TOKENS } from "../config/enums";
import dayjs from "dayjs";

export class TokenCookieHandler {
  private cookie;

  constructor(cookie: Record<string, Cookie<string | undefined>>) {
    this.cookie = cookie;
  }

  async createNewTokenCookie(
    type: "ACCESS_TOKEN" | "REFRESH_TOKEN",
    jwtToken: ReturnType<typeof jwt>,
    userId: string
  ) {
    const { [AUTH_TOKENS[type]]: tokenCookie } = this.cookie;

    const newToken = await jwtToken.sign({
      id: userId,
      iat: dayjs().unix(),
      type: type,
    });

    tokenCookie.set({
      value: newToken,
      maxAge: 86400,
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });
  }
}
