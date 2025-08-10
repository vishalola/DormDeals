import { useEffect, useState } from "react";
import styles from "./cart.module.scss";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import dustbin from "../assets/dustbin.png";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  // Fetch cart data
  const fetchCart = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart/${userId}`);
      setCartItems(response.data.cart.items || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart");
      setLoading(false);
    }
  };

  // Update quantity
  const updateQuantity = async (productId, newQuantity) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/cart/update`, {
        userId,
        productId,
        quantity: newQuantity
      });
      fetchCart(); // Refresh cart data
      toast.success("Cart updated");
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
    }
  };

  // Remove item from cart
  const removeItem = async (productId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/cart/remove`, {
        data: { userId, productId }
      });
      fetchCart(); // Refresh cart data
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/cart/clear`, {
        data: { userId }
      });
      setCartItems([]);
      toast.success("Cart cleared");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    }
  };

  // Calculate total
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.productId.pprice * item.quantity);
    }, 0);
  };

  // Checkout handler
  const handleCheckout = () => {
    toast.success("Proceeding to checkout");
    navigate("/checkout", { state: { userId } });
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      navigate("/login");
      return;
    }

    // Get user ID
    axios({
      method: "post",
      baseURL: `${process.env.REACT_APP_API_URL}`,
      url: "/api",
      data: { token }
    })
      .then(response => {
        setUserId(response.data.userid);
      })
      .catch(error => {
        console.error("Error getting user ID:", error);
        navigate("/login");
      });
  }, [navigate]);

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className={styles.cartPage}>
        <div className={styles.loading}>Loading your cart...</div>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <div className={styles.cartContainer}>
        <h1 className={styles.cartTitle}>Your Cart</h1>
        <Link to="/" className={styles.backLink}>← Continue Shopping</Link>

        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <p>Your cart is empty</p>
            <Link to="/" className={styles.shopButton}>Browse Products</Link>
          </div>
        ) : (
          <>
            <div className={styles.cartItems}>
              {cartItems.map((item) => (
                <div key={item.productId._id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img src={item.productId.pimage} alt={item.productId.pname} />
                  </div>
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemName}>{item.productId.pname}</h3>
                    <p className={styles.itemPrice}>₹{item.productId.pprice}</p>
                    <div className={styles.quantityControl}>
                      <button 
                        onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className={styles.itemActions}>
                    <button 
                      onClick={() => removeItem(item.productId._id)}
                      className={styles.removeButton}
                    >
                      <img src={dustbin} alt="Remove" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.cartSummary}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{calculateTotal()}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className={styles.summaryRowTotal}>
                <span>Total</span>
                <span>₹{calculateTotal()}</span>
              </div>

              <div className={styles.cartActions}>
                <button 
                  onClick={clearCart}
                  className={styles.clearCartButton}
                >
                  Clear Cart
                </button>
                <button 
                  onClick={handleCheckout}
                  className={styles.checkoutButton}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;