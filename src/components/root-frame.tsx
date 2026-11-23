import { Outlet, useRouterState } from "@tanstack/react-router";
import { Shell } from "@/components/shell";

/**
 * Client review links open a clean, chrome-free page: a client should see the
 * before/after and the approve button, not the studio's tools and credits.
 */
export function RootFrame() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname.startsWith("/review/")) {
    return (
      <div className="min-h-dvh bg-bg text-fg">
        <Outlet />
      </div>
    );
  }
  return <Shell />;
}
