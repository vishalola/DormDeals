import styles from "./Home.module.scss";
import { Link } from "react-router-dom";
import search from "../assets/search.svg";
import table from "../assets/table.svg";
import cycle from "../assets/bicycle.svg";
import setsquare from "../assets/setsquare.svg";
import chair from "../assets/chair.svg";
import coat from "../assets/coat.svg";
import all from "../assets/all.svg";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card/Card";

function Home() {
  const [allProd, setAllProd] = useState([]);
  const [disProd, setDisProd] = useState([]);
  const [valid, setValid] = useState(false);
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    axios({
      method: "post",
      baseURL: "http://localhost:5000",
      url: "/api",
      data: { token: token },
    })
      .then(function (response) {
        setValid(true);
      })
      .catch(function (error) {
        console.log(error);
        console.log("error caught in frontend from backend");
      });
    axios({
      method: "post",
      baseURL: "http://localhost:5000",
      url: "/api/allprod",
      data: {},
    })
      .then(function (response) {
        setAllProd(response.data.details);
        setDisProd(response.data.details);
      })
      .catch(function (error) {
        console.log(error);
        console.log("error caught in frontend from backend");
      });
  }, []);

  const colorArray = [
    "#e1fff8",
    "#cefff4",
    "#d2f8fa",
    "#cefff4",
    "#bdfff1",
    "#d6cfff",
  ];
  const images = [table, cycle, setsquare, chair, coat, all];
  const [category, setCategory] = useState("all");
  const catId = ["table", "cycle", "drafter", "chair", "coat", "all"];
  const handleDisProd = (id) => {
    if (id === "all") {
      setDisProd(allProd);
      return;
    }
    const result = [];
    allProd.forEach((ele) => {
      if (ele.pcat === id) {
        result.push(ele);
      }
    });
    setDisProd(result);
  };
  return (
    <>
      <nav id={styles.navbar}>
        <div id={styles.navLogo}>buyNsell</div>
        <div id={styles.searchBox}>
          <input placeholder="I am looking for ..." />
          <span>
            <img src={search} alt="search" />
          </span>
        </div>
        {valid ? (
          <div id={styles.navLinks}>
            <div>
              <Link to="/sell">Sell</Link>
            </div>
            <div>
              <Link id={styles.registerNav} to="/profile">
                Profile
              </Link>
            </div>
          </div>
        ) : (
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
        )}
      </nav>
      <div id="home" className={styles.homePage}>
        <div id={styles.categories}>
          {images.map((element, index) => {
            return (
              <div
                key={index}
                className={styles.bannerImg}
                style={{ background: `${colorArray[index]}` }}
              >
                <img
                  id={catId[index]}
                  onClick={(e) => {
                    const id = e.target.id;
                    setCategory(id);
                    handleDisProd(id);
                  }}
                  src={images[index]}
                  alt={`${images[index]}`}
                />
              </div>
            );
          })}
        </div>
        <div id={styles.productTitle}>
          <span>Products : {category}</span>
        </div>
        <div id={styles.productsContainer}>
          {disProd.map((ele, ind) => {
            return <Card key={ind} ele={ele} />;
          })}
        </div>
      </div>
    </>
  );
}

export default Home;
