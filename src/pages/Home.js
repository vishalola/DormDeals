import styles from "./Home.module.scss";
import Navbar from "../components/Navbar/Navbar";
import setsquare from "../assets/setsquare.svg";
import search from "../assets/search.svg";
import table from "../assets/table.svg";
import cycle from "../assets/cycle.svg";

function Home() {
  const colorArray = ["#e1fff8", "#cefff4", "#bdfff1"];
  const images = [setsquare, table, cycle];

  return (
    <>
      <Navbar />
      <div id="home" className={styles.homePage}>
        <div id={styles.homeBanner}>
          {images.map((ele, ind) => {
            return (
              <div
                key={ind}
                className={styles.bannerImgBox}
                style={{ background: colorArray[ind] }}
              >
                <div>
                  <img src={images[ind]} alt="setsquare" />
                </div>
              </div>
            );
          })}
        </div>
        <div id={styles.searchBox}>
          <input placeholder="I am looking for ..." />
          <span>
            <img src={search} alt="search" />
          </span>
        </div>
        <div id={styles.productsContainer}></div>
      </div>
    </>
  );
}

export default Home;
