import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="bg-slate-800 p-4 shadow-lg mb-6">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300">
                    WorkFlow
                </Link>
                <div className="space-x-4">
                    {isAuthenticated ? (
                        <>
                            <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md transition duration-200">Dashboard</Link>
                            <Link to="/calendar" className="text-gray-300 hover:text-white px-3 py-2 rounded-md transition duration-200">Calendar</Link>
                            {user && user.role === 'manager' && (
                                <span className="text-green-400 font-semibold px-2">Manager</span>
                            )}
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md transition duration-200">Login</Link>
                            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
