//* Based on https://github.com/eelkevdbos/elysia-i18next

import { Context, Elysia, RouteSchema } from "elysia";
import lib, { InitOptions, i18n } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";

export type I18NextRequest = {
  i18n: i18n;
  translate: i18n["t"];
};

export type I18NextPluginOptions = {
  initOptions: InitOptions;
  detectLanguage: LanguageDetector;
  instance: null | i18n;
};

export type LanguageDetectorOptions = {
  storeParamName: string;
  searchParamName: string;
  headerName: string;
  cookieName: string;
  pathParamName: string;
};

export type LanguageDetector<
  T extends Context<RouteSchema> = Context<RouteSchema>
> = (ctx: T) => null | string | Promise<string | null>;

export function newLanguageDetector(
  opts: LanguageDetectorOptions
): LanguageDetector {
  return ({ set, request, params, store }) => {
    const url = new URL(request.url);

    const searchParamValue = url.searchParams.get(opts.searchParamName);
    if (searchParamValue) {
      return searchParamValue;
    }

    const cookie = set.cookie ? set.cookie[opts.cookieName] : null;
    if (cookie && cookie.value && typeof cookie.value === "string") {
      return cookie.value;
    }

    if (params && opts.pathParamName in params) {
      return params[opts.pathParamName];
    }

    if (opts.storeParamName in store) {
      // get opts.storeParamName from store
      return (store as Record<string, unknown>)[opts.storeParamName] as
        | string
        | null;
    }

    return request.headers.get(opts.headerName);
  };
}

const defaultOptions: I18NextPluginOptions = {
  instance: null,
  initOptions: {
    lng: "en",
    fallbackLng: "en",
    ns: ["error"],
  },
  detectLanguage: newLanguageDetector({
    searchParamName: "lang",
    storeParamName: "language",
    headerName: "accept-language",
    cookieName: "lang",
    pathParamName: "lang",
  }),
};

export const i18next = (userOptions?: Partial<I18NextPluginOptions>) => {
  const options: I18NextPluginOptions = {
    ...defaultOptions,
    ...userOptions,
  };

  const _instance = options.instance || lib;

  return new Elysia({ name: "i18next", seed: userOptions })
    .derive({ as: "global" }, async () => {
      if (!_instance.isInitialized) {
        await _instance
          .use(
            resourcesToBackend(
              (language: string, namespace: string) =>
                import(`../locales/${language}/${namespace}.json`)
            )
          )
          .init({ ...options.initOptions });
      }
      return { i18n: _instance, translate: _instance.t };
    })
    .onBeforeHandle({ as: "global" }, async (ctx) => {
      const lng = await options.detectLanguage(ctx);
      if (lng) {
        await _instance.changeLanguage(lng);
      }
    });
};
