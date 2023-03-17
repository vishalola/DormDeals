import React, { useState } from "react";
import styles from "./Login.module.scss";
import { Link } from "react-router-dom";
import Design from "../components/Design/Design";
import axios from "axios";

function Register() {
  const [course, setCourse] = useState("B.Tech");
  const [Btech, setBtech] = useState(true);
  const [Mtech, setMtech] = useState(false);
  const [PhD, setPhD] = useState(false);
  const [data, setData] = useState({
    name: "",
    mail: "",
    year: "",
    address: "",
    phone: "",
    password: "",
    course: course,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios({
      method: "post",
      //   baseURL: `${process.env.REACT_APP_BASEURL}`,
      baseURL: "http://localhost:5000",
      url: "/api/register",
      data: data,
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log("jkanedkej");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  return (
    <div id="login" className={styles.login}>
      <Design />
      <div id={styles.loginFormContainer}>
        <p>SignUp</p>
        <form id={styles.loginForm} onSubmit={handleSubmit}>
          <input
            required
            type="text"
            name="name"
            value={data.name}
            placeholder="name"
            onChange={handleChange}
            autoComplete={"off"}
          />
          <input
            required
            type="email"
            name="mail"
            value={data.mail}
            placeholder="student mail ID"
            onChange={handleChange}
            autoComplete={"off"}
          />
          <div id={styles.checkboxes}>
            <label htmlFor="btech">
              <input
                type="radio"
                name="btech"
                onChange={(e) => {
                  setBtech(true);
                  setCourse("B.Tech");
                  setPhD(false);
                  setMtech(false);
                }}
                checked={Btech}
              />
              B.Tech
            </label>

            <label htmlFor="mtech">
              <input
                type="radio"
                name="mtech"
                onChange={(e) => {
                  setMtech(true);
                  setCourse("M.Tech");
                  setPhD(false);
                  setBtech(false);
                }}
                checked={Mtech}
              />
              M.Tech
            </label>

            <label htmlFor="phd">
              <input
                type="radio"
                name="phd"
                onChange={(e) => {
                  setPhD(true);
                  setCourse("PhD");
                  setBtech(false);
                  setMtech(false);
                }}
                checked={PhD}
              />
              Ph.D
            </label>
          </div>
          <input
            required
            type="number"
            name="year"
            value={data.year}
            placeholder="year"
            onChange={handleChange}
            autoComplete={"off"}
          />
          <input
            required
            type="text"
            name="address"
            value={data.address}
            placeholder="address"
            onChange={handleChange}
            autoComplete={"off"}
          />
          <input
            required
            type="number"
            name="phone"
            maxLength={10}
            minLength={10}
            placeholder="phone no."
            value={data.phone}
            onChange={handleChange}
            autoComplete={"off"}
          />
          <input
            required
            type="password"
            name="password"
            placeholder="password"
            minLength={8}
            maxLength={16}
            value={data.password}
            onChange={handleChange}
            autoComplete={"off"}
          />
          <span id={styles.registerHere}>
            already a user?{" "}
            <Link to="/login" style={{ color: "blue" }}>
              sign in
            </Link>
          </span>
          <button type="submit" onClick={handleSubmit}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
