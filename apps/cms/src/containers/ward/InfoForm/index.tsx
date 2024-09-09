import { ComboBox } from "@cms/components/ComboBox";
import { FORM_VALIDATION_MESSAGE_CODE } from "@cms/config/constants";
import {
  DistrictListOffsetPaginationType,
  districtListOffsetPaginationFetch,
} from "@cms/services/district";
import { districtQueryKeys } from "@cms/utils/query";
import cls from "classnames";
import type { PropsWithChildren } from "react";
import React, { useMemo, useState, type HTMLAttributes } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useInfiniteQuery } from "react-query";

export interface WardInfoForm {
  name: string;
  code: string | null;
  nameEn?: string | null;
  fullName?: string | null;
  fullNameEn?: string | null;
  codeName?: string | null;
  district: GetElementType<DistrictListOffsetPaginationType["data"]> | null;
}

export interface IInfoFormProps extends HTMLAttributes<HTMLDivElement> {}

export const InfoForm: React.FunctionComponent<
  PropsWithChildren<IInfoFormProps>
> = ({ children, className, ...props }) => {
  //* Hooks
  const { t } = useTranslation(["common", "ward"]);

  const [search, setSearch] = useState("");

  //* Query
  const {
    data: districtsData,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: districtQueryKeys.list({}),
    queryFn: async ({ pageParam = 0 }) => {
      const { data, error } = await districtListOffsetPaginationFetch({
        offset: pageParam,
      });

      if (error) {
        throw error.value;
      }

      return data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.meta.hasMore) {
        // Return false means no next page
        return false;
      }

      const nextOffset = lastPage.meta.offset + lastPage.meta.limit;
      // Return next page number
      return nextOffset;
    },
  });

  const districtItems = useMemo(() => {
    if (!districtsData) return [];

    return districtsData.pages.flatMap((page) => page.data);
  }, [districtsData]);

  return (
    <div {...props} className={cls(className)}>
      <div className="mt-4">
        <Controller
          name="name"
          defaultValue={""}
          rules={{ required: t(FORM_VALIDATION_MESSAGE_CODE.REQUIRED) }}
          render={({ field, fieldState: { error } }) => (
            <>
              <label className="input input-bordered flex items-center gap-2">
                {t("ward_name", { ns: "ward" })}
                <input
                  {...field}
                  type="text"
                  className="grow"
                  placeholder={t("ward_name", {
                    ns: "ward",
                  })}
                />
              </label>
              {error?.message && (
                <p className="mt-1 text-error">{error?.message}</p>
              )}
            </>
          )}
        />
        <Controller
          name="code"
          defaultValue={""}
          rules={{ required: t(FORM_VALIDATION_MESSAGE_CODE.REQUIRED) }}
          render={({ field, fieldState: { error } }) => (
            <>
              <label className="input input-bordered flex items-center gap-2">
                {t("ward_code", { ns: "ward" })}
                <input
                  {...field}
                  type="text"
                  className="grow"
                  placeholder={t("ward_code", {
                    ns: "ward",
                  })}
                />
              </label>
              {error?.message && (
                <p className="mt-1 text-error">{error?.message}</p>
              )}
            </>
          )}
        />
        <Controller
          name="nameEn"
          defaultValue={""}
          render={({ field, fieldState: { error } }) => (
            <>
              <label className="input input-bordered flex items-center gap-2">
                {t("ward_name_en", { ns: "ward" })}
                <input
                  {...field}
                  type="text"
                  className="grow"
                  placeholder={t("ward_name_en", {
                    ns: "ward",
                  })}
                />
              </label>
              {error?.message && (
                <p className="mt-1 text-error">{error?.message}</p>
              )}
            </>
          )}
        />
        <Controller
          name="fullName"
          defaultValue={""}
          render={({ field, fieldState: { error } }) => (
            <>
              <label className="input input-bordered flex items-center gap-2">
                {t("ward_full_name", { ns: "ward" })}
                <input
                  {...field}
                  type="text"
                  className="grow"
                  placeholder={t("ward_full_name", {
                    ns: "ward",
                  })}
                />
              </label>
              {error?.message && (
                <p className="mt-1 text-error">{error?.message}</p>
              )}
            </>
          )}
        />
        <Controller
          name="fullNameEn"
          defaultValue={""}
          render={({ field, fieldState: { error } }) => (
            <>
              <label className="input input-bordered flex items-center gap-2">
                {t("ward_full_name_en", { ns: "ward" })}
                <input
                  {...field}
                  type="text"
                  className="grow"
                  placeholder={t("ward_full_name_en", {
                    ns: "ward",
                  })}
                />
              </label>
              {error?.message && (
                <p className="mt-1 text-error">{error?.message}</p>
              )}
            </>
          )}
        />
        <Controller
          name="codeName"
          defaultValue={""}
          render={({ field, fieldState: { error } }) => (
            <>
              <label className="input input-bordered flex items-center gap-2">
                {t("ward_code_name", { ns: "ward" })}
                <input
                  {...field}
                  type="text"
                  className="grow"
                  placeholder={t("ward_code_name", {
                    ns: "ward",
                  })}
                />
              </label>
              {error?.message && (
                <p className="mt-1 text-error">{error?.message}</p>
              )}
            </>
          )}
        />
        <div className="mt-4">
          <Controller
            name="district"
            defaultValue={null}
            render={({ field: { value, onChange } }) => (
              <ComboBox
                id="district"
                label="District"
                inputPlaceholder="Enter district name"
                selectedItem={value}
                setSelectedItem={onChange}
                items={districtItems}
                itemToString={(item) => item?.name ?? ""}
                itemRender={(item) => (
                  <span className="text-inherit">{item.name}</span>
                )}
                hasNextPage={hasNextPage}
                isLoadingMore={isFetchingNextPage}
                handleLoadMore={fetchNextPage}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};
