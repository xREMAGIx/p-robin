import { TOAST_SUCCESS_MESSAGE_CODE } from "@cms/config/constants";
import { server } from "@cms/config/server";
import { InfoForm, ProductInfoForm } from "@cms/containers/product/InfoForm";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

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
    href: "/product/create",
    label: "Create",
  },
];

const ProductCreate: React.FunctionComponent = () => {
  //* Hooks
  const { t } = useTranslation(["common", "product"]);

  //* States
  const [isCreating, setIsCreating] = useState(false);

  //* Hook-form
  const methods = useForm<ProductInfoForm>();

  //* Function
  const handleCreate = async (form: ProductInfoForm) => {
    setIsCreating(true);
    const { error } = await server.api.products.create.post({
      ...form,
      status: parseInt(form.status, 10),
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

  return (
    <div className="p-productCreate">
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
          {t("create_product", { ns: "product" })}
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

export default ProductCreate;
