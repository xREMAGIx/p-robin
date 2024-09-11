import { TOAST_SUCCESS_MESSAGE_CODE } from "@cms/config/constants";
import {
  InfoForm,
  WarehouseInfoForm,
} from "@cms/containers/warehouse/InfoForm";
import { warehouseDetailFetch, warehouseUpdate } from "@cms/services/warehouse";
import { warehouseQueryKeys } from "@cms/utils/query";
import React, { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";

const WarehouseUpdate: React.FunctionComponent = () => {
  //* Hooks
  const { id } = useParams<{ id: string }>();

  const { t } = useTranslation(["common", "warehouse"]);

  //* States
  const [isUpdating, setIsUpdating] = useState(false);

  //* Hook-form
  const methods = useForm<WarehouseInfoForm>();

  //* Queries
  const { isFetching: isLoading } = useQuery({
    queryKey: warehouseQueryKeys.detail(id ?? ""),
    queryFn: async () => {
      if (!id) return;
      const { data, error } = await warehouseDetailFetch({
        id,
        query: {},
      });

      if (error) {
        throw error.value;
      }

      const warehouse = data.data;

      methods.reset({
        ...warehouse,
      });

      return data.data;
    },
  });

  //* Function
  const handleUpdate = async (form: WarehouseInfoForm) => {
    if (!id) return;
    setIsUpdating(true);
    const { data, error } = await warehouseUpdate({
      id,
      ...form,
    });
    setIsUpdating(false);

    if (error) {
      const err = error.value.errors[0];
      toast.error(err.detail ?? err.title);
      return;
    }

    const warehouse = data.data;

    methods.reset({
      ...warehouse,
    });

    toast.success(t(TOAST_SUCCESS_MESSAGE_CODE.UPDATE));
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
        href: "/warehouse/update",
        label: t("warehouse_update", { ns: "warehouse" }),
      },
    ];
  }, [t]);

  if (isLoading)
    return (
      <>
        <div className="skeleton h-80 w-full"></div>
      </>
    );

  return (
    <div className="p-warehouseUpdate mb-6">
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
          {t("update_warehouse", { ns: "warehouse" })}
        </p>
        <button
          disabled={isUpdating}
          className="btn btn-primary capitalize"
          onClick={() => methods.handleSubmit(handleUpdate)()}
        >
          {t("update")}
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

export default WarehouseUpdate;
