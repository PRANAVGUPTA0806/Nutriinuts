import React, { useState, useEffect } from 'react';
import MyOrder from './MyOrder';

const AllOrder = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchOrders = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/orders`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const data = await response.json();

            if (data.message === "No orders found for this user") {
                setOrders([]);
                setError("No orders found for this user");
            } else {
                setOrders(Array.isArray(data) ? data : []);
                setError(null);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err.message);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);
    const handleUpdateOrder = async (orderId, updatedFields) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFields),
            });
    
            if (!response.ok) throw new Error('Failed to update order');
            const updatedOrder = await response.json();
    
            setOrders((prevOrders) =>
                prevOrders.map((order) => (order._id === orderId ? updatedOrder : order))
            );
            fetchOrders();
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredOrders = orders
    .filter(order => {
        const orderDate = new Date(order?.order_summary?.order_date || Date.now());
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
                return true;
        }
    })
    .filter(order => {
        const lowerSearchTerm = (searchTerm || '').toLowerCase();
        const orderId = order?._id?.toLowerCase?.() || '';
        const userEmail = order?.userId?.email?.toLowerCase?.() || '';

        return orderId.includes(lowerSearchTerm) || userEmail.includes(lowerSearchTerm);
    });


    return (
        <div>
            <div className="order-container">
                <h2>All Orders</h2>

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
                    <div className="search-container">
                    <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search by Order ID or User Email"
                    />
                </div>
                </div>

                

                <div className="order-count">
                    <p>Total Orders: {filteredOrders.length}</p>
                </div>

                {loading ? (
                    <p>Loading your orders...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <div className="jj5">
                       {filteredOrders.length > 0 ? (
    filteredOrders.map(order => (
        <MyOrder key={order._id} order={order} onUpdateOrder={handleUpdateOrder} />
    ))
) : (
    <p>No orders found</p>  // Or any message you'd like to show when no orders match
)}

                    </div>
                )}
            </div>
        </div>
    );
};

export default AllOrder;
