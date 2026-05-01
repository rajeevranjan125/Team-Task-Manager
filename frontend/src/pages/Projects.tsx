import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Circle, Clock, Briefcase } from 'lucide-react';

interface User {
    id: number;
    username: string;
    role: string;
}

interface Project {
    id: number;
    name: string;
    description: string;
    status: string;
    assignedTo?: User;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectUser, setNewProjectUser] = useState('');
    const [showProjectForm, setShowProjectForm] = useState(false);
    const { role } = useAuth();
    
    const normalizedRole = role?.replace(/['"]/g, '').trim().toUpperCase() || '';
    const canCreateProject = ['ADMIN', 'PROJECT_MANAGER', 'TEAM_LEAD'].includes(normalizedRole);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const projRes = await api.get('/projects');
            setProjects(projRes.data);
            const usersRes = await api.get('/users');
            setUsers(usersRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProjectName) return;
        await api.post('/projects', { 
            name: newProjectName, 
            description: '',
            assignedToId: newProjectUser ? parseInt(newProjectUser) : null 
        });
        setNewProjectName('');
        setNewProjectUser('');
        setShowProjectForm(false);
        fetchData();
    };

    const updateProjectStatus = async (projectId: number, currentStatus: string) => {
        const nextStatus = currentStatus === 'PENDING' ? 'IN_PROGRESS' : 
                          currentStatus === 'IN_PROGRESS' ? 'COMPLETED' : 'PENDING';
        
        await api.put(`/projects/${projectId}/status`, { status: nextStatus });
        fetchData();
    };

    const getStatusIcon = (status: string) => {
        if (status === 'COMPLETED') return <CheckCircle className="w-5 h-5 text-green-500" />;
        if (status === 'IN_PROGRESS') return <Clock className="w-5 h-5 text-amber-500" />;
        return <Circle className="w-5 h-5 text-slate-400" />;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                            <Briefcase className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Projects Workspace</h2>
                    </div>
                    {canCreateProject ? (
                        <button onClick={() => setShowProjectForm(!showProjectForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition shadow-sm font-medium">
                            + New Project
                        </button>
                    ) : (
                        <div className="text-sm bg-slate-100 text-slate-500 px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
                            🔒 Action restricted (Your Role: {role})
                        </div>
                    )}
                </div>
                
                {showProjectForm && (
                    <form onSubmit={handleCreateProject} className="mb-6 space-y-4 p-5 bg-slate-50 border rounded-xl shadow-inner">
                        <h3 className="font-semibold text-slate-700">Create a New Project</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input 
                                type="text" 
                                placeholder="Project Name" 
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                className="px-4 py-2 border rounded-md text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                required
                            />
                            <select 
                                value={newProjectUser} 
                                onChange={(e) => setNewProjectUser(e.target.value)}
                                className="px-4 py-2 border rounded-md text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option value="">Assign To...</option>
                                {users.map(u => <option key={u.id} value={u.id}>{u.username} ({u.role})</option>)}
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-slate-800 text-white px-4 py-2 rounded-md text-sm hover:bg-slate-900 transition font-medium shadow-sm">
                            Launch Project
                        </button>
                    </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map(p => (
                        <div key={p.id} className="p-5 border rounded-xl bg-white shadow-sm hover:shadow-md transition group">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className={`font-bold text-lg ${p.status === 'COMPLETED' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{p.name}</h3>
                                <button onClick={() => updateProjectStatus(p.id, p.status || 'PENDING')} className="hover:scale-110 transition-transform">
                                    {getStatusIcon(p.status || 'PENDING')}
                                </button>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-indigo-600 bg-indigo-50 inline-block px-2 py-0.5 rounded">
                                    {p.status || 'PENDING'}
                                </p>
                                <p className="text-sm text-slate-600">
                                    {p.assignedTo ? `Assigned to: ${p.assignedTo.username} (${p.assignedTo.role})` : 'Unassigned'}
                                </p>
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && (
                        <div className="col-span-1 md:col-span-2 text-center py-12 bg-slate-50 border-2 border-dashed rounded-xl">
                            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">No projects found. Create one to get started!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
