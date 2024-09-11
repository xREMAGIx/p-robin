import { TOAST_SUCCESS_MESSAGE_CODE } from "@cms/config/constants";
import {
  InfoForm,
  WarehouseInfoForm,
} from "@cms/containers/warehouse/InfoForm";
import { warehouseCreate } from "@cms/services/warehouse";
import React, { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const WarehouseCreate: React.FunctionComponent = () => {
  //* Hooks
  const { t } = useTranslation(["common", "warehouse"]);

  //* States
  const [isCreating, setIsCreating] = useState(false);

  //* Hook-form
  const methods = useForm<WarehouseInfoForm>();

  //* Function
  const handleCreate = async (form: WarehouseInfoForm) => {
    setIsCreating(true);
    const { error } = await warehouseCreate({
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
        href: "/warehouse",
        label: t("warehouse_title", { ns: "warehouse" }),
      },
      {
        href: "/warehouse/create",
        label: t("warehouse_create", { ns: "warehouse" }),
      },
    ];
  }, [t]);

  return (
    <div className="p-warehouseCreate mb-6">
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
          {t("create_warehouse", { ns: "warehouse" })}
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

export default WarehouseCreate;
