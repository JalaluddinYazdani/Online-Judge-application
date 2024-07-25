import React from "react";
import "bootstrap/dist/css/bootstrap.css";
const Navbar = () => {
  return (
    <>
      <nav className="navbar bg-primary navbar-expand-lg" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand text-white" href="/">
            Online Judge
          </a>
          <div className="navbar-nav me-auto ">
            <a className="nav-link text-white" href="/problems">
              Problems
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;