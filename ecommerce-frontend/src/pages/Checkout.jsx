import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

function Checkout() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [placing, setPlacing] = useState(false);

    const token = localStorage.getItem('token');

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!token) {
            navigate('/login');
            return;
        }

        setError('');
        setPlacing(true);

        try {
            const orderItems = cartItems.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
            }));

            const orderResponse = await api.post('/orders', {
                shippingAddress: address,
                items: orderItems,
            });

            const orderId = orderResponse.data.id;

            const paymentResponse = await api.post('/payments/create-order', {
                orderId: orderId,
            });

            const { razorpayOrderId, razorpayKeyId, amount } = paymentResponse.data;

            const options = {
                key: razorpayKeyId,
                amount: amount * 100,
                currency: 'INR',
                name: 'ShopEase',
                description: 'Order Payment',
                order_id: razorpayOrderId,
                handler: async function (response) {
                    try {
                        await api.post('/payments/verify', {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        });
                        clearCart();
                        navigate('/orders');
                    } catch (err) {
                        setError('Payment verification failed. Please contact support.');
                    }
                },
                theme: { color: '#2563eb' },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setPlacing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="max-w-2xl mx-auto p-10 text-center">
                <h2 className="text-2xl font-bold">Your cart is empty</h2>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Checkout</h2>

            <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-3">Order Summary</h3>
                {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm py-1">
            <span>
              {item.name} × {item.quantity}
            </span>
                        <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                ))}
                <div className="flex justify-between font-bold mt-3 pt-3 border-t">
                    <span>Total</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                </div>
            </div>

            {error && (
                <p className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</p>
            )}

            <form onSubmit={handlePlaceOrder} className="space-y-4">
        <textarea
            placeholder="Enter your full shipping address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            rows={3}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

                <button
                    type="submit"
                    disabled={placing}
                    className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                    {placing ? 'Processing...' : 'Pay Now'}
                </button>
            </form>
        </div>
    );
}

export default Checkout;