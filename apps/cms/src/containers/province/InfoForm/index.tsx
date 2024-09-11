import { FORM_VALIDATION_MESSAGE_CODE } from "@cms/config/constants";
import cls from "classnames";
import type { PropsWithChildren } from "react";
import React, { type HTMLAttributes } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

export interface ProvinceInfoForm {
  name: string;
  code: string | null;
  nameEn?: string | null;
  fullName?: string | null;
  fullNameEn?: string | null;
  codeName?: string | null;
}

export interface IInfoFormProps extends HTMLAttributes<HTMLDivElement> {}

export const InfoForm: React.FunctionComponent<
  PropsWithChildren<IInfoFormProps>
> = ({ children, className, ...props }) => {
  //* Hooks
  const { t } = useTranslation(["common", "province"]);

  return (
    <div {...props} className={cls(className)}>
      <Controller
        name="name"
        defaultValue={""}
        rules={{ required: t(FORM_VALIDATION_MESSAGE_CODE.REQUIRED) }}
        render={({ field, fieldState: { error } }) => (
          <>
            <label className="mt-4 form-control w-full">
              <div className="label">
                <span className="label-text capitalize">
                  {t("province_name", { ns: "province" })}
                </span>
              </div>
              <input
                {...field}
                type="text"
                className="input input-bordered w-full"
                placeholder={t("province_name", {
                  ns: "province",
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
            <label className="mt-4 form-control w-full">
              <div className="label">
                <span className="label-text capitalize">
                  {t("province_code", { ns: "province" })}
                </span>
              </div>
              <input
                {...field}
                type="text"
                className="input input-bordered w-full"
                placeholder={t("province_code", {
                  ns: "province",
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
                  {t("province_name_en", { ns: "province" })}
                </span>
              </div>
              <input
                {...field}
                type="text"
                className="input input-bordered w-full"
                placeholder={t("province_name_en", {
                  ns: "province",
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
                  {t("province_full_name", { ns: "province" })}
                </span>
              </div>
              <input
                {...field}
                type="text"
                className="input input-bordered w-full"
                placeholder={t("province_full_name", {
                  ns: "province",
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
                  {t("province_full_name_en", { ns: "province" })}
                </span>
              </div>
              <input
                {...field}
                type="text"
                className="input input-bordered w-full"
                placeholder={t("province_full_name_en", {
                  ns: "province",
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
                  {t("province_code_name", { ns: "province" })}
                </span>
              </div>
              <input
                {...field}
                type="text"
                className="input input-bordered w-full"
                placeholder={t("province_code_name", {
                  ns: "province",
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
  );
};
