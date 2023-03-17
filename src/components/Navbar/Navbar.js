import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.scss";

function Navbar() {
  return (
    <nav id={styles.navbar}>
      <div id={styles.navLogo}>buyNsell</div>
      <div id={styles.navLinks}>
        <div>
          <Link to="/login">Login</Link>
        </div>
        <div>
          <Link id={styles.registerNav} to="/register">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
