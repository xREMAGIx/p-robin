import { TOAST_SUCCESS_MESSAGE_CODE } from "@cms/config/constants";
import { InfoForm, ProvinceInfoForm } from "@cms/containers/province/InfoForm";
import { provinceCreate } from "@cms/services/province";
import React, { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const ProvinceCreate: React.FunctionComponent = () => {
  //* Hooks
  const { t } = useTranslation(["common", "province"]);

  //* States
  const [isCreating, setIsCreating] = useState(false);

  //* Hook-form
  const methods = useForm<ProvinceInfoForm>();

  //* Function
  const handleCreate = async (form: ProvinceInfoForm) => {
    setIsCreating(true);
    const { error } = await provinceCreate({
      ...form,
    });
    setIsCreating(false);

    if (error) {
      const err = error.value.errors[0];
      toast.error(err.detail ?? err.title);
      return;
    }

    methods.reset();
    toast.success(t(TOAST_SUCCESS_MESSAGE_CODE.CREATE));
  };

  //* Data
  const breadcrumbs = useMemo(() => {
    return [
      {
        href: "/",
        label: t("home", { ns: "common" }),
      },
      {
        href: "/province",
        label: t("province_title", { ns: "province" }),
      },
      {
        href: "/province/create",
        label: t("province_create", { ns: "province" }),
      },
    ];
  }, [t]);

  return (
    <div className="p-productCreate mb-6">
      <div className="breadcrumbs text-sm">
        <ul>
          {breadcrumbs.map((ele, idx) => (
            <li key={`breadcrumb-${idx}`}>
              <Link to={ele.href}>{ele.label}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex justify-between items-center gap-1">
        <p className="font-bold text-lg capitalize">
          {t("create_province", { ns: "province" })}
        </p>
        <button
          disabled={isCreating}
          className="btn btn-primary capitalize"
          onClick={() => methods.handleSubmit(handleCreate)()}
        >
          {t("create")}
        </button>
      </div>
      <div className="mt-4">
        <FormProvider {...methods}>
          <InfoForm />
        </FormProvider>
      </div>
    </div>
  );
};

export default ProvinceCreate;
