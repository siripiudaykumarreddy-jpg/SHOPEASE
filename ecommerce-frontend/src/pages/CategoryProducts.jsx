import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

function CategoryProducts() {
    const { categoryId } = useParams();
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const categoryName = location.state?.name || 'Products';

    useEffect(() => {
        fetchProducts();
    }, [categoryId]);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/products', {
                params: { categoryId, size: 50 },
            });
            setProducts(response.data.content);
        } catch (err) {
            setError('Failed to load products.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <Link to="/" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
                ← Back to categories
            </Link>

            <h2 className="text-2xl font-bold mb-6 text-gray-900">{categoryName}</h2>

            {loading && <p className="text-center text-gray-500">Loading products...</p>}

            {error && (
                <p className="text-center text-red-600 bg-red-50 p-3 rounded">{error}</p>
            )}

            {!loading && !error && products.length === 0 && (
                <p className="text-center text-gray-500">No products found in this category.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

export default CategoryProducts;