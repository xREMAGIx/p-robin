import { TOAST_SUCCESS_MESSAGE_CODE } from "@cms/config/constants";
import { InfoForm, ProvinceInfoForm } from "@cms/containers/province/InfoForm";
import { provinceDetailFetch, provinceUpdate } from "@cms/services/province";
import { provinceQueryKeys } from "@cms/utils/query";
import React, { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";

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
      const { data, error } = await provinceDetailFetch({
        id,
        query: {},
      });

      if (error) {
        throw error.value;
      }

      const province = data.data;

      methods.reset({
        ...province,
      });

      return data.data;
    },
  });

  //* Function
  const handleUpdate = async (form: ProvinceInfoForm) => {
    if (!id) return;
    setIsUpdating(true);
    const { data, error } = await provinceUpdate({
      id,
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
      ...province,
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
        href: "/province",
        label: t("province_title", { ns: "province" }),
      },
      {
        href: "/province/update",
        label: t("province_update", { ns: "province" }),
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
    <div className="p-provinceUpdate mb-6">
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
