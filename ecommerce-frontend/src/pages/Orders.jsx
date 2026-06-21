import { useState, useEffect } from 'react';
import api from '../api/axios';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders/my-orders');
            setOrders(response.data);
        } catch (err) {
            setError('Failed to load orders');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const statusStyles = {
        PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
        CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
        SHIPPED: 'bg-purple-50 text-purple-700 border-purple-200',
        DELIVERED: 'bg-green-50 text-green-700 border-green-200',
        CANCELLED: 'bg-red-50 text-red-700 border-red-200',
    };

    const statusSteps = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

    const getStepIndex = (status) => statusSteps.indexOf(status);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-10 text-center text-gray-500">
                Loading your orders...
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-10 text-center text-red-600">{error}</div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="max-w-3xl mx-auto p-16 text-center">
                <div className="text-5xl mb-4">📦</div>
                <h2 className="text-2xl font-bold mb-2 text-gray-800">No orders yet</h2>
                <p className="text-gray-500">Your placed orders will appear here once you make a purchase.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-1 text-gray-900">My Orders</h2>
            <p className="text-gray-500 mb-6">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

            <div className="space-y-4">
                {orders.map((order) => {
                    const isExpanded = expandedId === order.id;
                    const stepIndex = getStepIndex(order.status);
                    const isCancelled = order.status === 'CANCELLED';

                    return (
                        <div
                            key={order.id}
                            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                        >
                            <div
                                className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => setExpandedId(isExpanded ? null : order.id)}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-gray-900">Order #{order.id}</span>
                                            <span
                                                className={`text-xs px-3 py-1 rounded-full font-medium border ${
                                                    statusStyles[order.status] || 'bg-gray-50 text-gray-700 border-gray-200'
                                                }`}
                                            >
                        {order.status}
                      </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Placed on{' '}
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}{' '}
                                            • {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">
                                            ₹{order.totalAmount.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-blue-600 mt-1">
                                            {isExpanded ? 'Hide details ▲' : 'View details ▼'}
                                        </p>
                                    </div>
                                </div>

                                {!isCancelled && (
                                    <div className="mt-4 flex items-center">
                                        {statusSteps.map((step, idx) => (
                                            <div key={step} className="flex items-center flex-1 last:flex-none">
                                                <div
                                                    className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                                        idx <= stepIndex ? 'bg-blue-600' : 'bg-gray-200'
                                                    }`}
                                                />
                                                {idx < statusSteps.length - 1 && (
                                                    <div
                                                        className={`h-0.5 flex-1 ${
                                                            idx < stepIndex ? 'bg-blue-600' : 'bg-gray-200'
                                                        }`}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {isExpanded && (
                                <div className="border-t border-gray-100 bg-gray-50 p-5">
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                                        Items
                                    </p>
                                    <div className="space-y-2 mb-4">
                                        {order.items.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex justify-between items-center bg-white rounded-lg px-4 py-3 border border-gray-100"
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-800 text-sm">
                                                        {item.productName}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Qty: {item.quantity} × ₹{item.unitPrice.toLocaleString()}
                                                    </p>
                                                </div>
                                                <p className="font-semibold text-gray-900 text-sm">
                                                    ₹{item.subtotal.toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-start pt-3 border-t border-gray-200">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                                Shipping Address
                                            </p>
                                            <p className="text-sm text-gray-700">{order.shippingAddress}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                                Total
                                            </p>
                                            <p className="text-lg font-bold text-gray-900">
                                                ₹{order.totalAmount.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Orders;