type ListParams = {
  search?: string;
  limit?: number;
  page?: number;
  offset?: number;
  includes?: string;
};

type DetailParams = {
  id: string | number;
  includes?: string;
};

type ApiError = {
  code: string;
  detail: string;
};
