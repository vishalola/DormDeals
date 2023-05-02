import React, { useEffect, useState } from "react";
import styles from "./FixDeal.module.scss";
import axios from "axios";
import { toast } from "react-hot-toast";
import { redirect, useNavigate } from "react-router-dom";

function FixDeal() {
  const [data, setData] = useState({
    pimage:
      "data:image/jpeg;base64,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",
    buyername: "LKAEE",
    pname: "AEMFNE",
    mail: "lfekfeflkfmelf@MFEAKLFME.com",
    bidprice: "2222",
    productprice: "22222",
  });

  const navigate = useNavigate();

  const [percentage, setPercentage] = useState(0);
  const [ID, setID] = useState({ productid: "", sellerid: "", buyerid: "" });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const href = window.location.href.split("/");
    const len = href.length;
    const productid = href[len - 3];
    const sellerid = href[len - 2];
    const buyerid = href[len - 1];
    setID({ productid, sellerid, buyerid });
    axios({
      method: "post",
      baseURL: "http://localhost:5000",
      url: "/api/fixdeal",
      data: { productid, sellerid, buyerid },
    })
      .then(function (response) {
        setLoading(false);
        toast.success("fetched data successfully");
        setData(response.data.fixdeal);
        const percentHigher = (
          ((response.data.fixdeal.bidprice -
            response.data.fixdeal.productprice) /
            response.data.fixdeal.bidprice) *
          100
        ).toFixed(2);

        setPercentage(percentHigher);
        console.log(response.data.fixdeal);
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Internal Error");
        console.log("error caught in frontend from backend");
        navigate("/");
      });
  }, []);

  const handleClick = () => {
    toast.loading("Processing", {
      duration: 5000,
    });
    axios({
      method: "post",
      baseURL: "http://localhost:5000",
      url: "/api/confirmdeal",
      data: {
        productid: ID.productid,
        sellerid: ID.sellerid,
        mail: data.mail,
        productname: data.pname,
        bprice: data.bidprice,
      },
    })
      .then(function (response) {
        toast.success("An Email was sent! Happy shopping!");
        navigate("/");
      })
      .catch(function (error) {
        toast.error("Internal Error");
      });
  };
  return (
    <div className={styles.fixdealPage}>
      {loading ? (
        <p>Loading</p>
      ) : (
        <>
          <div>
            <img src={data.pimage} alt="" />{" "}
          </div>
          <div className={styles.fixdealinfo}>
            <p>
              {data.buyername} ({data.mail}) wants to buy {data.pname} for
              {" Rs."}
              {data.bidprice}
            </p>
            <div className="flex flex-row" id={styles.fixbuttons}>
              <div className="flex flex-col">
                <p>Bid Price</p>
                <p>{data.bidprice}</p>
              </div>
              <div className="flex flex-col">
                <p>Actual Price</p>
                <p>{data.productprice}</p>
              </div>
              <button onClick={handleClick}>Fix Deal</button>
            </div>
            <p>The bid price is {percentage} % more than product price.</p>
          </div>
        </>
      )}
    </div>
  );
}

export default FixDeal;
