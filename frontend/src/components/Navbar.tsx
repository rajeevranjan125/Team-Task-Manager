import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, LogOut } from 'lucide-react';

export default function Navbar() {
    const { token, logout, role } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-indigo-600 p-1.5 rounded-lg">
                                <LayoutDashboard className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl text-slate-900 tracking-tight">TaskFlow</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-6">
                        {token ? (
                            <>
                                <div className="hidden md:flex items-center gap-4 mr-4">
                                    <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Overview</Link>
                                    <Link to="/projects" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Projects</Link>
                                    <Link to="/tasks" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Tasks</Link>
                                </div>
                                <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                                    {role}
                                </span>
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-red-600 transition"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Sign in</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
