const User = require("../models/user");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const Product = require("../models/products");
const Bid = require("../models/bid");
const jwt = require("jsonwebtoken");
const UserToken = require("../models/userToken");
const verifyRefreshToken = require("../utils/verifyRefreshToken");
const generateTokens = require("../utils/generateToken.js");

const login = async (req, res) => {
  try {
    const user = await User.findOne({ mail: req.body.mail });
    if (!user) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    // Generate and store tokens
    const { accessToken, refreshToken } = await generateTokens(user);

    res.status(200).send({
      message: "Logged in successfully",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.mail,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};


const register = async (req, res) => {
    try {
        const { name, mail, year, address, phone, password, course } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ mail });
        if (existingUser) {
            return res.status(400).json({ error: true, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        // Create user
        const newUser = await User.create({ name, mail, year, address, phone, password:hashedPassword, course });

        // Generate tokens
        const { accessToken, refreshToken } = await generateTokens(newUser);

        // Optionally store refresh token in DB
        newUser.refreshToken = refreshToken;
        await newUser.save();

        return res.status(201).json({
            error: false,
            message: "User registered and logged in successfully",
            accessToken,
            refreshToken,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.mail
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: true, message: "Server error" });
    }
};


const verify = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });

    await User.updateOne({ _id: user._id }, { verified: true });
    await Token.deleteOne({ userId: user._id });

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const token = async (req, res) => {
  verifyRefreshToken(req.body.token)
    .then(async ({ tokenDetails }) => {
      const payload = { _id: tokenDetails._id, role: tokenDetails.role };
      const accessToken = jwt.sign(payload, process.env.JWTPRIVATEKEY, {
        expiresIn: "14m",
      });
      const allNotifications = await Bid.find({
        sellerId: tokenDetails._id,
      });
      var findata = [];
      for (let i = 0; i < allNotifications.length; i++) {
        const { pimage, pname } = await Product.findById(
          allNotifications[i].prodId
        );
        for (let j = 0; j < allNotifications[i].bids.length; j++) {
          const { name } = await User.findById(
            allNotifications[i].bids[j].buyerId
          );
          if (allNotifications[i].bids[j].cancel === false) {
            findata.push({
              prodId: allNotifications[i].prodId,
              href: `/buy-product/${allNotifications[i].prodId}/${tokenDetails._id}/${allNotifications[i].bids[j].buyerId}`,
              imageURL: pimage,
              reg: name,
              pname: pname,
              bprice: allNotifications[i].bids[j].bidPrice,
              cancel: allNotifications[i].bids[j].cancel,
              bid: allNotifications[i].bids[j].buyerId,
            });
          }
        }
      }
      res.status(200).send({
        error: false,
        userid: tokenDetails._id,
        allNotifications: findata,
        role: tokenDetails.role,
        message: "Access token created successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
};

const delToken = async (req, res) => {
  try {
    const usertoken = await UserToken.findOne({ token: req.body.refreshToken });
    if (!usertoken)
      return res
        .status(200)
        .send({ error: false, message: "Logged Out Sucessfully" });

    await usertoken.remove();
    res.status(200).send({ error: false, message: "Logged Out Sucessfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};

const fixdeal = async (req, res) => {
  try {
    const { productid, sellerid, buyerid } = req.body;
    const { pname, pprice, pimage } = await Product.findById(productid);
    var findata = { pname: pname, productprice: pprice, pimage: pimage };
    const biddata = await Bid.findOne({ prodId: productid });
    for (let i = 0; i < biddata.bids.length; i++) {
      if (biddata.bids[i].buyerId.toString() === buyerid) {
        findata = { ...findata, bidprice: biddata.bids[i].bidPrice };
        break;
      }
    }
    const { name, mail } = await User.findById(buyerid);
    findata = { ...findata, buyername: name };
    findata = { ...findata, mail: mail };
    res.status(200).send({ fixdeal: findata });
  } catch (error) {
    console.log(error);
    res.status(300).send({ error: true });
  }
};

const profile = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findOne({ _id: id });

    var arr = [];
    const data = await Bid.find({});

    for (let i = 0; i < data.length; i++) {
      var { pname, pimage, pprice } = await Product.findById(data[i].prodId);
      for (let j = 0; j < data[i].bids.length; j++) {
        if (data[i].bids[j].buyerId.toString() === id) {
          const temp = {
            pname: pname,
            pimage: pimage,
            bidPrice: data[i].bids[j].bidPrice,
            bidtime: data[i].bids[j].bidTime,
            bid: id,
            pid: data[i].prodId,
            pprice: pprice,
          };
          arr.push(temp);
    }
      }
    }
    const mydata = await Product.find({ id: id });

    var myprodData = [];
    for (let i = 0; i < mydata.length; i++) {
      const temp = {
        id: mydata[i]._id,
        pname: mydata[i].pname,
        pprice: mydata[i].pprice,
        pimage: mydata[i].pimage,
        preg: mydata[i].preg,
      };
      myprodData.push(temp);
    }
    if (!user) {
      res.status(400).send({
        error: true,
        message: "User not found",
      data: user,
        mybids: arr,
        myproducts: myprodData,
    });
    }
    res
      .status(200)
      .send({ erro: false, data: user, mybids: arr, myproducts: myprodData });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: true });
  }
};
const Cart = require("../models/cart");

// Add to cart
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    // Validate input
    if (!userId || !productId) {
      return res.status(400).json({ 
        error: true, 
        message: "UserId and productId are required" 
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        error: true, 
        message: "Product not found" 
      });
    }

    // Find or create cart for user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create new cart if it doesn't exist
      cart = new Cart({
        userId,
        items: [{ productId, quantity }]
      });
    } else {
      // Check if product already exists in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );

      if (existingItemIndex > -1) {
        // Update quantity if product exists
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new product to cart
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();

    res.status(200).json({ 
      error: false, 
      message: "Product added to cart successfully",
      cart 
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ 
      error: true, 
      message: "Internal server error" 
    });
  }
};

// Get cart
const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId })
      .populate('items.productId', 'pname pprice pimage');

    if (!cart) {
      return res.status(200).json({ 
        error: false, 
        message: "Cart is empty",
        cart: { items: [] } 
      });
    }

    res.status(200).json({ 
      error: false, 
      cart 
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ 
      error: true, 
      message: "Internal server error" 
    });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity === undefined) {
      return res.status(400).json({ 
        error: true, 
        message: "UserId, productId and quantity are required" 
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ 
        error: true, 
        message: "Cart not found" 
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ 
        error: true, 
        message: "Product not found in cart" 
      });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    res.status(200).json({ 
      error: false, 
      message: "Cart updated successfully",
      cart 
    });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ 
      error: true, 
      message: "Internal server error" 
    });
  }
};

