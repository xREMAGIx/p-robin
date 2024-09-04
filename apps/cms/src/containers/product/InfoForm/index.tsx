import { FORM_VALIDATION_MESSAGE_CODE } from "@cms/config/constants";
import { PRODUCT_STATUS, PRODUCT_STATUS_CODE } from "@cms/config/enums";
import cls from "classnames";
import type { PropsWithChildren } from "react";
import React, { useMemo, type HTMLAttributes } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

export interface ProductInfoForm {
  name: string;
  barcode: string;
  price: number;
  costPrice: number;
  salePrice: number;
  description: string;
  status: string;
}

export interface IInfoFormProps extends HTMLAttributes<HTMLDivElement> {}

export const InfoForm: React.FunctionComponent<
  PropsWithChildren<IInfoFormProps>
> = ({ children, className, ...props }) => {
  //* Hooks
  const { t } = useTranslation(["common", "product"]);

  //* Memos
  const productStatusList = useMemo(() => {
    return Object.keys(PRODUCT_STATUS).map((key) => ({
      label: t(
        `product_${PRODUCT_STATUS[key as keyof typeof PRODUCT_STATUS]}`,
        { ns: "product" }
      ),
      value: PRODUCT_STATUS_CODE[key as keyof typeof PRODUCT_STATUS],
    }));
  }, [t]);

  return (
    <div {...props} className={cls(className)}>
      <div className="mt-4">
        <Controller
          name="name"
          defaultValue={""}
          rules={{
            required: t(FORM_VALIDATION_MESSAGE_CODE.REQUIRED),
          }}
          render={({ field, fieldState: { error } }) => (
            <>
              <label className="input input-bordered flex items-center gap-2">
                {t("product_name", { ns: "product" })}
                <input
                  {...field}
                  type="text"
                  className="grow"
                  placeholder={t("product_name", { ns: "product" })}
                />
              </label>
              {error?.message && (
                <p className="mt-1 text-error">{error?.message}</p>
              )}
            </>
          )}
        />
      </div>
      <div className="mt-2">
        <Controller
          name="barcode"
          defaultValue={""}
          render={({ field, fieldState: { error } }) => (
            <>
              <label className="input input-bordered flex items-center gap-2">
                {t("product_barcode", { ns: "product" })}
                <input
                  {...field}
                  type="text"
                  className="grow"
                  placeholder={t("product_barcode", { ns: "product" })}
                />
              </label>
              {error?.message && (
                <p className="mt-1 text-error">{error?.message}</p>
              )}
            </>
          )}
        />
      </div>
      <div className="mt-2">
        <Controller
          name="description"
          defaultValue={""}
          render={({ field, fieldState: { error } }) => (
            <>
              <label className="input input-bordered flex items-center gap-2">
                {t("product_description", { ns: "product" })}
                <input
                  {...field}
                  type="text"
                  className="grow"
                  placeholder={t("product_description", { ns: "product" })}
                />
              </label>
              {error?.message && (
                <p className="mt-1 text-error">{error?.message}</p>
              )}
            </>
          )}
        />
      </div>
      <div className="mt-2">
        <Controller
          name="price"
          defaultValue={0}
          rules={{
            required: t(FORM_VALIDATION_MESSAGE_CODE.REQUIRED),
          }}
          render={({ field, fieldState: { error } }) => (
            <>
              <label className="input input-bordered flex items-center gap-2">
                {t("product_price", { ns: "product" })}
                <input
                  {...field}
                  type="number"
                  className="grow"
                  placeholder={t("product_price", { ns: "product" })}
                />
              </label>
              {error?.message && (
                <p className="mt-1 text-error">{error?.message}</p>
              )}
            </>
          )}
        />
      </div>
      <div className="mt-2">
        <Controller
          name="salePrice"
          defaultValue={0}
          rules={{
            required: t(FORM_VALIDATION_MESSAGE_CODE.REQUIRED),
          }}
          render={({ field, fieldState: { error } }) => (
            <>
              <label className="input input-bordered flex items-center gap-2">
                {t("product_sale_price", { ns: "product" })}
                <input
                  {...field}
                  type="number"
                  className="grow"
                  placeholder={t("product_sale_price", { ns: "product" })}
                />
              </label>
              {error?.message && (
                <p className="mt-1 text-error">{error?.message}</p>
              )}
            </>
          )}
        />
      </div>
      <div className="mt-2">
        <Controller
          name="costPrice"
          defaultValue={0}
          rules={{
            required: t(FORM_VALIDATION_MESSAGE_CODE.REQUIRED),
          }}
          render={({ field, fieldState: { error } }) => (
            <>
              <label className="input input-bordered flex items-center gap-2">
                {t("product_cost_price", { ns: "product" })}
                <input
                  {...field}
                  type="number"
                  className="grow"
                  placeholder={t("product_cost_price", { ns: "product" })}
                />
              </label>
              {error?.message && (
                <p className="mt-1 text-error">{error?.message}</p>
              )}
            </>
          )}
        />
      </div>
      <div className="mt-2">
        <Controller
          name="status"
          defaultValue={productStatusList[0].value}
          rules={{
            required: t(FORM_VALIDATION_MESSAGE_CODE.REQUIRED),
          }}
          render={({ field, fieldState: { error } }) => (
            <>
              <select {...field} className="select select-bordered w-full">
                <option disabled>
                  {t("product_status", { ns: "product" })}
                </option>
                {productStatusList.map((ele, idx) => (
                  <option key={`${ele.value}-${idx}`} value={ele.value}>
                    {ele.label}
                  </option>
                ))}
              </select>
              {error?.message && (
                <p className="mt-1 text-error">{error?.message}</p>
              )}
            </>
          )}
        />
      </div>
    </div>
  );
};
