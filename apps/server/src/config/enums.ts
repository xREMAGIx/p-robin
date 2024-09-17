export enum AUTH_TOKENS {
  ACCESS_TOKEN = "x-robin-access-token",
  REFRESH_TOKEN = "x-robin-refresh-token",
}

export enum ERROR_CODES {
  LOGIN_ERROR_INCORRECT_INFO = "LOGIN_ERROR_INCORRECT_INFO",
  UNAUTHORIZED_ERROR_NO_TOKEN = "UNAUTHORIZED_ERROR_NO_TOKEN",
  UNAUTHORIZED_ERROR_INVALID_TOKEN = "UNAUTHORIZED_ERROR_INVALID_TOKEN",
  UNAUTHORIZED_ERROR_INVALID_TOKEN_DATA = "UNAUTHORIZED_ERROR_INVALID_TOKEN_DATA",
  VALIDATE_ERROR_INVALID_ID = "VALIDATE_ERROR_INVALID_ID",
  VALIDATE_ERROR_INVALID_SORT_BY = "VALIDATE_ERROR_INVALID_SORT_BY",
  VALIDATE_ERROR_INVALID_SORT_ORDER = "VALIDATE_ERROR_INVALID_SORT_ORDER",
  NOT_FOUND_DATA = "NOT_FOUND_DATA",
}

export enum PRODUCT_STATUS {
  DRAFT = "draft",
  PUBLISHED = "published",
  END_OF_SERVICE = "endOfService",
}

export enum PRODUCT_STATUS_CODE {
  DRAFT = 0,
  PUBLISHED = 1,
  END_OF_SERVICE = 2,
}

export enum GOODS_RECEIPT_STATUS {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum GOODS_RECEIPT_STATUS_CODE {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
}

export enum GOODS_ISSUE_STATUS {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum GOODS_ISSUE_STATUS_CODE {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
}
