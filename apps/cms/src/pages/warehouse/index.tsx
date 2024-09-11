import { ListTable } from "@cms/containers/warehouse/ListTable";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Warehouse: React.FunctionComponent = () => {
  //* Hooks
  const { t } = useTranslation(["common", "warehouse"]);

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
    ];
  }, [t]);

  return (
    <div className="p-warehouse mb-6">
      <div className="breadcrumbs text-sm">
        <ul>
          {breadcrumbs.map((ele, idx) => (
            <li key={`breadcrumb-${idx}`}>
              <Link to={ele.href}>{ele.label}</Link>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 font-bold text-lg capitalize">
        {t("list_warehouse", { ns: "warehouse" })}
      </p>
      <ListTable />
    </div>
  );
};

export default Warehouse;
