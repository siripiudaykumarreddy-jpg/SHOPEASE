import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="max-w-3xl mx-auto p-10 text-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Link to="/" className="text-blue-600 hover:underline">
                    Browse products
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

            <div className="space-y-4">
                {cartItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-4 border border-gray-200 rounded-lg p-4"
                    >
                        <img
                            src={item.imageUrl || 'https://via.placeholder.com/80'}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded"
                        />

                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">{item.name}</h3>
                            <p className="text-sm text-gray-500">₹{item.price.toLocaleString()} each</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100"
                            >
                                −
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100"
                            >
                                +
                            </button>
                        </div>

                        <div className="w-24 text-right font-semibold">
                            ₹{(item.price * item.quantity).toLocaleString()}
                        </div>

                        <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex justify-between items-center border-t pt-4">
                <span className="text-lg font-bold">Total: ₹{cartTotal.toLocaleString()}</span>
                <button
                    onClick={() => navigate('/checkout')}
                    className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
}

export default Cart;