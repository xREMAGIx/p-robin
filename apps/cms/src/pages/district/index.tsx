import { ListTable } from "@cms/containers/district/ListTable";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const District: React.FunctionComponent = () => {
  //* Hooks
  const { t } = useTranslation(["common", "district"]);

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
    ];
  }, [t]);

  return (
    <div className="p-district mb-6">
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
        {t("list_district", { ns: "district" })}
      </p>
      <ListTable />
    </div>
  );
};

export default District;
