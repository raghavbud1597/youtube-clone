import { useEffect } from "react";

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} - YouTube Clone` : "YouTube Clone";
  }, [title]);
}
