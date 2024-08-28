type ListParams = {
  page?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
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

export const authQueryKeys = {
  all: ["auth"] as const,
  profile: () => [...authQueryKeys.all, "profile"] as const,
};
