import React, { useEffect, useState } from "react";
import styles from "./Login.module.scss";
import { Link } from "react-router-dom";
import Design from "../components/Design/Design";
import { toast } from "react-hot-toast";
import axios from "axios";
import mailsent from "../assets/mailsent.jpg";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const [course, setCourse] = useState("IPM");
  const [IPM, setIPM] = useState(true);
  const [IPL, setIPL] = useState(false);
  const [PhD, setPhD] = useState(false);
  const [data, setData] = useState({
    name: "",
    mail: "",
    year: "",
    address: "",
    phone: "",
    password: "",
    course: "",
  });

  useEffect(() => {
    setData((prev) => {
      return { ...prev, course: course };
    });
  }, [course]);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (data.name === "") {
      toast.error("Name field required!");
      return;
    }
  
    if (data.year === "") {
      toast.error("Please enter which year you're from!");
      return;
    }
  
    if (data.address === "") {
      toast.error("Address field required!");
      return;
    }
  
    if (data.phone === "") {
      toast.error("Phone no. field is required!");
      return;
    }
  
    if (data.phone <= 1000000000 || data.phone >= 9999999999) {
      toast.error("Please enter valid phone no.!");
      return;
    }
  
    if (data.password.length < 8) {
      toast.error("Password should be 8 characters long!");
      return;
    } else {
      toast.loading("Processing", { duration: 5000 });
      axios({
        method: "post",
        baseURL: `${process.env.REACT_APP_API_URL}`,
        url: "/api/register",
        data: data,
      })
        .then(function (response) {
            toast.success("Account Registered");
            localStorage.setItem(
              "token",
              JSON.stringify(response.data.refreshToken)
            );
            navigate("/");
        })
        .catch(function (error) {
          console.log(error);
        });
    }
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
                <label htmlFor="ipm">
                  <input
                    type="radio"
                    name="ipm"
                    onChange={(e) => {
                      setIPM(true);
                      setCourse("IPM");
                      setPhD(false);
                      setIPL(false);
                    }}
                    checked={IPM}
                  />
                 IPM
                </label>

                <label htmlFor="ipl">
                  <input
                    type="radio"
                    name="ipl"
                    onChange={(e) => {
                      setIPL(true);
                      setCourse("IPL");
                      setPhD(false);
                      setIPM(false);
                    }}
                    checked={IPL}
                  />
                  IPL
                </label>

                <label htmlFor="phd">
                  <input
                    type="radio"
                    name="phd"
                    onChange={(e) => {
                      setPhD(true);
                      setCourse("PhD");
                      setIPM(false);
                      setIPL(false);
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
                required={true}
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
                required={true}
                type="password"
                name="password"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
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
