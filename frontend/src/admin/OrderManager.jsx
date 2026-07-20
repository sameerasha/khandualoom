import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './OrderManager.css';

export default function OrderManager({ onNavigate }) {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/admin/all`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/admin/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        fetchOrders(); // refresh
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const filteredOrders = filter === 'ALL' ? orders : orders.filter(o => o.orderStatus === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus === 'PENDING').length,
    processing: orders.filter(o => o.orderStatus === 'PROCESSING').length,
    shipped: orders.filter(o => o.orderStatus === 'SHIPPED').length,
    delivered: orders.filter(o => o.orderStatus === 'DELIVERED').length,
    revenue: orders.filter(o => o.orderStatus !== 'CANCELLED').reduce((sum, o) => sum + o.totalAmount, 0)
  };

  return (
    <div className="order-manager">
      <div className="admin-dashboard__header">
        <div>
          <h1 className="admin-dashboard__title">Order Management</h1>
          <p className="admin-dashboard__subtitle">View and manage all customer orders.</p>
        </div>
      </div>

      <div className="admin-dashboard__stats">
        <div className="admin-stat-card">
          <div className="admin-stat-card__value">{stats.total}</div>
          <div className="admin-stat-card__label">Total Orders</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__value">{stats.pending}</div>
          <div className="admin-stat-card__label">Pending</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__value">{stats.processing}</div>
          <div className="admin-stat-card__label">Processing</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__value">₹{stats.revenue.toLocaleString('en-IN')}</div>
          <div className="admin-stat-card__label">Total Revenue</div>
        </div>
      </div>

      <div className="order-manager-content">
        <div className="order-filters">
          <button className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`} onClick={() => setFilter('ALL')}>All</button>
          <button className={`filter-btn ${filter === 'PENDING' ? 'active' : ''}`} onClick={() => setFilter('PENDING')}>Pending</button>
          <button className={`filter-btn ${filter === 'PROCESSING' ? 'active' : ''}`} onClick={() => setFilter('PROCESSING')}>Processing</button>
          <button className={`filter-btn ${filter === 'SHIPPED' ? 'active' : ''}`} onClick={() => setFilter('SHIPPED')}>Shipped</button>
          <button className={`filter-btn ${filter === 'DELIVERED' ? 'active' : ''}`} onClick={() => setFilter('DELIVERED')}>Delivered</button>
          <button className={`filter-btn ${filter === 'CANCELLED' ? 'active' : ''}`} onClick={() => setFilter('CANCELLED')}>Cancelled</button>
        </div>

        {isLoading ? (
          <div className="loading-spinner-container">
            <div className="spinner"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state">
            <p>No orders found matching the filter.</p>
          </div>
        ) : (
          <div className="order-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)).map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>{order.address.fullName}</td>
                    <td>₹{order.totalAmount.toLocaleString('en-IN')}</td>
                    <td><span className={`status-badge status-${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span></td>
                    <td><span className={`status-badge status-${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span></td>
                    <td>
                      <div className="order-actions-dropdown">
                        <select 
                          value={order.orderStatus} 
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          disabled={order.orderStatus === 'CANCELLED' || order.orderStatus === 'DELIVERED'}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
