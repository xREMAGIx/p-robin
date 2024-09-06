import { TOAST_SUCCESS_MESSAGE_CODE } from "@cms/config/constants";
import { server } from "@cms/config/server";
import { useBoundStore } from "@cms/stores/useBoundStore";
import React, { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";

type LoginForm = {
  username: string;
  password: string;
};

const Login: React.FunctionComponent = () => {
  //* Hooks
  const { t } = useTranslation(["common"]);

  //* Stores
  const { authProfile, setAuthProfile } = useBoundStore();

  //* States
  const [isLoading, setIsLoading] = useState(false);

  //* Hook-form
  const methods = useForm<LoginForm>();

  //* React-query

  //* Functions
  const handleSubmit = async (form: LoginForm) => {
    setIsLoading(true);
    const { data, error } = await server.api.auth.login.post({
      username: form.username,
      password: form.password,
    });
    setIsLoading(false);

    if (error) {
      const err = error.value.errors[0];
      toast.error(err.detail);
      return;
    }

    setAuthProfile(data.data);
    methods.reset();
    toast.success(t(TOAST_SUCCESS_MESSAGE_CODE.LOGIN, { ns: "common" }));
  };

  if (authProfile) return <Navigate to="/" />;

  return (
    <div className="login w-screen h-screen flex justify-center items-center">
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <FormProvider {...methods}>
          <form
            className="card-body"
            onSubmit={methods.handleSubmit(handleSubmit)}
          >
            <div className="form-control">
              <Controller
                name="username"
                defaultValue={""}
                rules={{
                  required: true,
                }}
                render={({ field, fieldState: { error } }) => (
                  <label className="input input-bordered flex items-center gap-2">
                    Username
                    <input
                      {...field}
                      type="text"
                      className="grow"
                      placeholder="username"
                    />
                    {error?.message && (
                      <span className="mt-2 text-error">{error?.message}</span>
                    )}
                  </label>
                )}
              />
            </div>
            <div className="form-control">
              <Controller
                name="password"
                defaultValue={""}
                rules={{
                  required: true,
                }}
                render={({ field, fieldState: { error } }) => (
                  <label className="mt-2 input input-bordered flex items-center gap-2">
                    Password
                    <input
                      {...field}
                      type="password"
                      className="grow"
                      placeholder="password"
                    />
                    {error?.message && (
                      <span className="mt-2 text-error">{error?.message}</span>
                    )}
                  </label>
                )}
              />
            </div>
            <button disabled={isLoading} className="mt-6 btn btn-primary">
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default Login;
