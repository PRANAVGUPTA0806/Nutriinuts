import React,{useState} from 'react';
import '../styles/AllOrder.css';

const MyOrder = ({ order,onUpdateOrder }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        delivery_status: order.order_summary?.delivery_status || '',
        shipping_method: order.shipping_information?.shipping_method || '',
        tracking_number: order.shipping_information?.tracking_number || '',
        estimated_delivery_date: order.shipping_information?.estimated_delivery_date || '',
        refund_status: order.refund_information?.refund_status || '',
        refund_amount: order.refund_information?.refund_amount || '',
        refund_date: order.refund_information?.refund_date || '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        onUpdateOrder(order._id, formData); // Callback to update order
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            delivery_status: order.order_summary?.delivery_status || '',
            shipping_method: order.shipping_information?.shipping_method || '',
            tracking_number: order.shipping_information?.tracking_number || '',
            estimated_delivery_date: order.shipping_information?.estimated_delivery_date || '',
            refund_status: order.refund_information?.refund_status || '',
            refund_amount: order.refund_information?.refund_amount || '',
            refund_date: order.refund_information?.refund_date || '',
        });
        setIsEditing(false);
    };
    // Check if order object is valid
    if (!order) {
        return <div>Loading...</div>; // or any loading state/message you prefer
    }
    if (!order || !order.order_summary) {
        return <div>Order data is not available.</div>;
    }

    return (
        <div id="order">
            <h2>Order #{order._id}</h2>
            {!isEditing ? (
                <>
                 <button onClick={handleEdit}>Edit</button>

                 <p>
  Date: {order.order_summary?.order_date 
    ? new Date(order.order_summary.order_date).toLocaleDateString() 
    : 'N/A'}
</p>
<p>
  Time: {order.order_summary?.order_date 
    ? new Date(order.order_summary.order_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    : 'N/A'}
</p>
            <p>Order Status: {order.order_summary?.delivery_status}</p>
            <div id="payment-info">
  <h3>User Information:</h3>
  <ul>
    <li>
      <strong>User ID:</strong> {order.userId?._id || 'N/A'} |
      <strong>User EMAIL:</strong> {order.userId?.email || 'N/A'} |
      <strong>User NAME:</strong> {order.userId?.name || 'N/A'} |
      <strong>User Phone Number:</strong> {order.userId?.phoneNumber || 'N/A'}
    </li>
  </ul>
</div>

            
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
</>
) : (
                <form>
                    <div id="delivery-status-group">
        <label htmlFor="delivery_status">
            Order Status:
            <select
                id="delivery_status"
                name="delivery_status"
                value={formData.delivery_status}
                onChange={handleInputChange}
            >
                <option value="">Select Status</option>
                {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'].map((status) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>
        </label>
    </div>

    <div id="shipping-method-group">
        <label htmlFor="shipping_method">
            Shipping Method:
            <select
                id="shipping_method"
                name="shipping_method"
                value={formData.shipping_method}
                onChange={handleInputChange}
            >
                <option value="">Select Method</option>
                {['Standard Shipping', 'Express Shipping', 'Next-Day Shipping'].map((method) => (
                    <option key={method} value={method}>
                        {method}
                    </option>
                ))}
            </select>
        </label>
    </div>

    <div id="tracking-number-group">
        <label htmlFor="tracking_number">
            Tracking Number:
            <input
                id="tracking_number"
                type="text"
                name="tracking_number"
                value={formData.tracking_number}
                onChange={handleInputChange}
            />
        </label>
    </div>

    <div id="estimated-delivery-date-group">
        <label htmlFor="estimated_delivery_date">
            Estimated Delivery Date:
            <input
                id="estimated_delivery_date"
                type="date"
                name="estimated_delivery_date"
                value={formData.estimated_delivery_date}
                onChange={handleInputChange}
            />
        </label>
    </div>

    <div id="refund-status-group">
        <label htmlFor="refund_status">
            Refund Status:
            <select
                id="refund_status"
                name="refund_status"
                value={formData.refund_status}
                onChange={handleInputChange}
            >
                <option value="">Select Status</option>
                {['None', 'Requested', 'Processed', 'Rejected','Refunded'].map((status) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>
        </label>
    </div>

    {formData.refund_status !== 'None' && (
        <>
            <div id="refund-amount-group">
                <label htmlFor="refund_amount">
                    Refund Amount:
                    <input
                        id="refund_amount"
                        type="number"
                        name="refund_amount"
                        value={formData.refund_amount}
                        onChange={handleInputChange}
                    />
                </label>
            </div>

            <div id="refund-date-group">
                <label htmlFor="refund_date">
                    Refund Date:
                    <input
                        id="refund_date"
                        type="date"
                        name="refund_date"
                        value={formData.refund_date}
                        onChange={handleInputChange}
                    />
                </label>
            </div>
        </>
    )}
                    <button type="button" onClick={handleSave}>Save</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                </form>
            )}


        </div>
    );
};

export default MyOrder;
