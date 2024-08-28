import { ListTable } from "@client/containers/product/ListTable";
import React from "react";
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
];

const Product: React.FunctionComponent = () => {
  //* Hooks
  const { t } = useTranslation(["common", "product"]);

  return (
    <div className="p-product">
      <div className="breadcrumbs text-sm">
        <ul>
          {breadcrumbs.map((ele, idx) => (
            <li key={`breadcrumb-${idx}`}>
              <Link to={ele.href}>{ele.label}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <p className="font-bold text-lg capitalize">
          {t("list_product", { ns: "product" })}
        </p>
        <Link to={"/product/create"} className="btn btn-secondary">
          {t("create")}
        </Link>
      </div>
      <div className="divider" />
      <ListTable />
    </div>
  );
};

export default Product;
