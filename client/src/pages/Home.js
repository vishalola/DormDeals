import styles from "./Home.module.scss";
import { Link } from "react-router-dom";
import search from "../assets/search.svg";
import cycle from "../assets/bicycle.svg";
import setsquare from "../assets/setsquare.svg";
import chair from "../assets/chair.svg";
import coat from "../assets/coat.svg";
import all from "../assets/all.svg";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card/Card";
import { LoaderIcon, toast } from "react-hot-toast";

function Home() {
  const [loading, setLoading] = useState(true);
  const [searchval, setsearchval] = useState("");
  const [allProd, setAllProd] = useState([]);
  const [notificationData, setNotificationData] = useState(
    Array({
      prodId: "",
      href: "",
      imageURL: "",
      reg: 0,
      pname: "",
      bprice: 0,
      cancel: false,
      bid: "",
    })
  );
  const [disProd, setDisProd] = useState([]);
  const [valid, setValid] = useState(false);
  
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    axios({
      method: "post",
      baseURL: `${process.env.REACT_APP_API_URL}`,
      url: "/api",
      data: { token: token },
    })
      .then(function (response) {
        setValid(true);
        setNotificationData(response.data.allNotifications);
        console.log(response.data.allNotifications);
      })
      .catch(function (error) {
        console.log(error);
        console.log("error caught in frontend from backend");
      });
    
    axios({
      method: "post",
      baseURL: `${process.env.REACT_APP_API_URL}`,
      url: "/api/allprod",
      data: {},
    })
      .then(function (response) {
        setAllProd(response.data.details);
        setDisProd(response.data.details);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
        console.log("error caught in frontend from backend");
      });
  }, []);

  const [notification, setNotification] = useState(false);
  const images = [cycle, setsquare, chair, coat, all];
  const [category, setCategory] = useState("all");
  const catId = ["cycle", "drafter", "chair", "coat", "all"];
  const categoryNames = ["Bicycles", "Study Tools", "Furniture", "Clothing", "All Items"];
  const categoryDescriptions = [
    "Find great deals on bikes and cycling gear",
    "Drafting tools, calculators, and study supplies",
    "Chairs, desks, and dorm furniture",
    "Clothes, jackets, and accessories",
    "Browse all available items"
  ];
  
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

  const handleSearch = () => {
    console.log("Clicked");
    axios({
      method: "post",
      baseURL: `${process.env.REACT_APP_API_URL}`,
      url: "/api/searchproduct",
      data: { searchval: searchval },
    })
      .then(function (response) {
        setAllProd(response.data.mysearchdata);
        setDisProd(response.data.mysearchdata);
      })
      .catch(function (error) {
        toast.error("Internal Error");
        console.log(error);
      });
  };

  const handleCancelNotification = (e) => {
    const data = e.target.value.split("-");
    console.log("NETETR");
    setNotification(false);
    const prodid = data[0];
    const bid = data[1];
    toast.loading("Processing", { duration: 4000 });
    toast.success("Removed notification successfully");
    axios({
      method: "post",
      baseURL: `${process.env.REACT_APP_API_URL}`,
      url: "/api/cancelnotification",
      data: { prodid, bid },
    })
      .then(function (response) {
        setNotificationData(response.data.allNotifications);
      })
      .catch(function (error) {
        toast.error("Internal Error");
        console.log(error);
      });
  };

  return (
    <>
      {/* Notification Modal */}
      {notification ? (
        notificationData.length === 0 ? (
          <>
            <div className={styles.noNotificationContainer}>
              📬 No Notifications
            </div>
            <div
              className={styles.bgNotification}
              onClick={() => setNotification(false)}
            />
          </>
        ) : (
          <>
            <div className={styles.notificationContainer}>
              {notificationData.map((ele) => (
                <div key={ele.prodId} className="flex flex-row">
                  <Link to={ele.href} className={styles.notifEl}>
                    <img src={ele.imageURL} alt="product" />
                    <p>
                      {ele.reg} wants to buy your {ele.pname} for Rs.{" "}
                      {ele.bprice}
                    </p>
                  </Link>
                  <button
                    className={styles.crossNotifi}
                    value={`${ele.prodId}-${ele.bid}`}
                    onClick={handleCancelNotification}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div
              className={styles.bgNotification}
              onClick={() => setNotification(false)}
            />
          </>
        )
      ) : null}

      {/* Navigation */}
      <nav id={styles.navbar}>
        <div id={styles.navLogo}>
          <span className={styles.logoIcon}>🏠</span>
          DormDeals
        </div>
        <div id={styles.searchBox}>
          <input
            value={searchval}
            onChange={(e) => setsearchval(e.target.value)}
            placeholder="Search for items..."
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <span onClick={handleSearch}>
            <img src={search} alt="search" />
          </span>
        </div>
        {valid ? (
          <div id={styles.navLinks}>
            <button
              className={styles.navButton}
              onClick={() => setNotification((prev) => !prev)}
            >
              🔔 Notifications
              {notificationData.length > 0 && (
                <span className={styles.notificationBadge}>
                  {notificationData.length}
                </span>
              )}
            </button>
            <Link to="/sell" className={styles.navLink}>Sell</Link>
            <Link to="/cart" className={styles.navLink}>Cart</Link>
            <Link to="/profile" className={styles.navLink}>Profile</Link>
          </div>
        ) : (
          <div id={styles.navLinks}>
            <Link to="/login" className={styles.navLink}>Log in</Link>
            <Link to="/register" className={styles.navLinkPrimary}>Sign up</Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className={styles.homePage}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Turn Dorm Waste Into <span className={styles.highlight}>Campus Gold!</span>
            </h1>
            <p className={styles.heroDescription}>
              Buy and sell items within your college community, or donate what you no longer need.
            </p>
            <div className={styles.heroButtons}>
              <button 
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => {
                  setCategory("all");
                  handleDisProd("all");
                  document.getElementById('featured-items')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                🛍️ Browse
              </button>
              <Link to="/sell" className={`${styles.btn} ${styles.btnSecondary}`}>
                💰 Sell
              </Link>
              <Link to="/sell" className={`${styles.btn} ${styles.btnSecondary}`}>
              💝 Donate
              </Link>
            </div>
          </div>
          <div className={styles.heroIllustration}>
            <div className={styles.floatingIcons}>
              <div className={`${styles.iconItem} ${styles.icon1}`}>🚲</div>
              <div className={`${styles.iconItem} ${styles.icon2}`}>📚</div>
              <div className={`${styles.iconItem} ${styles.icon3}`}>💡</div>
              <div className={`${styles.iconItem} ${styles.icon4}`}>🪑</div>
              <div className={`${styles.iconItem} ${styles.icon5}`}>💻</div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className={styles.categoriesSection}>
          <h2 className={styles.sectionTitle}>Browse by Category</h2>
          <div className={styles.categories}>
            {images.map((element, index) => (
              <div
                key={index}
                className={`${styles.categoryCard} ${
                  category === catId[index] ? styles.activeCategory : ""
                }`}
                onClick={() => {
                  setCategory(catId[index]);
                  handleDisProd(catId[index]);
                }}
              >
                <div className={styles.categoryIcon}>
                  <img src={element} alt={categoryNames[index]} />
                </div>
                <h3 className={styles.categoryTitle}>{categoryNames[index]}</h3>
                <p className={styles.categoryDescription}>
                  {categoryDescriptions[index]}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Items Section */}
        <section id="featured-items" className={styles.featuredSection}>
          <div className={styles.featuredHeader}>
            <h2 className={styles.sectionTitle}>
              {category === "all" ? "Featured Items" : `${categoryNames[catId.indexOf(category)]}`}
            </h2>
            <p className={styles.sectionSubtitle}>
              {disProd.length} {disProd.length === 1 ? 'item' : 'items'} available
            </p>
          </div>
          
          <div className={styles.productsContainer}>
            {!loading ? (
              disProd.length > 0 ? (
                disProd.map((ele, ind) => (
                  <Card key={ind} ele={ele} />
                ))
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>📦</div>
                  <h3>No items found</h3>
                  <p>Try browsing a different category or adjusting your search.</p>
                  <button 
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={() => {
                      setCategory("all");
                      handleDisProd("all");
                    }}
                  >
                    View All Items
                  </button>
                </div>
              )
            ) : (
              <div className={styles.loadingContainer}>
                <LoaderIcon />
                <p>Loading amazing deals...</p>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2>Ready to Start Dealing?</h2>
            <p>Join thousands of students already saving money and reducing waste.</p>
            <div className={styles.ctaButtons}>
              {!valid ? (
                <>
                  <Link to="/register" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge}`}>
                    Get Started
                  </Link>
                  <Link to="/login" className={`${styles.btn} ${styles.btnSecondary} ${styles.btnLarge}`}>
                    Sign In
                  </Link>
                </>
              ) : (
                <Link to="/sell" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge}`}>
                  Start Selling
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;