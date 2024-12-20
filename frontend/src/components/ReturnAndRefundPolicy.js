import React from "react";
import "../styles/footerPages.css"; 

function ReturnAndRefundPolicy() {
  return (
    <div id="MainContainer">
      <h3 id="mainHead">RETURN & REFUND & SHIPPING POLICY</h3>
      <p id="content">Effective date: August 15, 2024</p>
      <p id="content">Last updated on: August 6, 2024</p>

      <h2>One Snack Return and Refund Policy (5 Days)</h2>
      <p id="content">
        At One Snack, we are dedicated to providing you with premium, healthy snacks. If you are not entirely satisfied with your purchase, we offer a simple return and refund policy, valid for 5 days from the date of delivery.
      </p>

      <h4 id="sub">1. ELIGIBILITY FOR RETURNS</h4>
      <ul>
        <li id="ls">Products must be unused, unopened, and in their original packaging.</li>
        <li id="ls">Returns must be requested within 5 days of receiving your order.</li>
        <li id="ls">Proof of purchase (invoice or order confirmation) is required for processing returns.</li>
      </ul>

      <h4 id="sub">2. NON-RETURNABLE ITEMS</h4>
      <ul>
        <li id="ls">Gift Cards and Sale Items are non-refundable.</li>
        <li id="ls">Products that have been opened or used.</li>
        <li id="ls">Perishable items, unless they arrived damaged or defective.</li>
      </ul>

      <h4 id="sub">3. RETURN PROCESS</h4>
      <ol>
        <li id="ls">Contact our customer service team at <a href="mailto:support@nutriinuts.com" id="mail">support@nutriinuts.com</a> within 5 days of receiving your order.</li>
        <li id="ls">Provide your order number, product details, and the reason for the return.</li>
        <li id="ls">Our team will provide instructions, including the return shipping address.</li>
        <li id="ls">The customer is responsible for the return shipping charges unless the product is defective or damaged upon arrival.</li>
      </ol>

      <h4 id="sub">4. SHIPPING AND DELIVERY</h4>
      <p id="content">
        <strong>How Do My Orders Ship?</strong> Orders are shipped through our trusted logistics partners, using standard shipping methods.
      </p>
      <p id="content">
        <strong>Shipping Charges:</strong> Shipping costs will be calculated and displayed at checkout. These costs are non-refundable unless the order is incorrect or defective.
      </p>
      <p id="content">
        <strong>How Long Does Shipping Take?</strong> Delivery times depend on your location. Orders generally take 3-7 business days:
        <ul>
          <li id="ls"><strong>Metro Cities:</strong> 3-5 business days.</li>
          <li id="ls"><strong>Non-Metro and Remote Areas:</strong> 5-7 business days.</li>
        </ul>
      </p>

      <h4 id="sub">5. RETURNING YOUR ORDER</h4>
      <ol>
        <li id="ls">Pack the products in their original packaging.</li>
        <li id="ls">Contact our support team for the return address and further instructions.</li>
        <li id="ls">Ship the items back to us using a trackable service, retaining the receipt as proof of return.</li>
      </ol>

      <h4 id="sub">6. REFUND POLICY</h4>
      <p id="content">
        Once we receive and inspect your returned product, we will notify you of the approval or rejection of your refund.
      </p>
      <p id="content">
        If approved, your refund will be processed back to the original payment method within 7-10 business days. 
        <strong>Shipping charges are non-refundable</strong>, and customers are responsible for return shipping costs unless the product was damaged or incorrect.
      </p>

      <h4 id="sub">7. DAMAGED OR DEFECTIVE ITEMS</h4>
      <p id="content">
        If you receive a damaged or defective product, notify us within 24 hours of delivery, including photographic evidence. We will offer a replacement or full refund at no additional cost to you.
      </p>

      <h4 id="sub">8. GOVERNMENT APPROVAL</h4>
      <p id="content">
        One Snack is a government-approved company, and all our products are made to meet the highest standards for safety and quality. Your health and satisfaction are our top priorities.
      </p>

      <h4 id="sub"><strong>CONTACT US</strong></h4>
      <p id="content">For more information or to start a return, please contact us at <a href="mailto:support@nutriinuts.com" id="mail">support@nutriinuts.com</a></p>

      <p id="end">Thank you for choosing One Snack for your healthy snacking needs!</p>
    </div>
  );
}

export default ReturnAndRefundPolicy;
