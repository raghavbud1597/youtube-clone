import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useMediaQuery } from "./useMediaQuery";

export function useSidebar(watchPage: boolean) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const desktop = useMediaQuery("(min-width: 1100px)");

  useEffect(() => setDrawerOpen(false), [location.pathname, location.search]);

  useEffect(() => {
    if (!drawerOpen) return;
    document.querySelector<HTMLElement>("#sidebar a")?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        document
          .querySelector<HTMLElement>('[aria-controls="sidebar"]')
          ?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  function toggle() {
    if (desktop && !watchPage) {
      setCollapsed((value) => !value);
    } else setDrawerOpen((value) => !value);
  }

  return {
    collapsed,
    drawerOpen,
    toggle,
    close: () => setDrawerOpen(false),
    expanded: desktop && !watchPage ? !collapsed : drawerOpen,
  };
}
