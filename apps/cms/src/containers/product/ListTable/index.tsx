import { Pagination } from "@cms/components/Pagination";
import { DATE_TIME_FORMAT, DEFAULT_PAGINATION } from "@cms/config/constants";
import { PRODUCT_STATUS, PRODUCT_STATUS_CODE } from "@cms/config/enums";
import { server } from "@cms/config/server";
import { productQueryKeys } from "@cms/utils/query";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

const headerData = [
  {
    id: "id",
    label: "ID",
  },
  {
    id: "name",
    label: "Name",
  },
  {
    id: "description",
    label: "Description",
  },
  {
    id: "barcode",
    label: "Barcode",
  },
  {
    id: "price",
    label: "Price",
    textAlign: "right",
  },
  {
    id: "status",
    label: "Status",
  },
  {
    id: "createdAt",
    label: "Created at",
  },
  {
    id: "updatedAt",
    label: "Updated at",
  },
] as const;

type TableColKeys = (typeof headerData)[number]["id"];

type TableRowData = {
  [key in TableColKeys]: string | number;
};

export const ListTable: React.FunctionComponent = () => {
  //* Hooks
  const { t } = useTranslation(["common", "product"]);

  //* States
  const [pagination, setPagination] = useState({
    limit: DEFAULT_PAGINATION.LIMIT,
    page: DEFAULT_PAGINATION.PAGE,
    total: 0,
    totalPages: 1,
  });
  const [selectedRow, setSelectedRow] = useState<TableRowData[]>([]);

  //* Query
  const fetchQueryKey = productQueryKeys.list({
    page: pagination.page,
  });
  const {
    data,
    isFetching: isLoadingList,
    refetch,
  } = useQuery({
    queryKey: fetchQueryKey,
    queryFn: async () => {
      const { data, error } = await server.api.products["page-pagination"].get({
        query: {
          limit: pagination.limit,
          page: pagination.page,
        },
      });

      if (error) {
        throw error.value;
      }

      setPagination({
        limit: Number(data.meta.limit),
        page: Number(data.meta.page),
        total: Number(data.meta.total),
        totalPages: Number(data.meta.totalPages),
      });

      return data.data;
    },
  });

  //* Memos
  const productStatuses: { [key: string | number]: string } = useMemo(() => {
    return Object.keys(PRODUCT_STATUS).reduce((prev, key) => {
      console.log(PRODUCT_STATUS_CODE[key as keyof typeof PRODUCT_STATUS]);
      return {
        ...prev,
        [PRODUCT_STATUS_CODE[key as keyof typeof PRODUCT_STATUS]]: t(
          `product_${PRODUCT_STATUS[key as keyof typeof PRODUCT_STATUS]}`,
          { ns: "product" }
        ),
      };
    }, {});
  }, [t]);

  const tableData: TableRowData[] = useMemo(() => {
    if (!data) return [];

    return data.map((ele) => ({
      id: ele.id,
      name: ele.name,
      description: ele.description ?? "",
      createdAt: dayjs(ele.createdAt).format(DATE_TIME_FORMAT),
      updatedAt: dayjs(ele.updatedAt).format(DATE_TIME_FORMAT),
      barcode: ele.barcode ?? "",
      price: ele.price,
      status: ele.status,
    }));
  }, [data]);

  //* Functions
  const handleChangePage = (page: number) => {
    setSelectedRow([]);
    setPagination((prev) => ({ ...prev, page: page }));
  };

  const handleCheckboxAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.checked ? setSelectedRow(tableData) : setSelectedRow([]);
  };

  const handleCheckbox = (checked: boolean, item: TableRowData) => {
    checked
      ? setSelectedRow((state) => [...state, item])
      : setSelectedRow((state) => state.filter((ele) => ele.id !== item.id));
  };

  const handleDelete = async () => {
    const { error } = await server.api.products["multiple-delete"].delete({
      ids: selectedRow.map((ele) => parseInt(ele.id.toString(), 10)),
    });

    if (error) {
      throw error.value;
    }

    refetch();
  };

  if (isLoadingList)
    return (
      <>
        <div className="mt-4 flex justify-between items-center gap-4">
          <div className=""></div>
          <Link to={"/product/create"} className="btn btn-secondary">
            {t("create")}
          </Link>
        </div>
        <div className="divider" />
        <div className="skeleton h-80 w-full"></div>
      </>
    );

  return (
    <>
      <div className="mt-4 flex justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          {!!selectedRow.length && (
            <>
              <span>{selectedRow.length} item(s) selected</span>
              <button
                className="btn btn-outline btn-error"
                onClick={handleDelete}
              >
                Delete
              </button>
            </>
          )}
        </div>
        <Link to={"/product/create"} className="btn btn-secondary">
          {t("create")}
        </Link>
      </div>
      <div className="divider" />
      {/* Table */}
      <div className="overflow-x-auto h-96">
        <table className="table">
          <thead>
            <tr>
              <th>
                <label>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={tableData.length === selectedRow.length}
                    onChange={handleCheckboxAll}
                  />
                </label>
              </th>
              {headerData.map((ele, idx) => (
                <th key={`${ele.id}-${idx}`}>{ele.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((ele, idx) => (
              <tr key={`${ele.id}-${idx}`} className="hover">
                <th>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={!!selectedRow.find((item) => item.id === ele.id)}
                      onChange={(e) => handleCheckbox(e.target.checked, ele)}
                    />
                  </label>
                </th>
                {headerData.map((col) => {
                  if (col.id === "name") {
                    return (
                      <td key={`${ele.id}-${col.id}`}>
                        <Link to={`/product/${ele.id}`}>
                          <p className="line-clamp-3">{ele[col.id]}</p>
                        </Link>
                      </td>
                    );
                  }

                  if (col.id === "status") {
                    return (
                      <td key={`${ele.id}-${col.id}`}>
                        {productStatuses[ele[col.id]]}
                      </td>
                    );
                  }

                  return (
                    <td key={`${ele.id}-${col.id}`}>
                      <p className="line-clamp-3">{ele[col.id]}</p>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={pagination.page}
          handleChangePage={handleChangePage}
          pageCount={pagination.totalPages}
        />
      </div>
    </>
  );
};
