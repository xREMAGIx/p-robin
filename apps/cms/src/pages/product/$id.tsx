import { TOAST_SUCCESS_MESSAGE_CODE } from "@cms/config/constants";
import { server } from "@cms/config/server";
import { InfoForm, ProductInfoForm } from "@cms/containers/product/InfoForm";
import { productQueryKeys } from "@cms/utils/query";
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
    href: "/product",
    label: "Product",
  },
  {
    href: "/product/update",
    label: "Update",
  },
];

const ProductUpdate: React.FunctionComponent = () => {
  //* Hooks
  const { id } = useParams<{ id: string }>();

  const { t } = useTranslation(["common", "product"]);

  //* States
  const [isUpdating, setIsUpdating] = useState(false);

  //* Hook-form
  const methods = useForm<ProductInfoForm>();

  //* Queries
  const { isFetching: isLoading } = useQuery({
    queryKey: productQueryKeys.detail(id ?? ""),
    queryFn: async () => {
      if (!id) return;
      const { data, error } = await server.api.products({ id }).get();

      if (error) {
        throw error.value;
      }

      const product = data.data;

      methods.reset({
        name: product.name,
        barcode: product.barcode ?? "",
        price: product.price,
        costPrice: product.costPrice,
        salePrice: product.salePrice ?? 0,
        description: product.description ?? "",
        status: product.status.toString(),
      });

      return data.data;
    },
  });

  //* Function
  const handleUpdate = async (form: ProductInfoForm) => {
    if (!id) return;
    setIsUpdating(true);
    const { data, error } = await server.api.products({ id }).put({
      ...form,
      status: parseInt(form.status, 10),
    });
    setIsUpdating(false);

    if (error) {
      const err = error.value.errors[0];
      toast.error(err.detail ?? err.title);
      return;
    }

    const product = data.data;

    methods.reset({
      name: product.name,
      barcode: product.barcode ?? "",
      price: product.price,
      costPrice: product.costPrice,
      salePrice: product.salePrice ?? 0,
      description: product.description ?? "",
      status: product.status.toString(),
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
    <div className="p-productUpdate">
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
          {t("update_product", { ns: "product" })}
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

export default ProductUpdate;
