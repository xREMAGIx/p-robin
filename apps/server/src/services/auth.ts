import { eq } from "drizzle-orm";
import { DBType } from "../config/database";
import { ERROR_CODES } from "../config/enums";
import { userTable } from "../db-schema";
import {
  GetProfileParams,
  LoginParams,
  RegisterParams,
  UserData,
} from "../models/auth";
import { ApiError } from "../utils/errors";

export default class AuthService {
  private db;

  constructor(db: DBType) {
    this.db = db;
  }

  async login(params: LoginParams) {
    const { username, password } = params;

    const result = await this.db.query.userTable.findFirst({
      where: eq(userTable.username, username),
    });

    if (!result) {
      throw new ApiError({
        status: "422",
        errorCode: ERROR_CODES.LOGIN_ERROR_INCORRECT_INFO,
        title: ERROR_CODES.LOGIN_ERROR_INCORRECT_INFO,
        messageCode: "login_info_incorrect",
      });
    }

    const isMatchPassword = await Bun.password.verify(
      password,
      result.password
    );

    if (!isMatchPassword) {
      throw new ApiError({
        status: "422",
        errorCode: ERROR_CODES.LOGIN_ERROR_INCORRECT_INFO,
        title: ERROR_CODES.LOGIN_ERROR_INCORRECT_INFO,
        messageCode: "login_info_incorrect",
      });
    }

    const data = { ...result } as WithOptional<UserData, "password">;

    delete data.password;

    return data;
  }

  async register(params: RegisterParams) {
    const { email, password, username } = params;

    const bcryptHash = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: Number(process.env.PASSWORD_HASH_CODE ?? 4),
    });

    const results = await this.db
      .insert(userTable)
      .values({
        username: username,
        email: email,
        password: bcryptHash,
      })
      .returning();

    const data = { ...results[0] } as WithOptional<UserData, "password">;

    delete data.password;

    return data;
  }

  async getProfile(params: GetProfileParams) {
    const { userId } = params;

    const result = await this.db.query.userTable.findFirst({
      where: eq(userTable.id, userId),
    });

    const data = { ...result } as WithOptional<UserData, "password">;

    delete data.password;

    return data;
  }
}
