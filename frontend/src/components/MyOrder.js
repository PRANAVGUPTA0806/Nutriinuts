import React from 'react';
import '../styles/MyOrders.css';

const MyOrder = ({ order }) => {
    // Check if order object is valid
    if (!order) {
        return <div>Loading...</div>; // or any loading state/message you prefer
    }

    return (
        <div id="order">
            <h2>Order #{order._id}</h2>
            <p>Date: {new Date(order.order_summary.order_date).toLocaleDateString()}</p>
            <p>Time: {new Date(order.order_summary.order_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p>Order Status: {order.order_summary.delivery_status}</p>
            <div id="order-details">
                <h3>Items:</h3>
                <ul>
                    {order.order_summary.items?.map((item, index) => (
                        <li key={index}>
                            <img src={item.productImageUrl} alt={item.productName} />
                            <div className="item-info">
                                <span className="item-name">{item.productName}</span>
                                <div className="quantity-price">
                                    <span>Quantity: {item.quantity}</span>
                                    <span>Price: Rs. {item.productPrice?.toFixed(2) || 0}</span>
                                </div>
                            </div>
                        </li>
                    )) || <li>No items found.</li>}
                </ul>
            </div>
            <p id="total">Total: Rs. {order.order_summary.total_price?.toFixed(2) || 0}</p>
            <p id="total">Total Tax: Rs. {order.order_summary.total_tax?.toFixed(2) || 0}</p>
            <p id="total">Total Discount: Rs. {order.order_summary.discount?.toFixed(2) || 0}</p>
            <p id="shipping-fee">Shipping Fee: Rs. {order.order_summary.shipping_fee?.toFixed(2) || 0}</p>
            <p id="final-price">Final Price: Rs. {order.order_summary.final_price?.toFixed(2) || 0}</p>

            {/* Payment Information */}
            {/* Payment Information (above Billing Information) */}
            <div id="payment-info">
    <h3>Payment Information:</h3>
    
    {order.order_summary?.payment_history?.length > 0 ? (
        <ul>
            {order.order_summary.payment_history.map((payment, index) => (
                <li key={index}>
                    <strong>S.No:</strong> {index + 1} | 
                    {order.order_summary?.payment_status !== 'Pending' && (
                        <span>
                            <strong>Payment Date:</strong> {new Date(payment.payment_date).toLocaleString() || 'N/A'} | 
                        </span>
                    )}
                    <strong>Payment Method:</strong> {payment.payment_method || 'N/A'} | 
                    <strong>Transaction ID:</strong> {payment.transaction_id || 'N/A'} | 
                    <strong>Payment Status:</strong> {payment.payment_status || 'N/A'}
                </li>
            ))}
        </ul>
    ) : (
        <p>No payment history available.</p>
    )}
</div>



            {/* Billing Information */}
            <div id="billing-info">
    <h3>Billing Information:</h3>
    <p><strong>Address Line 1:</strong> {order.billing_information?.billing_address?.addressLine1 || 'N/A'}</p>
    <p><strong>Address Line 2:</strong> {order.billing_information?.billing_address?.addressLine2 || 'N/A'}</p>
    <p>
        <strong>City, State, ZIP:</strong> {order.billing_information?.billing_address?.city || 'N/A'}, {order.billing_information?.billing_address?.state || 'N/A'} {order.billing_information?.billing_address?.zip || 'N/A'}
    </p>
    <p><strong>Country:</strong> {order.billing_information?.billing_address?.country || 'N/A'}</p>
    <p><strong>Phone:</strong> {order.billing_information?.billing_address?.phone || 'N/A'}</p>

    <h3>Shipping Information:</h3>
    <p><strong>Shipping Address:</strong></p>
    <p><strong>Address Line 1:</strong> {order.shipping_information?.shipping_address?.addressLine1 || 'N/A'}</p>
    <p><strong>Address Line 2:</strong> {order.shipping_information?.shipping_address?.addressLine2 || 'N/A'}</p>
    <p>
        <strong>City, State, ZIP:</strong> {order.shipping_information?.shipping_address?.city || 'N/A'}, {order.shipping_information?.shipping_address?.state || 'N/A'} {order.shipping_information?.shipping_address?.zip || 'N/A'}
    </p>
    <p><strong>Country:</strong> {order.shipping_information?.shipping_address?.country || 'N/A'}</p>
    <p><strong>Phone:</strong> {order.shipping_information?.shipping_address?.phone || 'N/A'}</p>
    <p><strong>Shipping Method:</strong> {order.shipping_information?.shipping_method || 'N/A'}</p>
    <p><strong>Tracking Number:</strong> {order.shipping_information?.tracking_number || 'N/A'}</p>
    <p><strong>Estimated Delivery Date:</strong> {order.shipping_information?.estimated_delivery_date ? new Date(order.shipping_information.estimated_delivery_date).toLocaleDateString() : 'N/A'}</p>

    <h3>Refund Information:</h3>
    <p><strong>Refund Status:</strong> {order.refund_information?.refund_status || 'N/A'}</p>
    {order.refund_information?.refund_status !== 'None' && (
        <>
            <p><strong>Refund Amount:</strong> {order.refund_information?.refund_amount !== null ? `$${order.refund_information.refund_amount.toFixed(2)}` : 'N/A'}</p>
            {order.refund_information?.refund_status=== 'Refunded' && (
    <p><strong>Refund Date:</strong> {order.refund_information?.refund_date ? new Date(order.refund_information.refund_date).toLocaleDateString() : 'N/A'}</p>
)}
        </>
    )}
</div>


        </div>
    );
};

export default MyOrder;
