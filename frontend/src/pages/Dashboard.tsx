import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Briefcase, CheckSquare, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const [stats, setStats] = useState({ projects: 0, tasks: 0, completedTasks: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const projRes = await api.get('/projects');
                const tasksRes = await api.get('/tasks');
                setStats({
                    projects: projRes.data.length,
                    tasks: tasksRes.data.length,
                    completedTasks: tasksRes.data.filter((t: any) => t.status === 'COMPLETED').length
                });
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Welcome back to TaskFlow</h1>
                <p className="text-indigo-100 text-lg">Here's what's happening in your workspace today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="bg-blue-100 p-4 rounded-xl">
                        <Briefcase className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Projects</p>
                        <p className="text-3xl font-bold text-slate-800">{stats.projects}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="bg-amber-100 p-4 rounded-xl">
                        <Activity className="w-8 h-8 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Active Tasks</p>
                        <p className="text-3xl font-bold text-slate-800">{stats.tasks - stats.completedTasks}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="bg-green-100 p-4 rounded-xl">
                        <CheckSquare className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Completed Tasks</p>
                        <p className="text-3xl font-bold text-slate-800">{stats.completedTasks}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/projects" className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all hover:border-indigo-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-indigo-50 p-3 rounded-lg group-hover:bg-indigo-100 transition-colors">
                            <Briefcase className="w-8 h-8 text-indigo-600" />
                        </div>
                        <span className="text-indigo-600 font-medium group-hover:translate-x-1 transition-transform">Go to Projects &rarr;</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Manage Projects</h2>
                    <p className="text-slate-500">Create new projects, assign them to team members, and track their overall status.</p>
                </Link>

                <Link to="/tasks" className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all hover:border-purple-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-50 p-3 rounded-lg group-hover:bg-purple-100 transition-colors">
                            <CheckSquare className="w-8 h-8 text-purple-600" />
                        </div>
                        <span className="text-purple-600 font-medium group-hover:translate-x-1 transition-transform">Go to Tasks &rarr;</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Track Tasks</h2>
                    <p className="text-slate-500">Break down projects into actionable tasks and update their completion status.</p>
                </Link>
            </div>
        </div>
    );
}
