import styles from "./Home.module.scss";
import Navbar from "../components/Navbar/Navbar";

function Home() {
  return (
    <>
      <Navbar />
      <div id="home" className={styles.homePage}></div>;
    </>
  );
}

export default Home;
