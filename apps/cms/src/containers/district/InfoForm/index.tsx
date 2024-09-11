import { ComboBox } from "@cms/components/ComboBox";
import { FORM_VALIDATION_MESSAGE_CODE } from "@cms/config/constants";
import { useDebouncedValue } from "@cms/hooks/useDebounceValue";
import {
  ProvinceListOffsetPaginationType,
  provinceListOffsetPaginationFetch,
} from "@cms/services/province";
import { provinceQueryKeys } from "@cms/utils/query";
import cls from "classnames";
import type { PropsWithChildren } from "react";
import React, { useMemo, useState, type HTMLAttributes } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useInfiniteQuery } from "react-query";

export interface DistrictInfoForm {
  name: string;
  code: string | null;
  nameEn?: string | null;
  fullName?: string | null;
  fullNameEn?: string | null;
  codeName?: string | null;
  province: GetElementType<ProvinceListOffsetPaginationType["data"]> | null;
}

export interface IInfoFormProps extends HTMLAttributes<HTMLDivElement> {}

export const InfoForm: React.FunctionComponent<
  PropsWithChildren<IInfoFormProps>
> = ({ children, className, ...props }) => {
  //* Hooks
  const { t } = useTranslation(["common", "district"]);

  const [provinceSearchText, setProvinceSearchText] = useState("");

  const [debounceProvinceSearch] = useDebouncedValue(provinceSearchText, 300);

  //* Query
  const {
    data: provincesData,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: provinceQueryKeys.list({ search: debounceProvinceSearch }),
    queryFn: async ({ pageParam = 0 }) => {
      const { data, error } = await provinceListOffsetPaginationFetch({
        query: {
          name: debounceProvinceSearch,
          offset: pageParam,
        },
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

  const provinceItems = useMemo(() => {
    if (!provincesData) return [];

    return provincesData.pages.flatMap((page) => page.data);
  }, [provincesData]);

  return (
    <div {...props} className={cls(className)}>
      <div className="mt-4">
        <Controller
          name="name"
          defaultValue={""}
          rules={{ required: t(FORM_VALIDATION_MESSAGE_CODE.REQUIRED) }}
          render={({ field, fieldState: { error } }) => (
            <>
              <label className="mt-4 form-control w-full">
                <div className="label">
                  <span className="label-text capitalize">
                    {t("district_name", { ns: "district" })}
                  </span>
                </div>
                <input
                  {...field}
                  type="text"
                  className="input input-bordered w-full"
                  placeholder={t("district_name", {
                    ns: "district",
                  })}
                />
              </label>
              {error?.message && (
                <p className="mt-1 text-error">{error?.message}</p>
              )}
            </>
          )}
        />
      </div>
      <Controller
        name="code"
        defaultValue={""}
        rules={{ required: t(FORM_VALIDATION_MESSAGE_CODE.REQUIRED) }}
        render={({ field, fieldState: { error } }) => (
          <>
            <label className="mt-4 form-control w-full">
              <div className="label">
                <span className="label-text capitalize">
                  {t("district_code", { ns: "district" })}
                </span>
              </div>
              <input
                {...field}
                type="text"
                className="input input-bordered w-full"
                placeholder={t("district_code", {
                  ns: "district",
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
            <label className="mt-4 form-control w-full">
              <div className="label">
                <span className="label-text capitalize">
                  {t("district_name_en", { ns: "district" })}
                </span>
              </div>
              <input
                {...field}
                type="text"
                className="input input-bordered w-full"
                placeholder={t("district_name_en", {
                  ns: "district",
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
            <label className="mt-4 form-control w-full">
              <div className="label">
                <span className="label-text capitalize">
                  {t("district_full_name", { ns: "district" })}
                </span>
              </div>
              <input
                {...field}
                type="text"
                className="input input-bordered w-full"
                placeholder={t("district_full_name", {
                  ns: "district",
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
            <label className="mt-4 form-control w-full">
              <div className="label">
                <span className="label-text capitalize">
                  {t("district_full_name_en", { ns: "district" })}
                </span>
              </div>
              <input
                {...field}
                type="text"
                className="input input-bordered w-full"
                placeholder={t("district_full_name_en", {
                  ns: "district",
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
            <label className="mt-4 form-control w-full">
              <div className="label">
                <span className="label-text capitalize">
                  {t("district_code_name", { ns: "district" })}
                </span>
              </div>
              <input
                {...field}
                type="text"
                className="input input-bordered w-full"
                placeholder={t("district_code_name", {
                  ns: "district",
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
          name="province"
          defaultValue={null}
          render={({ field: { value, onChange } }) => (
            <ComboBox
              id="province"
              label={t("district_province", { ns: "district" })}
              inputPlaceholder="Enter province name"
              selectedItem={value}
              setSelectedItem={onChange}
              items={provinceItems}
              itemToString={(item) => (item ? `${item.fullName}` : "")}
              itemRender={(item) => (
                <span className="text-inherit">{item.fullName}</span>
              )}
              onInputValueChange={(val) => setProvinceSearchText(val)}
              hasNextPage={hasNextPage}
              isLoadingMore={isFetchingNextPage}
              handleLoadMore={fetchNextPage}
              showListUpward
            />
          )}
        />
      </div>
    </div>
  );
};
