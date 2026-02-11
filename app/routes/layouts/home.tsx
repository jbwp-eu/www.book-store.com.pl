import { Outlet } from "react-router";
import Hero from "~/components/Hero";

const HomeLayout = () => {
  return (
    <>
      <Hero
        name="Jarek"
        text="I am a full-stack developer and can create amazing web applications "
      />
      <section className="max-w-6xl mx-auto px-6 my-8">
        <Outlet />
      </section>
    </>
  );
};

export default HomeLayout;
