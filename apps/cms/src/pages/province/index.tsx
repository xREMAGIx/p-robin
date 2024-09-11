import { ListTable } from "@cms/containers/province/ListTable";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Province: React.FunctionComponent = () => {
  //* Hooks
  const { t } = useTranslation(["common", "province"]);

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
    ];
  }, [t]);

  return (
    <div className="p-province mb-6">
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
        {t("list_province", { ns: "province" })}
      </p>
      <ListTable />
    </div>
  );
};

export default Province;
