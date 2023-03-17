import React from "react";
import Design from "../components/Design/Design";
import styles from "./Login.module.scss";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div id="login" className={styles.login}>
      <Design />
      <div id={styles.loginFormContainer}>
        <p>Sign In</p>
        <form id={styles.loginForm}>
          <input type="text" placeholder="username" />
          <input
            type="password"
            placeholder="password"
            minLength={8}
            maxLength={16}
          />
          <span id={styles.registerHere}>
            not a user?{" "}
            <Link to="/register" style={{ color: "blue" }}>
              sign up
            </Link>
          </span>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
