import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { paths } from "../routes/paths";

export function useSearch() {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const query = location.pathname === "/search" ? (params.get("q") ?? "") : "";
  const [value, setValue] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setValue(query), [query]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      navigate(paths.search(trimmed));
      inputRef.current?.blur();
    } else inputRef.current?.focus();
  }

  function clear() {
    setValue("");
    inputRef.current?.focus();
  }

  return { value, setValue, inputRef, submit, clear };
}
