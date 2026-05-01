import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('MEMBER');
    const [message, setMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        try {
            await api.post('/auth/register', { username, password, role });
            setMessage({ type: 'success', text: 'User registered successfully! Redirecting to login...' });
            setTimeout(() => navigate('/login'), 1500);
        } catch (error: any) {
            console.error("Registration error:", error);
            const errorMsg = error.response?.data?.message || error.response?.data || error.message || 'Registration failed';
            
            if (typeof errorMsg === 'string' && errorMsg.includes('Username already exists')) {
                setMessage({ type: 'error', text: 'User already registered! Please choose a different username.' });
            } else {
                setMessage({ type: 'error', text: `Error: ${errorMsg}` });
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-md border border-slate-200">
            <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Sign Up</h2>
            
            {message && (
                <div className={`mb-6 p-3 rounded-md text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.text}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Username</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Role</label>
                    <select 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    >
                        <option value="ADMIN">ADMIN</option>
                        <option value="PROJECT_MANAGER">PROJECT MANAGER</option>
                        <option value="TEAM_LEAD">TEAM LEAD</option>
                        <option value="MEMBER">MEMBER</option>
                        <option value="VIEWER">VIEWER</option>
                        <option value="QA">QA</option>
                        <option value="CLIENT">CLIENT</option>
                    </select>
                </div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Register
                </button>
            </form>
            <p className="mt-4 text-center text-sm text-slate-600">
                Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-500">Log in</Link>
            </p>
        </div>
    );
}
