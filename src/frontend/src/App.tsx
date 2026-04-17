import { Layout } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { Suspense, lazy } from "react";

// Lazy-loaded pages
const LandingPage = lazy(() =>
  import("@/pages/LandingPage").then((m) => ({ default: m.LandingPage })),
);
const DetectPage = lazy(() =>
  import("@/pages/DetectPage").then((m) => ({ default: m.DetectPage })),
);

// Page loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center p-8">
      <Skeleton className="h-16 w-64 rounded-xl" />
      <Skeleton className="h-8 w-80 rounded-lg" />
      <Skeleton className="h-4 w-48 rounded-md" />
    </div>
  );
}

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      storageKey="dupeguard-theme"
    >
      <Outlet />
    </ThemeProvider>
  ),
});

// Landing page route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Layout noTopPadding>
      <Suspense fallback={<PageLoader />}>
        <LandingPage />
      </Suspense>
    </Layout>
  ),
});

// Detect page route
const detectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/detect",
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <DetectPage />
      </Suspense>
    </Layout>
  ),
});

// Router
const routeTree = rootRoute.addChildren([indexRoute, detectRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
