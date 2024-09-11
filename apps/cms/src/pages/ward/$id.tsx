import { TOAST_SUCCESS_MESSAGE_CODE } from "@cms/config/constants";
import { InfoForm, WardInfoForm } from "@cms/containers/ward/InfoForm";
import { wardDetailFetch, wardUpdate } from "@cms/services/ward";
import { wardQueryKeys } from "@cms/utils/query";
import React, { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";

const WardUpdate: React.FunctionComponent = () => {
  //* Hooks
  const { id } = useParams<{ id: string }>();

  const { t } = useTranslation(["common", "ward"]);

  //* States
  const [isUpdating, setIsUpdating] = useState(false);

  //* Hook-form
  const methods = useForm<WardInfoForm>();

  //* Queries
  const { isFetching: isLoading } = useQuery({
    queryKey: wardQueryKeys.detail(id ?? ""),
    queryFn: async () => {
      if (!id) return;
      const { data, error } = await wardDetailFetch({
        id,
        query: {
          includes: "district-province",
        },
      });

      if (error) {
        throw error.value;
      }

      const ward = data.data;

      methods.reset({
        ...ward,
      });

      return data.data;
    },
  });

  //* Function
  const handleUpdate = async (form: WardInfoForm) => {
    if (!id) return;
    setIsUpdating(true);

    const { district, ...params } = form;
    const { data, error } = await wardUpdate({
      id,
      ...params,
      districtCode: form.district?.code,
    });

    setIsUpdating(false);

    if (error) {
      const err = error.value.errors[0];
      toast.error(err.detail ?? err.title);
      return;
    }

    const ward = data.data;

    methods.reset({
      ...ward,
      district,
    });

    toast.success(t(TOAST_SUCCESS_MESSAGE_CODE.CREATE));
  };

  //* Data
  const breadcrumbs = useMemo(() => {
    return [
      {
        href: "/",
        label: "Home",
      },
      {
        href: "/ward",
        label: t("ward_title", { ns: "ward" }),
      },
      {
        href: "/ward/update",
        label: t("ward_update", { ns: "ward" }),
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
    <div className="p-wardUpdate mb-6">
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
          {t("ward_update", { ns: "ward" })}
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

export default WardUpdate;
