import React, { useState, useEffect } from 'react';
import MyOrder from './MyOrder';
// import { useNavigate } from 'react-router-dom';

const MyOrderParent = () => {
    const [orders, setOrders] = useState([]); // Initialize as an empty array
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    // const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        // if (!token) {
        //     alert("Please log in first to view your orders.");
        //     navigate("/login");
        //     return;
        // }

        const fetchOrders = async () => {
            try {
                const email = localStorage.getItem('email');
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/my-orders`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ email }),
                });

                const data = await response.json();

                if (data.message === "No orders found for this user") {
                    setOrders([]);
                    setError("No orders found for this user");
                } else {
                    setOrders(Array.isArray(data) ? data : []);
                    setError(null); // Clear any previous error
                }
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError(err.message);
                setOrders([]); // Ensure orders is always an array
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.order_summary.order_date);
        const currentDate = new Date();

        switch (filter) {
            case '1-day':
                return orderDate >= new Date(currentDate.setDate(currentDate.getDate() - 1));
            case '1-month':
                return orderDate >= new Date(currentDate.setMonth(currentDate.getMonth() - 1));
            case '3-months':
                return orderDate >= new Date(currentDate.setMonth(currentDate.getMonth() - 3));
            case '6-months':
                return orderDate >= new Date(currentDate.setMonth(currentDate.getMonth() - 6));
            case '1-year':
                return orderDate >= new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
            default:
                return true; // Show all orders if no filter is selected
        }
    });

    return (
        <div>
            <div className="filter-container">
                <label htmlFor="filter">Filter Orders:</label>
                <select id="filter" value={filter} onChange={handleFilterChange}>
                    <option value="">Select Time Frame</option>
                    <option value="1-day">Past 1 Day</option>
                    <option value="1-month">Past Month</option>
                    <option value="3-months">Past 3 Months</option>
                    <option value="6-months">Past 6 Months</option>
                    <option value="1-year">Past Year</option>
                </select>
            </div>

            <div className="order-count">
                <p>Total Orders: {filteredOrders.length}</p>
            </div>

            {loading ? (
                <p>Loading your orders...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <div>
                    {filteredOrders.map(order => (
                        <MyOrder key={order._id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrderParent;
