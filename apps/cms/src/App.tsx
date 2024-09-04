import toast, { Toaster } from "react-hot-toast";
import { I18nextProvider } from "react-i18next";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import {
  ActionFunction,
  LoaderFunction,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { DEFAULT_QUERY_OPTION } from "./config/constants";
import { GlobalErrorBoundary } from "./containers/common/GlobalErrorBoundary";
import { ProtectedRoute } from "./containers/common/ProtectedRoute";
import i18n from "./utils/translate";

interface RouteCommon {
  loader?: LoaderFunction;
  action?: ActionFunction;
  ErrorBoundary?: React.ComponentType<any>;
}

interface IRoute extends RouteCommon {
  path: string;
  Element: React.ComponentType<any>;
}

interface Pages {
  [key: string]: {
    default: React.ComponentType<any>;
  } & RouteCommon;
}

const pages: Pages = import.meta.glob("./pages/**/*.tsx", { eager: true });

const routes: IRoute[] = [];
for (const path of Object.keys(pages)) {
  const fileName = path.match(/\.\/pages\/(.*)\.tsx$/)?.[1];
  if (!fileName) {
    continue;
  }

  const normalizedPathName = fileName.includes("$")
    ? fileName.replace("$", ":")
    : fileName.replace(/\/index/, "");

  routes.push({
    path: fileName === "index" ? "/" : `/${normalizedPathName.toLowerCase()}`,
    Element: pages[path].default,
    loader: pages[path]?.loader as LoaderFunction | undefined,
    action: pages[path]?.action as ActionFunction | undefined,
    ErrorBoundary: pages[path]?.ErrorBoundary,
  });
}

const publicRoutes: string[] = ["/login", "/register"];

const router = createBrowserRouter([
  {
    errorElement: <GlobalErrorBoundary />,
    children: routes.map(({ Element, ErrorBoundary, ...rest }) => ({
      ...rest,
      element: publicRoutes.includes(rest.path) ? (
        <Element />
      ) : (
        <ProtectedRoute>
          <Element />
        </ProtectedRoute>
      ),
      ...(ErrorBoundary && { errorElement: <ErrorBoundary /> }),
    })),
  },
]);

// Create a client
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      const err = error as Array<ApiError>;
      toast.error(`Error: ${err[0].detail}`);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      const err = error as Array<ApiError>;
      toast.error(`Error: ${err[0].detail}`);
    },
  }),
  defaultOptions: {
    queries: {
      ...DEFAULT_QUERY_OPTION,
    },
  },
});

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </I18nextProvider>
  );
};

export default App;
