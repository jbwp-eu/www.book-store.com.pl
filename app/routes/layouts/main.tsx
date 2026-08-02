import { Outlet } from "react-router";
import type { Route } from "./+types/main";
import { SITE_DESCRIPTION, SITE_NAME } from "~/lib/site";

export function meta({}: Route.MetaArgs) {
  return [
    { title: SITE_NAME },
    { name: "description", content: SITE_DESCRIPTION },
  ];
}

const MainLayout = () => {
  return (
    <>
      <section className="max-w-6xl mx-auto px-6 my-8">
        <Outlet />
      </section>
    </>
  );
};

export default MainLayout;
