import { Pagination } from "@client/components/Pagination";
import { DATE_TIME_FORMAT, DEFAULT_PAGINATION } from "@client/config/constants";
import { server } from "@client/config/server";
import { productQueryKeys } from "@client/utils/query";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { useQuery } from "react-query";

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

  //* States
  const [pagination, setPagination] = useState({
    limit: DEFAULT_PAGINATION.LIMIT,
    page: DEFAULT_PAGINATION.PAGE,
    total: 0,
    totalPages: 1,
  });

  //* Query
  const fetchQueryKey = productQueryKeys.list({
    page: pagination.page,
  });
  const { data, isFetching: isLoadingList } = useQuery({
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

  //* Functions
  const handleChangePage = (page: number) => {
    setPagination((prev) => ({ ...prev, page: page }));
  };

  //* Memos
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

  if (isLoadingList) return <div className="skeleton h-80 w-full"></div>;

  return (
    <>
      {/* Table */}
      <div className="overflow-x-auto h-80">
        <table className="table">
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
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
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                {headerData.map((col) => (
                  <th key={`${ele.id}-${col.id}`}>{ele[col.id]}</th>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <Pagination
          onPageChange={(page) => {
            handleChangePage(page.selected);
          }}
          pageCount={pagination.totalPages}
        />
      </div>
    </>
  );
};
