import { useCart } from '../context/CartContext';
import { useState } from 'react';

function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <img
                src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-3"
            />
            <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{product.categoryName}</p>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

            <div className="flex justify-between items-center">
        <span className="text-xl font-bold text-gray-900">
          ₹{product.price.toLocaleString()}
        </span>
                <span
                    className={`text-xs px-2 py-1 rounded ${
                        product.stockQuantity > 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                    }`}
                >
          {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
        </span>
            </div>

            <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                className={`w-full mt-3 py-2 rounded transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${
                    added ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
                {added ? 'Added ✓' : 'Add to Cart'}
            </button>
        </div>
    );
}

export default ProductCard;