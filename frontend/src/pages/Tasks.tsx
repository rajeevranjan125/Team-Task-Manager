import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Circle, Clock, CheckSquare } from 'lucide-react';

interface User {
    id: number;
    username: string;
    role: string;
}

interface Project {
    id: number;
    name: string;
}

interface Task {
    id: number;
    title: string;
    status: string;
    project: Project;
    assignedTo?: User;
}

export default function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const { role, userId } = useAuth();

    const normalizedRole = role?.replace(/['"]/g, '').trim().toUpperCase() || '';
    const canCreateTask = ['ADMIN', 'PROJECT_MANAGER', 'TEAM_LEAD'].includes(normalizedRole);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const projRes = await api.get('/projects');
            setProjects(projRes.data);
            const usersRes = await api.get('/users');
            setUsers(usersRes.data);
            
            const tasksRes = await api.get('/tasks');
            setTasks(tasksRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle || !selectedProject) return;
        
        await api.post('/tasks', { 
            title: newTaskTitle, 
            description: '', 
            projectId: parseInt(selectedProject),
            assignedToId: selectedUser ? parseInt(selectedUser) : parseInt(userId!)
        });
        setNewTaskTitle('');
        fetchData();
    };

    const updateTaskStatus = async (taskId: number, currentStatus: string) => {
        const nextStatus = currentStatus === 'PENDING' ? 'IN_PROGRESS' : 
                          currentStatus === 'IN_PROGRESS' ? 'COMPLETED' : 'PENDING';
        
        await api.put(`/tasks/${taskId}/status`, { status: nextStatus });
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
                <div className="flex items-center gap-3 mb-6 border-b pb-4">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                        <CheckSquare className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">Tasks Workspace</h2>
                </div>
                
                {canCreateTask ? (
                    <form onSubmit={handleCreateTask} className="mb-8 p-5 bg-slate-50 border rounded-xl shadow-inner flex flex-wrap gap-3">
                        <select 
                            value={selectedProject} 
                            onChange={(e) => setSelectedProject(e.target.value)}
                            className="flex-1 min-w-[200px] px-4 py-2 border rounded-md text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            required
                        >
                            <option value="">{projects.length === 0 ? "No projects found" : "Select Project..."}</option>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <input 
                            type="text" 
                            placeholder="New Task Title" 
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            className="flex-1 min-w-[200px] px-4 py-2 border rounded-md text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            required
                        />
                        <select 
                            value={selectedUser} 
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="flex-1 min-w-[150px] px-4 py-2 border rounded-md text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="">Assign To...</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.username} ({u.role})</option>)}
                        </select>
                        <button type="submit" className="bg-slate-800 text-white px-6 py-2 rounded-md hover:bg-slate-900 transition font-medium shadow-sm">
                            Add Task
                        </button>
                    </form>
                ) : (
                    <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-500 text-sm shadow-inner">
                        🔒 Task creation is restricted to Admins and Managers (Your Role: {role})
                    </div>
                )}

                <div className="space-y-3">
                    {tasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-4 border rounded-xl hover:shadow-md transition bg-white group">
                            <div className="flex items-center gap-4">
                                <button onClick={() => updateTaskStatus(task.id, task.status)} className="hover:scale-110 transition-transform">
                                    {getStatusIcon(task.status)}
                                </button>
                                <div>
                                    <p className={`font-semibold text-lg ${task.status === 'COMPLETED' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                        {task.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded border">
                                            {task.project.name}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {task.assignedTo ? `Assigned to: ${task.assignedTo.username}` : 'Unassigned'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <div className="text-center py-12 bg-slate-50 border-2 border-dashed rounded-xl">
                            <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">No tasks found. Time to relax! ☕️</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