// Remove from cart
const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ 
        error: true, 
        message: "UserId and productId are required" 
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ 
        error: true, 
        message: "Cart not found" 
      });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    if (cart.items.length === initialLength) {
      return res.status(404).json({ 
        error: true, 
        message: "Product not found in cart" 
      });
    }

    await cart.save();

    res.status(200).json({ 
      error: false, 
      message: "Product removed from cart successfully",
      cart 
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ 
      error: true, 
      message: "Internal server error" 
    });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const result = await Cart.deleteOne({ userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        error: true, 
        message: "Cart not found" 
      });
    }

    res.status(200).json({ 
      error: false, 
      message: "Cart cleared successfully" 
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ 
      error: true, 
      message: "Internal server error" 
    });
  }
};
const deletemyprod = async (req, res) => {
  try {
    const { pid } = req.body;
    await Product.deleteOne({ _id: pid });
    await Bid.deleteOne({ prodId: pid });
    res.status(200).send({ error: false });
  } catch (error) {
    res.status(400).send({ error: true });
  }
};

const delAcc = async (req, res) => {
  try {
    const id = req.body.id;
    await User.deleteOne({ _id: id });
    await UserToken.deleteOne({ userId: id });
    await Bid.deleteOne({ sellerId: id });
    await Product.deleteOne({ id: id });
    res
      .status(200)
      .send({ error: false, message: "Account deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: true });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await UserToken.deleteOne({ token: refreshToken });
    res.status(200).send({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const update = async (req, res) => {
  try {
    const newData = req.body.newData;
    const id = req.body.id;
    await User.updateOne({ _id: id }, newData);
    res.status(200).send({ error: false, message: "Updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: true });
  }
};

const displayProd = async (req, res) => {
  try {
    const data = await Product.find({}).lean();
    res.status(200).send({ error: false, details: data });
  } catch (error) {
    console.log("Error: ", error);
    res.status(400).send({ error: true });
  }
};

const searchproduct = async (req, res) => {
  try {
    const { searchval } = req.body;
    const data = await Product.find({ pname: searchval });
    res.status(200).send({ mysearchdata: data });
  } catch (error) {
    res.status(400).send({ error: true });
  }
};

const prodData = async (req, res) => {
  try {
    const id = req.body.id;
    console.log(id);
    const data = await Product.findById(id);
    const bid = await Bid.findOne({ prodId: id });
    const { name, mail, phone } = await User.findById(data.id);
    res
      .status(200)
      .send({ error: false, details: { data, bid, name, mail, phone } });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: true });
  }
};

const sell = async (req, res) => {
  try {
    const { pdata, id } = req.body;
    pdata[id] = id;
    await Product.create(pdata);
    res
      .status(200)
      .send({ error: false, message: "Product added successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: true, message: "Product wasn't added" });
  }
};

const addbid = async (req, res) => {
  try {
    const { biddata } = req.body;
    const bidDataFromDB = await Bid.findOne({
      prodId: biddata.pid,
    });
    const { mail } = await User.findById(biddata.buyerId);
    const reg = mail.slice(0, 6);
    if (!bidDataFromDB) {
      const newData = {
        prodId: biddata.pid,
        sellerId: biddata.sellerId,
        bids: [
          {
            buyerId: biddata.buyerId,
            bidPrice: biddata.bidPrice,
            bidTime: biddata.bidTime,
            regno: reg,
            cancel: false,
          },
        ],
      };
      await Bid.create(newData);
    } else {
      bidDataFromDB.bids.push({
        buyerId: biddata.buyerId,
        bidPrice: biddata.bidPrice,
        bidTime: biddata.bidTime,
        regno: reg,
        cancel: false,
      });
      await Bid.updateOne(
        { prodId: biddata.pid, sellerId: biddata.sellerId },
        bidDataFromDB
      );
    }
    const dataFromdb = await Bid.findOne({
      prodId: biddata.pid,
      sellerId: biddata.sellerId,
    });
    res.status(200).send({ details: { bid: dataFromdb } });
  } catch (err) {
    console.log(err);
  }
};

const removebid = async (req, res) => {
  try {
    const { productid, buyerId } = req.body;
    var bid = await Bid.findOne({ prodId: productid });
    console.log(bid, buyerId);
    var arr = [];
    for (let i = 0; i < bid.bids.length; i++) {
      if (bid.bids[i].buyerId.toString() !== buyerId) {
        console.log(
          bid.bids[i].buyerId,
          buyerId,
          bid.bids[i].buyerId !== buyerId
        );
        arr.push(bid.bids[i]);
      }
    }
    console.log(arr);
    bid.bids = arr;
    await Bid.updateOne({ prodId: productid }, bid);
    res.status(200).send({ error: false, details: { bid: bid } });
  } catch (error) {
    console.log(error);
    res.status(302).send({ error: true });
  }
};

const confirmdeal = async (req, res) => {
  try {
    const { productid, sellerid, mail, productname, bprice } = req.body;
    const sellerinfo = await User.findById(sellerid);
    await Product.deleteOne({ _id: productid });
    await Bid.deleteOne({ prodId: productid });
    console.log(sellerinfo);
    const text = `Hi, I am ${sellerinfo.name}, and I look forward to fixing the deal of ${productname} for Rs.${bprice}.\nYou can find my contact details attached here\nAddress: ${sellerinfo.address}\nPhone  : ${sellerinfo.phone}\nEmail  : ${sellerinfo.mail}`;
    await sendEmail(mail, "Confirm Deal", text);
    res.status(200).send({ error: false });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: true });
  }
};

const cancelnotification = async (req, res) => {
  try {
    const { prodid, bid } = req.body;
    var notifitcation = await Bid.findOne({ prodId: prodid });
    for (let i = 0; i < notifitcation.bids.length; i++) {
      if (notifitcation.bids[i].buyerId.toString() === bid) {
        notifitcation.bids[i].cancel = true;
      }
    }
    await Bid.updateOne({ prodId: prodid }, notifitcation);

    var findata = [];
    const sellerid = notifitcation.sellerId;
    notifitcation = await Bid.find({ sellerId: sellerid });
    console.log(notifitcation);
    for (let i = 0; i < notifitcation.length; i++) {
      const { id, pimage, pname } = await Product.findById(
        notifitcation[i].prodId
      );
      for (let j = 0; j < notifitcation[i].bids.length; j++) {
        const { name } = await User.findById(notifitcation[i].bids[j].buyerId);
        if (notifitcation[i].bids[j].cancel === false) {
          findata.push({
            prodId: notifitcation[i].prodId,
            href: `/buy-product/${notifitcation[i].prodId}/${id}/${notifitcation[i].bids[j].buyerId}`,
            imageURL: pimage,
            reg: name,
            pname: pname,
            bprice: notifitcation[i].bids[j].bidPrice,
            cancel: notifitcation[i].bids[j].cancel,
            bid: notifitcation[i].bids[j].buyerId,
          });
        }
      }
    }
    console.log(findata);
    res.status(200).send({ allNotifications: findata });
  } catch (error) {
    res.status(400).send({ error: true });
  }
};

const deletemybid = async (req, res) => {
  try {
    const { pid, bid } = req.body;
    console.log(pid, bid);
    var biddata = await Bid.findOne({ prodId: pid });
    var arr = [];
    for (let i = 0; i < biddata.bids.length; i++) {
      if (biddata.bids[i].buyerId.toString() !== bid) {
        arr.push(biddata.bids[i]);
      }
    }
    biddata.bids = arr;
    await Bid.updateOne({ prodId: pid }, biddata);
    console.log(biddata);
    res.status(200).send({ error: false });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: true });
  }
};

module.exports = {
  prodData,
  deletemybid,
  login,
  logout,
  register,
  verify,
  token,
  delToken,
  profile,
  delAcc,
  update,
  displayProd,
  searchproduct,
  sell,
  addbid,
  removebid,
  fixdeal,
  deletemyprod,
  confirmdeal,
  cancelnotification,
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
