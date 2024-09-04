import cls from "classnames";
import type { PropsWithChildren } from "react";
import React from "react";
import ReactPaginate, { ReactPaginateProps } from "react-paginate";
import Icon from "../Icon";

export interface IPaginationProps extends ReactPaginateProps {
  currentPage: number;
  handleChangePage: (page: number) => void;
}

export const Pagination: React.FunctionComponent<
  PropsWithChildren<IPaginationProps>
> = ({ className, currentPage, handleChangePage, ...props }) => {
  return (
    <div className={cls("pagination", className)}>
      <ReactPaginate
        {...props}
        breakLabel={<button className="join-item btn">...</button>}
        nextLabel={
          <button className="join-item btn">
            <Icon iconName="chevronRight" size="4" />
          </button>
        }
        previousLabel={
          <button className="join-item btn">
            <Icon iconName="chevronLeft" size="4" />
          </button>
        }
        forcePage={currentPage - 1}
        onPageChange={(page) => {
          handleChangePage(page.selected + 1);
        }}
        onClick={(e) => {
          if (e.nextSelectedPage) handleChangePage(e.nextSelectedPage + 1);
        }}
        renderOnZeroPageCount={null}
        containerClassName="join"
        pageClassName="join-item"
        pageLinkClassName="btn rounded-none"
        activeLinkClassName="btn-active"
      />
    </div>
  );
};
