import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import styles from "./checkout.module.scss"; // your SCSS file

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: ""
  });

  // Fetch cart
  useEffect(() => {
    if (!userId) {
      toast.error("No user found");
      navigate("/cart");
      return;
    }

    axios.get(`${process.env.REACT_APP_API_URL}/api/cart/${userId}`)
      .then(res => {
        setCartItems(res.data.cart.items || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to load cart");
        setLoading(false);
      });
  }, [userId, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.productId.pprice * item.quantity);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.city || !formData.state || !formData.zip || !formData.phone) {
      toast.error("Please fill all fields");
      return;
    }

    axios.post(`${process.env.REACT_APP_API_URL}/api/orders`, {
      userId,
      items: cartItems,
      shipping: formData
    })
    .then(() => {
      toast.success("Order placed successfully!");
      navigate("/"); // redirect after order
    })
    .catch(err => {
      console.error(err);
      toast.error("Failed to place order");
    });
  };

  if (loading) {
    return (
      <div className={styles.checkoutPage}>
        <div className={styles.loading}>Loading checkout...</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className={styles.checkoutPage}>
        <div className={styles.emptyCart}>
          Your cart is empty
          <button onClick={() => navigate("/")}>Shop Now</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.checkoutContainer}>
        <div className={styles.checkoutGrid}>
          
          {/* Shipping Form */}
          <div className={styles.shippingSection}>
            <h2>Shipping Details</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>ZIP</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className={styles.submitButton}>
                Place Order
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className={styles.orderSummary}>
            <h2>Order Summary</h2>
            <div className={styles.orderItems}>
              {cartItems.map(item => (
                <div key={item.productId._id} className={styles.orderItem}>
                  <img src={item.productId.pimage} alt={item.productId.pname} />
                  <div className={styles.itemDetails}>
                    <h3>{item.productId.pname}</h3>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <div className={styles.itemTotal}>
                    ₹{item.productId.pprice * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.summaryTotals}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>₹{calculateTotal()}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className={styles.grandTotal}>
                <span>Total</span>
                <span>₹{calculateTotal()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;
