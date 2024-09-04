import { server } from "@cms/config/server";
import { useBoundStore } from "@cms/stores/useBoundStore";
import { useState } from "react";

export default function useHandleError() {
  const { clearAuthProfile } = useBoundStore();

  const [isLoadingHandleError, setIsLoadingHandleError] = useState(false);

  const handleInvalidError = async (error: {
    status: unknown;
    value: unknown;
  }) => {
    const err = error.value as ApiError;

    if (err.code === "UNAUTHORIZED_ERROR_INVALID_TOKEN") {
      setIsLoadingHandleError(true);
      const { error: refreshError } = await server.api.auth[
        "refresh-token"
      ].post();

      if (refreshError) {
        setIsLoadingHandleError(false);
        clearAuthProfile();
        return { isError: true };
      }

      return { isError: false };
    }

    return { isError: true };
  };

  return { isLoadingHandleError, handleInvalidError };
}
