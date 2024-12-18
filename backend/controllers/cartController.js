const Cart = require("../models/cartModel");
const Product = require("../models/allProductsModel");
const Product1 = require("../models/giftingModel");
const Product2 = require("../models/newLaunchesModel");
const Offer = require('../models/Offer');
const asyncHandler = require("express-async-handler");

// Add to cart
const addToCart = asyncHandler(async (req, res) => {
    const { products_id, quantity } = req.body;
    const userId = req.user._id;
    let product = await Product.findById(products_id);

    if (!product) {
        product = await Product1.findById(products_id);
        if(!product){
            product = await Product2.findById(products_id);
            if(!product){
                return res.status(400).json({ message: 'Product not available' }); 
            }
        }
    }

    // Get or create a cart for the user
    let cart = await Cart.findOne({ userId, isExpired: false }) || new Cart({ userId, products: [] });

    // Check if the product already exists in the cart
    const existingProductIndex = cart.products.findIndex(item => item.products_id.toString() === products_id);

    if (existingProductIndex > -1) {
        // If it exists, update the quantity and total price
        const item = cart.products[existingProductIndex];
        item.quantity += quantity;
        item.totalPrice = item.productPrice * item.quantity;
    } else {
        // Otherwise, add a new product to the cart
        cart.products.push({
            products_id: product._id,
            productName: product.productName,
            productDescription: product.productDescription,
            productPrice: product.productPrice,
            productImageUrl: product.productImageUrl,
            quantity,
            totalPrice: product.productPrice * quantity
        });
    }

    const taxRate = 0.18;
const subTotal = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);
const taxAmount = subTotal * taxRate; // 18% tax
cart.tax=taxAmount;
cart.subtotal=subTotal;
const deliveryCharge = (subTotal+taxAmount)< 1000 ? 40 : 0;
cart.totalPrice = Math.floor(subTotal + taxAmount + deliveryCharge - cart.dis); // Store only the integer part of totalPrice
const totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0); // Calculate total quantity
cart.totalQuantity = totalQuantity;
cart.delivery=deliveryCharge;

    // Set cart expiration (e.g., 30 days)
     cart.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Save the cart
    await cart.save();

    res.status(200).json(cart);
});

// Remove item from cart
const removeFromCart = asyncHandler(async (req, res) => {
    const { products_id, quantity } = req.body;
    const userId = req.user._id;

    if (!products_id || quantity === undefined) {
        return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    // Find product
    let product = await Product.findById(products_id);
    if (!product) {
        product = await Product1.findById(products_id);
        if(!product){
            product = await Product2.findById(products_id);
            if(!product){
                return res.status(400).json({ message: 'Product not available' }); 
            }
        }
    }

    // Find the cart
    let cart = await Cart.findOne({ userId, isExpired: false });
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found or expired' });
    }

    // Find the item in the cart
    const itemIndex = cart.products.findIndex(item => item.products_id.toString() === products_id);
    if (itemIndex > -1) {
        const item = cart.products[itemIndex];

        // Ensure that the requested quantity to remove does not exceed the current quantity
        if (quantity > item.quantity) {
            return res.status(400).json({ message: 'Quantity to remove exceeds item quantity in cart' });
        }

        // Decrease the quantity or remove the item if necessary
        item.quantity -= quantity;

        if (item.quantity <= 0) {
            cart.products.splice(itemIndex, 1);
        } else {
            // Update the total price if the item remains in the cart
            item.totalPrice = item.productPrice * item.quantity;
        }

        const taxRate = 0.18;
const subTotal = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);
const taxAmount = subTotal * taxRate; // 18% tax
const deliveryCharge = (subTotal+taxAmount) < 1000 ? 40 : 0;
cart.tax=taxAmount;
cart.subtotal=subTotal;
cart.delivery=deliveryCharge;
cart.totalPrice = Math.floor(subTotal + taxAmount + deliveryCharge - cart.dis); // Store only the integer part of totalPrice

const totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0); // Calculate total quantity
cart.totalQuantity = totalQuantity;

        await cart.save();
        return res.status(200).json(cart);
    } else {
        return res.status(404).json({ message: 'Item not found in cart' });
    }
});

// Get cart items for logged-in user
const getCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId , isExpired: false});
    if (!cart || new Date() > cart.expiresAt) {
      return res.status(404).json({ message: 'Cart not found or expired' });
  }

    res.status(200).json(cart);
});

// Clear the cart
const clearCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const cart = await Cart.findOneAndDelete({ userId });
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ message: 'Cart cleared' });
});

const removeFromCart1 = asyncHandler(async (req, res) => {
    const { products_id } = req.body;
    const userId = req.user ? req.user._id : null;
    
    // Find the cart for the user
    let cart;
    if (userId) {
        cart = await Cart.findOne({ userId, isExpired: false });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found or expired' });
        }
    } else {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    // Remove the item from the cart
    cart.products = cart.products.filter(item => item.products_id.toString() !== products_id);

    // Recalculate the total quantity after removing the product
    const totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0); 
    cart.totalQuantity = totalQuantity;
    
    // Recalculate subtotal
    const subTotal = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);
    cart.subtotal=subTotal;
    // Calculate tax (18%)
    const taxRate = 0.18;
    const taxAmount = subTotal * taxRate;
    cart.tax = taxAmount;

    // Calculate delivery charge (free if subtotal + tax >= 1000)
    const deliveryCharge = (subTotal + taxAmount) < 1000 ? 40 : 0;
    cart.delivery = deliveryCharge;

    // Calculate total price (subtotal + tax + delivery charge)
    cart.totalPrice = Math.floor(subTotal + taxAmount + deliveryCharge - cart.dis); // Store only the integer part of totalPrice

    // Save the updated cart
    await cart.save();

    // Return the updated cart to the client
    res.status(200).json(cart);
});

// Apply discount code
const applyDiscount = asyncHandler(async (req, res) => {
    const { discountCode } = req.body;
    const userId = req.user._id;

    // Find the cart for the user
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Check if a discount code is already applied and remove it
    if (cart.discountCode) {
        cart.totalPrice = Math.floor(cart.totalPrice + cart.dis); // Store only the integer part of totalPrice
        

        cart.dis = 0;  // Reset the discount amount
        cart.discountCode = null;  // Remove the discount code
    }

    // Fetch the offer from the Offer model
    const offer = await Offer.findOne({ discountCode, validTill: { $gte: new Date() } });
    if (!offer) {
        return res.status(400).json({ message: "Invalid or expired discount code" });
    }

    // Apply the discount
    cart.dis = offer.dis;  // Apply the discount amount
    cart.discountCode = discountCode;  // Set the applied discount code
    cart.totalPrice = Math.max(0, cart.totalPrice - offer.dis);  // Update the total price with the discount

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Discount applied", cart });
});

// Remove discount code
const removeDiscount = asyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      // Remove the discount code and reset the discount amount
      cart.discountCode = null;
      cart.dis = 0; // Reset the discount
      cart.totalPrice = Math.floor(cart.subtotal + cart.tax + cart.delivery); // Store only the integer part of totalPrice
      await cart.save();
  
      res.status(200).json({
        message: "Discount code removed",
        totalPrice: cart.totalPrice,
        discountCode: cart.discountCode,
        discount: cart.dis,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });


module.exports = {  addToCart, getCart, removeFromCart1,removeFromCart, clearCart,  applyDiscount ,removeDiscount };
