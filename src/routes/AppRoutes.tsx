import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";
import AppLayout from "../components/layout/AppLayout";
import { paths } from "./paths";

const Home = lazy(() => import("../pages/Home"));
const Search = lazy(() => import("../pages/Search"));
const Watch = lazy(() => import("../pages/Watch"));
const Library = lazy(() => import("../pages/Library"));
const NotFound = lazy(() => import("../pages/NotFound"));

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="watch/:id" element={<Watch />} />
        <Route
          path="library"
          element={<Navigate to={paths.library()} replace />}
        />
        <Route path="library/:collection" element={<Library />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
