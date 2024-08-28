// useLazyStore.ts

import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import type { ReadableAtom, WritableAtom } from "nanostores";

function useLazyStore<T>(
  $atom: ReadableAtom<T> | WritableAtom<T>,
  initial: T
): {
  data: T;
  isInit: boolean;
} {
  const atomValue = useStore($atom);
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    setIsInit(true);
  }, []);

  return {
    data: isInit ? atomValue : initial,
    isInit: isInit,
  };
}

export default useLazyStore;
