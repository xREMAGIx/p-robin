import Icon from "@cms/components/Icon";
import { server } from "@cms/config/server";
import { useBoundStore } from "@cms/stores/useBoundStore";
import { authQueryKeys } from "@cms/utils/query";
import type { PropsWithChildren } from "react";
import React, { Suspense, useRef, type HTMLAttributes } from "react";
import { useQuery } from "react-query";
import { NavLink, Navigate } from "react-router-dom";

const menuList = [
  {
    href: "/",
    label: "Dashboard",
  },
  {
    href: "/product",
    label: "Product",
  },
  {
    href: "/province",
    label: "Province",
  },
  {
    href: "/district",
    label: "District",
  },
];

export interface IProtectedRouteProps extends HTMLAttributes<HTMLDivElement> {}

export const ProtectedRoute: React.FunctionComponent<
  PropsWithChildren<IProtectedRouteProps>
> = ({ children }) => {
  //* Hooks
  const { authProfile, setAuthProfile, clearAuthProfile } = useBoundStore();

  //* States

  //* Refs
  const drawerToggleRef = useRef<HTMLInputElement>(null);

  //* Query
  const fetchQueryKey = authQueryKeys.profile();
  const { isFetching: isLoading } = useQuery({
    queryKey: fetchQueryKey,
    queryFn: async () => {
      const { data, error } = await server.api.auth.profile.get();

      if (error) {
        clearAuthProfile();
        throw error.value;
      }

      setAuthProfile(data);
    },
  });

  const handleLogout = async () => {
    const { error } = await server.api.auth.logout.post();

    if (error) {
      throw error.value;
    }

    clearAuthProfile();
  };

  if (isLoading)
    return (
      <div className="flex justify-center">
        <div className="loading loading-bars loading-md" />
      </div>
    );

  if (!authProfile) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="drawer lg:drawer-open">
      <input
        ref={drawerToggleRef}
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
      />
      <div className="drawer-content">
        {/* Page content here */}

        <div className="navbar bg-base-100">
          <div className="flex flex-1 gap-x-1">
            <label
              htmlFor="my-drawer"
              className="btn btn-circle drawer-button lg:hidden"
            >
              <Icon iconName="menu" />
            </label>
            <a className="btn btn-ghost text-xl">Robin</a>
          </div>
          <div className="flex-none gap-2">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <div className="w-full h-full rounded-full bg-accent flex justify-center items-center">
                  <span className="text-black">
                    {authProfile.username?.[0].toUpperCase()}
                  </span>
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a>Profile</a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li onClick={handleLogout}>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="px-4">
          <Suspense
            fallback={
              <div className="flex justify-center">
                <div className="loading loading-dots loading-md" />
              </div>
            }
          >
            {children}
          </Suspense>
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          {menuList.map((ele, idx) => (
            <li
              key={`${ele.label}-${idx}`}
              onClick={() => {
                if (drawerToggleRef.current)
                  drawerToggleRef.current.checked = false;
              }}
            >
              <NavLink
                to={ele.href}
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "active" : ""
                }
              >
                {ele.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
