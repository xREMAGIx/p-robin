// store/fetcher.ts
import { nanoquery } from "@nanostores/query";

export const [, , { invalidateKeys, revalidateKeys, mutateCache }] =
  nanoquery();

export const [createFetcherStore, createMutatorStore] = nanoquery();
