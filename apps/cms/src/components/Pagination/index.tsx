import cls from "classnames";
import type { PropsWithChildren } from "react";
import React from "react";
import ReactPaginate, { ReactPaginateProps } from "react-paginate";
import Icon from "../Icon";

export interface IPaginationProps extends ReactPaginateProps {}

export const Pagination: React.FunctionComponent<
  PropsWithChildren<IPaginationProps>
> = ({ className, ...props }) => {
  return (
    <div className={cls("pagination", className)}>
      <ReactPaginate
        breakLabel={<button className="join-item btn">...</button>}
        nextLabel={
          <button className="join-item btn">
            <Icon iconName="chevronRight" size="4" />
          </button>
        }
        pageRangeDisplayed={5}
        previousLabel={
          <button className="join-item btn">
            <Icon iconName="chevronLeft" size="4" />
          </button>
        }
        renderOnZeroPageCount={null}
        containerClassName="join"
        pageClassName="join-item btn"
        activeClassName="btn-active"
        {...props}
      />
      {/* <div className="join">
          <button className="join-item btn">1</button>
          <button className="join-item btn">2</button>
          <button className="join-item btn">...</button>

          <button className="join-item btn">99</button>
          <button className="join-item btn">100</button>
        </div> */}
    </div>
  );
};
