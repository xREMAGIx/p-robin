type ListParams = {
  page?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
};

export const authQueryKeys = {
  all: ["auth"] as const,
  profile: () => [...authQueryKeys.all, "profile"] as const,
};

export const productQueryKeys = {
  all: ["product"] as const,
  lists: () => [...productQueryKeys.all, "list"] as const,
  list: ({ page, search, sortBy, sortOrder }: ListParams) =>
    [...productQueryKeys.lists(), { page, search, sortBy, sortOrder }] as const,
  details: () => [...productQueryKeys.all, "detail"] as const,
  detail: (id: string | number) => [...productQueryKeys.details(), id] as const,
  creates: () => [...productQueryKeys.all, "create"] as const,
  create: () => [...productQueryKeys.creates()] as const,
  updates: () => [...productQueryKeys.all, "update"] as const,
  update: (id: string | number) => [...productQueryKeys.updates(), id] as const,
  deletes: () => [...productQueryKeys.all, "delete"] as const,
  delete: () => [...productQueryKeys.deletes()] as const,
};

export const provinceQueryKeys = {
  all: ["province"] as const,
  lists: () => [...provinceQueryKeys.all, "list"] as const,
  list: ({ page, search, sortBy, sortOrder }: ListParams) =>
    [
      ...provinceQueryKeys.lists(),
      { page, search, sortBy, sortOrder },
    ] as const,
  details: () => [...provinceQueryKeys.all, "detail"] as const,
  detail: (id: string | number) =>
    [...provinceQueryKeys.details(), id] as const,
  creates: () => [...provinceQueryKeys.all, "create"] as const,
  create: () => [...provinceQueryKeys.creates()] as const,
  updates: () => [...provinceQueryKeys.all, "update"] as const,
  update: (id: string | number) =>
    [...provinceQueryKeys.updates(), id] as const,
  deletes: () => [...provinceQueryKeys.all, "delete"] as const,
  delete: () => [...provinceQueryKeys.deletes()] as const,
};

export const districtQueryKeys = {
  all: ["district"] as const,
  lists: () => [...districtQueryKeys.all, "list"] as const,
  list: ({ page, search, sortBy, sortOrder }: ListParams) =>
    [
      ...districtQueryKeys.lists(),
      { page, search, sortBy, sortOrder },
    ] as const,
  details: () => [...districtQueryKeys.all, "detail"] as const,
  detail: (id: string | number) =>
    [...districtQueryKeys.details(), id] as const,
  creates: () => [...districtQueryKeys.all, "create"] as const,
  create: () => [...districtQueryKeys.creates()] as const,
  updates: () => [...districtQueryKeys.all, "update"] as const,
  update: (id: string | number) =>
    [...districtQueryKeys.updates(), id] as const,
  deletes: () => [...districtQueryKeys.all, "delete"] as const,
  delete: () => [...districtQueryKeys.deletes()] as const,
};

export const wardQueryKeys = {
  all: ["ward"] as const,
  lists: () => [...wardQueryKeys.all, "list"] as const,
  list: ({ page, search, sortBy, sortOrder }: ListParams) =>
    [...wardQueryKeys.lists(), { page, search, sortBy, sortOrder }] as const,
  details: () => [...wardQueryKeys.all, "detail"] as const,
  detail: (id: string | number) => [...wardQueryKeys.details(), id] as const,
  creates: () => [...wardQueryKeys.all, "create"] as const,
  create: () => [...wardQueryKeys.creates()] as const,
  updates: () => [...wardQueryKeys.all, "update"] as const,
  update: (id: string | number) => [...wardQueryKeys.updates(), id] as const,
  deletes: () => [...wardQueryKeys.all, "delete"] as const,
  delete: () => [...wardQueryKeys.deletes()] as const,
};

export const warehouseQueryKeys = {
  all: ["warehouse"] as const,
  lists: () => [...warehouseQueryKeys.all, "list"] as const,
  list: ({ page, search, sortBy, sortOrder }: ListParams) =>
    [
      ...warehouseQueryKeys.lists(),
      { page, search, sortBy, sortOrder },
    ] as const,
  details: () => [...warehouseQueryKeys.all, "detail"] as const,
  detail: (id: string | number) =>
    [...warehouseQueryKeys.details(), id] as const,
  creates: () => [...warehouseQueryKeys.all, "create"] as const,
  create: () => [...warehouseQueryKeys.creates()] as const,
  updates: () => [...warehouseQueryKeys.all, "update"] as const,
  update: (id: string | number) =>
    [...warehouseQueryKeys.updates(), id] as const,
  deletes: () => [...warehouseQueryKeys.all, "delete"] as const,
  delete: () => [...warehouseQueryKeys.deletes()] as const,
};
