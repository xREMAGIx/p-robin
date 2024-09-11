import { TOAST_SUCCESS_MESSAGE_CODE } from "@cms/config/constants";
import { DistrictInfoForm, InfoForm } from "@cms/containers/district/InfoForm";
import { districtDetailFetch, districtUpdate } from "@cms/services/district";
import { districtQueryKeys } from "@cms/utils/query";
import React, { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";

const DistrictUpdate: React.FunctionComponent = () => {
  //* Hooks
  const { id } = useParams<{ id: string }>();

  const { t } = useTranslation(["common", "district"]);

  //* States
  const [isUpdating, setIsUpdating] = useState(false);

  //* Hook-form
  const methods = useForm<DistrictInfoForm>();

  //* Queries
  const { isFetching: isLoading } = useQuery({
    queryKey: districtQueryKeys.detail(id ?? ""),
    queryFn: async () => {
      if (!id) return;
      const { data, error } = await districtDetailFetch({
        id,
        query: {
          includes: "province",
        },
      });

      if (error) {
        throw error.value;
      }

      const district = data.data;

      methods.reset({
        ...district,
      });

      return data.data;
    },
  });

  //* Function
  const handleUpdate = async (form: DistrictInfoForm) => {
    if (!id) return;
    setIsUpdating(true);
    const { province, ...params } = form;

    const { data, error } = await districtUpdate({
      id,
      ...params,
      provinceCode: form.province?.code,
    });
    setIsUpdating(false);

    if (error) {
      const err = error.value.errors[0];
      toast.error(err.detail ?? err.title);
      return;
    }

    const district = data.data;

    methods.reset({
      ...district,
      province,
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
        href: "/district",
        label: t("district_title", { ns: "district" }),
      },
      {
        href: "/district/update",
        label: t("district_update", { ns: "district" }),
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
    <div className="p-districtUpdate mb-6">
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
          {t("update_district", { ns: "district" })}
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

export default DistrictUpdate;
