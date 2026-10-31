import { Suspense } from "react";
import { Outlet, useLocation, useMatch } from "react-router";
import { useSidebar } from "../../hooks/useSidebar";
import ErrorBoundary from "../common/ErrorBoundary";
import Spinner from "../common/Spinner";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const watchPage = Boolean(useMatch("/watch/:id"));
  const sidebar = useSidebar(watchPage);
  const location = useLocation();
  return (
    <div
      className={`app-shell ${watchPage ? "watch-layout" : ""} ${sidebar.collapsed ? "sidebar-collapsed" : ""}`}
    >
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar
        onToggleSidebar={sidebar.toggle}
        sidebarExpanded={sidebar.expanded}
      />
      <div className="app-body">
        {sidebar.drawerOpen && (
          <button
            type="button"
            className="sidebar-backdrop"
            aria-label="Close navigation"
            onClick={sidebar.close}
          />
        )}
        <Sidebar
          className={sidebar.drawerOpen ? "drawer-open" : ""}
          onNavigate={sidebar.close}
        />
        <main
          id="main-content"
          className="main-content"
          tabIndex={-1}
          key={`${location.pathname}${location.search}`}
        >
          <ErrorBoundary>
            <Suspense fallback={<Spinner label="Loading page" />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
