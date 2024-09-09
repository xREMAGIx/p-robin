import { ListTable } from "@cms/containers/ward/ListTable";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const breadcrumbs = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/ward",
    label: "Ward",
  },
];

const Ward: React.FunctionComponent = () => {
  //* Hooks
  const { t } = useTranslation(["common", "ward"]);

  return (
    <div className="p-ward">
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
