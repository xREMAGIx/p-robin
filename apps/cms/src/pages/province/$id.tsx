import { TOAST_SUCCESS_MESSAGE_CODE } from "@cms/config/constants";
import { server } from "@cms/config/server";
import { InfoForm, ProvinceInfoForm } from "@cms/containers/province/InfoForm";
import { provinceQueryKeys } from "@cms/utils/query";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";

const breadcrumbs = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/province",
    label: "Province",
  },
  {
    href: "/province/update",
    label: "Update",
  },
];

const ProvinceUpdate: React.FunctionComponent = () => {
  //* Hooks
  const { id } = useParams<{ id: string }>();

  const { t } = useTranslation(["common", "province"]);

  //* States
  const [isUpdating, setIsUpdating] = useState(false);

  //* Hook-form
  const methods = useForm<ProvinceInfoForm>();

  //* Queries
  const { isFetching: isLoading } = useQuery({
    queryKey: provinceQueryKeys.detail(id ?? ""),
    queryFn: async () => {
      if (!id) return;
      const { data, error } = await server.api["provinces"]({ id }).get();

      if (error) {
        throw error.value;
      }

      const province = data.data;

      methods.reset({
        name: province.name,
      });

      return data.data;
    },
  });

  //* Function
  const handleUpdate = async (form: ProvinceInfoForm) => {
    if (!id) return;
    setIsUpdating(true);
    const { data, error } = await server.api["provinces"]({ id }).put({
      ...form,
    });
    setIsUpdating(false);

    if (error) {
      const err = error.value.errors[0];
      toast.error(err.detail ?? err.title);
      return;
    }

    const province = data.data;

    methods.reset({
      name: province.name,
    });

    methods.reset();
    toast.success(t(TOAST_SUCCESS_MESSAGE_CODE.CREATE));
  };

  if (isLoading)
    return (
      <>
        <div className="skeleton h-80 w-full"></div>
      </>
    );

  return (
    <div className="p-provinceUpdate">
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
          {t("update_province", { ns: "province" })}
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

export default ProvinceUpdate;
