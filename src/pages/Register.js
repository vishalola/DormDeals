import React from "react";
import styles from "./Login.module.scss";
import { Link } from "react-router-dom";
import Design from "../components/Design/Design";

function Register() {
  return (
    <div id="login" className={styles.login}>
      <Design />
      <div id={styles.loginFormContainer}>
        <p>SignUp</p>
        <form id={styles.loginForm}>
          <input type="text" placeholder="name" />
          <input type="text" placeholder="student mail ID" />
          <div id={styles.checkboxes}>
            <label for="btech">
              <input type="radio" name="btech" value="btech" /> B.Tech
            </label>

            <label for="mtech">
              <input type="radio" name="mtech" value="mtech" />
              M.Tech
            </label>

            <label for="phd">
              <input type="radio" name="phd" value="phd" />
              PhD
            </label>
          </div>
          <input type="number" placeholder="year" />
          <input type="text" placeholder="address" />
          <input type="number" placeholder="phone no." />
          <input type="password" placeholder="password" />
          <span id={styles.registerHere}>
            already a user? sign in{" "}
            <Link to="/login" style={{ color: "blue" }}>
              here
            </Link>
          </span>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
