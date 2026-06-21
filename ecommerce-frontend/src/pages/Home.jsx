import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const categoryImages = {
    Electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=300&fit=crop',
    Fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&h=300&fit=crop',
    'Home & Kitchen': 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&h=300&fit=crop',
    Books: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&h=300&fit=crop',
    'Sports & Fitness': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=300&fit=crop',
    'Beauty & Personal Care': 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&h=300&fit=crop',
    'Toys & Games': 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=500&h=300&fit=crop',
    Groceries: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&h=300&fit=crop',
    Automotive: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=300&fit=crop',
    'Health & Wellness': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500&h=300&fit=crop',
};
function Home() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (err) {
            console.error('Failed to load categories', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="text-center mb-10 mt-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to ShopEase</h1>
                <p className="text-gray-500">Shop by category</p>
            </div>

            <form onSubmit={handleSearch} className="mb-10 flex gap-2 max-w-xl mx-auto">
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Search
                </button>
            </form>

            {loading ? (
                <p className="text-center text-gray-500">Loading categories...</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            onClick={() => navigate(`/category/${cat.id}`, { state: { name: cat.name } })}
                            className="cursor-pointer group rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                        >
                            <div className="h-32 overflow-hidden">
                                <img
                                    src={categoryImages[cat.name] || 'https://via.placeholder.com/300x200?text=Category'}
                                    alt={cat.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                            </div>
                            <div className="p-3 text-center bg-white">
                                <p className="font-semibold text-gray-800 text-sm">{cat.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;