import { NavLink } from "react-router";
import { Code2, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const base = "transition hover:text-blue-400";
  const active = "text-blue-400 font-semibold";

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <nav className="bg-gray-800 border-b border-gray-700 shadow-md sticky top-0 z-50 ">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-lg font-bold text-blue-300"
        >
          <Code2 className="text-blue-400 text-xl" />
          <span>My Portfolio</span>
        </NavLink>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <div className="space-x-4 text-sm text-gray-300">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? active : base)}
            >
              Home
            </NavLink>
            <NavLink
              to="/projects"
              className={({ isActive }) => (isActive ? active : base)}
            >
              Projects
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) => (isActive ? active : base)}
            >
              Blog
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? active : base)}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? active : base)}
            >
              Contact
            </NavLink>
          </div>
        </div>

        <div className="md:hidden flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-blue-400 text-xl cursor-pointer "
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-gray-800 border-t border-gray-700 px-6 py-4 space-y-2 space-x-4 text-center text-gray-300"
        >
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? active : base)}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) => (isActive ? active : base)}
            onClick={() => setMenuOpen(false)}
          >
            Projects
          </NavLink>
          <NavLink
            to="/blog"
            className={({ isActive }) => (isActive ? active : base)}
            onClick={() => setMenuOpen(false)}
          >
            Blog
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? active : base)}
            onClick={() => setMenuOpen(false)}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? active : base)}
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
