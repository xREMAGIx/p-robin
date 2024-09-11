import { ListTable } from "@cms/containers/ward/ListTable";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Ward: React.FunctionComponent = () => {
  //* Hooks
  const { t } = useTranslation(["common", "ward"]);

  //* Data
  const breadcrumbs = useMemo(() => {
    return [
      {
        href: "/",
        label: t("home", { ns: "common" }),
      },
      {
        href: "/ward",
        label: t("ward_title", { ns: "ward" }),
      },
    ];
  }, [t]);

  return (
    <div className="p-ward mb-6">
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
        {t("list_ward", { ns: "ward" })}
      </p>
      <ListTable />
    </div>
  );
};

export default Ward;
