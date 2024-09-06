import { FORM_VALIDATION_MESSAGE_CODE } from "@cms/config/constants";
import cls from "classnames";
import type { PropsWithChildren } from "react";
import React, { type HTMLAttributes } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

export interface DistrictInfoForm {
  name: string;
}

export interface IInfoFormProps extends HTMLAttributes<HTMLDivElement> {}

export const InfoForm: React.FunctionComponent<
  PropsWithChildren<IInfoFormProps>
> = ({ children, className, ...props }) => {
  //* Hooks
  const { t } = useTranslation(["common", "district"]);

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
                {t("district_name", { ns: "district" })}
                <input
                  {...field}
                  type="text"
                  className="grow"
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
    </div>
  );
};
