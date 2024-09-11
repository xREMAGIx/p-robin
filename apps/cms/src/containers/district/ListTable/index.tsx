import { Pagination } from "@cms/components/Pagination";
import {
  DATE_TIME_FORMAT,
  DEFAULT_PAGINATION,
  TOAST_SUCCESS_MESSAGE_CODE,
} from "@cms/config/constants";
import {
  districtListPagePaginationFetch,
  districtMultipleDelete,
} from "@cms/services/district";
import { districtQueryKeys } from "@cms/utils/query";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

const headerData = [
  {
    id: "id",
    labelTranslateKey: "id",
  },
  {
    id: "name",
    labelTranslateKey: "name",
  },
  {
    id: "createdAt",
    labelTranslateKey: "created_at",
  },
  {
    id: "updatedAt",
    labelTranslateKey: "updated_at",
  },
] as const;

const searchOptions = [
  {
    id: "name",
    label: "Name",
  },
];

type TableColKeys = (typeof headerData)[number]["id"];

type TableRowData = {
  [key in TableColKeys]: string | number;
};

type SearchForm = {
  type: "name";
  text: string;
};

export const ListTable: React.FunctionComponent = () => {
  //* Hooks
  const { t } = useTranslation(["common", "district"]);

  //* States
  const [pagination, setPagination] = useState({
    limit: DEFAULT_PAGINATION.LIMIT,
    page: DEFAULT_PAGINATION.PAGE,
    total: 0,
    totalPages: 1,
  });
  const [selectedRow, setSelectedRow] = useState<TableRowData[]>([]);
  const [search, setSearch] = useState<SearchForm>({
    type: "name",
    text: "",
  });

  //* Hook-form
  const methods = useForm<SearchForm>();

  //* Query
  const fetchQueryKey = districtQueryKeys.list({
    page: pagination.page,
    search: search.text,
  });
  const {
    data,
    isFetching: isLoadingList,
    refetch,
  } = useQuery({
    queryKey: fetchQueryKey,
    queryFn: async () => {
      const query = {
        limit: pagination.limit,
        page: pagination.page,
        ...searchKey(),
      };

      const { data, error } = await districtListPagePaginationFetch({
        query: query,
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

  const tableData: TableRowData[] = useMemo(() => {
    if (!data) return [];

    return data.map((ele) => ({
      id: ele.id,
      name: ele.name,
      createdAt: dayjs(ele.createdAt).format(DATE_TIME_FORMAT),
      updatedAt: dayjs(ele.updatedAt).format(DATE_TIME_FORMAT),
    }));
  }, [data]);

  //* Functions
  const searchKey = () => {
    if (!search.text) return;

    switch (search.type) {
      case "name":
        return { name: search.text };
      default:
        return;
    }
  };

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
    const { error } = await districtMultipleDelete({
      ids: selectedRow.map((ele) => parseInt(ele.id.toString(), 10)),
    });

    if (error) {
      throw error.value;
    }

    toast.success(t(TOAST_SUCCESS_MESSAGE_CODE.DELETE));
    setSelectedRow([]);
    refetch();
  };

  const handleSearch = (data: SearchForm) => {
    setSearch({
      text: data.text,
      type: data.type,
    });
    setPagination({
      limit: DEFAULT_PAGINATION.LIMIT,
      page: DEFAULT_PAGINATION.PAGE,
      total: 0,
      totalPages: 1,
    });
  };

  if (isLoadingList)
    return (
      <>
        <div className="mt-4 flex justify-between items-center gap-4">
          <div className=""></div>
          <Link to={"/district/create"} className="btn btn-secondary">
            {t("create")}
          </Link>
        </div>
        <div className="divider" />
        <div className="skeleton h-80 w-full"></div>
      </>
    );

  return (
    <>
      <div className="mt-4 flex justify-between items-center gap-4 flex-wrap">
        <div className="flex gap-4 flex-wrap w-full lg:w-auto">
          <FormProvider {...methods}>
            <form
              className="w-full lg:w-auto"
              onSubmit={methods.handleSubmit(handleSearch)}
            >
              <div className="join join-vertical w-full lg:join-horizontal">
                <Controller
                  name="text"
                  defaultValue={""}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="input input-bordered join-item"
                      placeholder="Search"
                    />
                  )}
                />
                <Controller
                  name="type"
                  defaultValue={searchOptions[0].id}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <select
                        {...field}
                        className="select select-bordered join-item"
                      >
                        <option disabled>Search by</option>
                        {searchOptions.map((ele, idx) => (
                          <option
                            key={`select-${ele.id}-${idx}`}
                            value={ele.id}
                          >
                            {ele.label}
                          </option>
                        ))}
                      </select>
                      {error?.message && (
                        <p className="mt-1 text-error">{error?.message}</p>
                      )}
                    </>
                  )}
                />
                <button className="btn join-item" type="submit">
                  Search
                </button>
              </div>
            </form>
          </FormProvider>
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
        </div>
        <Link to={"/district/create"} className="btn btn-secondary">
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
                <th key={`${ele.id}-${idx}`}>{t(ele.labelTranslateKey)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((ele, idx) => (
              <tr key={`checkbox-${ele.id}-${idx}`} className="hover">
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
                        <Link to={`/district/${ele.id}`}>
                          <p className="line-clamp-3">{ele[col.id]}</p>
                        </Link>
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
