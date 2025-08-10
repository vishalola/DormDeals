import React, { useState } from "react";
import { useEffect } from "react";
import styles from "./Product.module.scss";
import axios from "axios";
import { Link } from "react-router-dom";
import search from "../assets/search.svg";
import { LoaderIcon, toast } from "react-hot-toast";

function Product() {
  const [notification, setNotification] = useState(false);
  const [loading, setLoading] = useState(true);
  const [prodExist, setProdExist] = useState(false);
  const [id, setId] = useState("");
  const [isMyProd, setIsMyProd] = useState(false);
  const [valid, setValid] = useState(false);
  const [sname, setSname] = useState("");
  const [smail, setSmail] = useState("");
  const [sphone, setPhone] = useState("");
  const [data, setData] = useState({
    sname: "",
    _id: "314",
    id: "",
    sellerId: "",
    pname: "NAME",
    pprice: 0,
    pdetail:
      "KSEMFJKLERFN OEJFOEJFEF:E FO JFEHFUIFHFUIFYEFNIUFY ksffnrnfk shurf smfifr n0f jhuf fbf iufefnviu fn  yvyrvrjhg iurfhr wjhrwuifrwu fhrwif yfk viyrbyurwnrkjh rwif ryw rifrwhuivwr iwrfhoqo eldmnkdjcalefn vourlksfnvuhf h feuf fnejf hiqjdnkehfean kjiofjeafjief oefeijf ",
    pdate: "2020-20-20",
    pimage: "HI",
    pcat: "CYCLE",
    preg: "2932-23-21",
    __v: 0,
  });
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

  useEffect(() => {
    const href = window.location.href.split("/");
    const ppid = href[href.length - 1];
    const token = JSON.parse(localStorage.getItem("token"));

    axios({
      method: "post",
      baseURL: `${process.env.REACT_APP_API_URL}`,
      url: "/api",
      data: { token: token },
    })
      .then(function (response) {
        const myid = response.data.userid;
        setId(myid);
        setValid(true);
        axios({
          method: "post",
          baseURL: `${process.env.REACT_APP_API_URL}`,
          url: "/api/prodData",
          data: { id: ppid },
        })
          .then(function (response) {
            if (response.data.details.data.id.toString() === myid) {
              setIsMyProd(true);
            } else {
              setIsMyProd(false);
            }
            setData(response.data.details.data);
            setSname(response.data.details.name);
            setSmail(response.data.details.mail);
            setPhone(response.data.details.phone);
            setLoading(false);
            setProdExist(true);
          })
          .catch(function (error) {
            setLoading(false);
            console.log(error);
          });
        setNotificationData(response.data.allNotifications);
      })
      .catch((err) => {
        console.log(err);
        setValid(false);
      });

    axios({
      method: "post",
      baseURL: `${process.env.REACT_APP_API_URL}`,
      url: "/api/prodData",
      data: { id: ppid },
    })
      .then(function (response) {
        if (response.data.details.data.id.toString() === id) {
          setIsMyProd(true);
        } else {
          setIsMyProd(false);
        }
        setData(response.data.details.data);
        setSname(response.data.details.name);
        setSmail(response.data.details.mail);
        setLoading(false);
        setProdExist(true);
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error);
      });
  }, []);

  const handleAddToCart = () => {
    axios({
      method: "post",
      baseURL: `${process.env.REACT_APP_API_URL}`,
      url: "/api/cart/add",
      data: {
        userId: id,
        productId: data._id,
        quantity: 1
      }
    })
    .then(function (response) {
      toast.success("Product added to cart!");
    })
    .catch(function (error) {
      console.log(error);
      toast.error("Failed to add to cart");
    });
  };

  return (
    <>
      {notification ? (
        notificationData.length === 0 ? (
          <>
            <div className={styles.noNotificationContainer}>
              No Notifications
            </div>
            <div
              className={styles.bgNotification}
              onClick={() => {
                setNotification(false);
              }}
            />
          </>
        ) : (
          <>
            <div className={styles.notificationContainer}>
              {notificationData.map((ele) => {
                return (
                  <div className="flex flex-row">
                    <Link
                      key={ele.prodId}
                      to={ele.href}
                      className={styles.notifEl}
                    >
                      <img src={ele.imageURL} alt="product" />

                      <p>
                        {ele.reg} wants to buy your {ele.pname} for Rs.{" "}
                        {ele.bprice}
                      </p>
                    </Link>
                    <button
                      className={styles.crossNotifi}
                      value={`${ele.prodId}-${ele.bid}`}
                      onClick={(e) => {
                        const data = e.target.value.split("-");
                        console.log("NETETR");
                        setNotification(false);
                        const prodid = data[0];
                        const bid = data[1];
                        toast.loading("Processing", { duration: 2000 });
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
                      }}
                    >
                      X
                    </button>
                  </div>
                );
              })}
            </div>
            <div
              className={styles.bgNotification}
              onClick={() => {
                setNotification(false);
              }}
            />
          </>
        )
      ) : (
        ""
      )}
      <nav id={styles.navbar}>
        <div id={styles.navLogo}>DormDeals</div>
        {valid ? (
          <div id={styles.navLinks}>
            <div
              onClick={() => {
                setNotification((prev) => !prev);
              }}
              style={{ cursor: "pointer" }}
            >
              Notification
            </div>
            <div>
              <Link to="/sell">Sell</Link>
            </div>
            <div>
              <Link to="/cart">Cart</Link>
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
      {!prodExist ? (
        <div className={styles.loadingIcon}>
          404 Error | Product Doesn&apos;t exist
        </div>
      ) : (
        <>
          <div id={styles.productInformation}>
            <div id={styles.imageContainer}>
              <img src={data.pimage} id={styles.pimage} alt={data.pname} />
            </div>
            <div id={styles.productInfocon}>
              <div>
                <p id={styles.pname}>{data.pname}</p>
                <p id={styles.pcat}> {data.pcat}</p>
                <p id={styles.pdetail}>{data.pdetail}</p>
                <p className={styles.pbought}>
                  bought on : {data.pdate.slice(0, 10)}
                </p>
                <p className={styles.pbought}>
                  sold by : {sname} {valid ? smail : ""}
                </p>
                {valid ? (
                  <p className={styles.pbought}>phone : {sphone}</p>
                ) : (
                  ""
                )}
              </div>
              <div className={styles.pricecon}>
                <div id={styles.pprice}>Rs.{data.pprice}/-</div>
                { valid ? (
                  isMyProd ? (
                    <div></div>
                  ) : (
                    <button
                      className={styles.addBidButton}
                      onClick={handleAddToCart}
                    >
                      Add to Cart
                    </button>
                  )
                ) : (
                  <p>login to add to cart</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Product;