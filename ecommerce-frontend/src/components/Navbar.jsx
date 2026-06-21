import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        navigate('/login');
    };

    return (
        <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">
                ShopEase
            </Link>

            <div className="flex items-center gap-6">
                <Link to="/" className="hover:text-gray-300">
                    Products
                </Link>

                {token && (
                    <Link to="/cart" className="hover:text-gray-300">
                        Cart
                    </Link>
                )}

                {token && (
                    <Link to="/orders" className="hover:text-gray-300">
                        My Orders
                    </Link>
                )}

                {role === 'ADMIN' && (
                    <Link to="/admin" className="hover:text-gray-300">
                        Admin
                    </Link>
                )}

                {token ? (
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-300">Hi, {name}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-sm"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;