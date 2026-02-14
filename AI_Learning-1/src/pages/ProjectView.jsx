import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const ProjectView = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Task form state
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', dueDate: '' });
    const [showTaskForm, setShowTaskForm] = useState(false);

    // Note form state
    const [newNote, setNewNote] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await api.get(`/projects/${id}`);
                setProject(res.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.msg || 'Error fetching project');
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/tasks', { ...newTask, project: id });
            // Update local state - tricky if limited view but manager can create.
            // Manager has full view so project.tasks exists.
            const updatedTasks = [...project.tasks, res.data];
            setProject({ ...project, tasks: updatedTasks });
            setShowTaskForm(false);
            setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
        } catch (err) {
            alert('Error creating task');
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/notes', { content: newNote, projectId: id });
            const updatedNotes = [...project.notes, res.data];
            // We need to populate the author manually or refetch. 
            // For simplicity, let's refetch or just add with basic user info
            // Ideally refetch is safer but slower.
            // Let's refetch for simplicity
            const projRes = await api.get(`/projects/${id}`);
            setProject(projRes.data);
            setNewNote('');
        } catch (err) {
            alert('Error adding note');
        }
    };

    if (loading) return <div className="text-white text-center mt-10">Loading...</div>;
    if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
    if (!project) return <div className="text-white text-center mt-10">Project not found</div>;

    return (
        <div className="container mx-auto px-4 py-8 text-white">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-800 rounded-lg shadow-xl p-8 mb-8 border border-gray-700">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
                        <p className="text-gray-400 text-lg mb-4">{project.description}</p>
                        <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${project.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'
                                }`}>
                                {project.status.toUpperCase()}
                            </span>
                            {project.isLimited && (
                                <span className="text-yellow-500 text-sm italic">You can view this project but not tasks.</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-300">Team Members</h3>
                    <div className="flex flex-wrap gap-4">
                        {project.team && project.team.map(member => (
                            <div key={member._id} className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded-full">
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">
                                    {member.name.charAt(0)}
                                </div>
                                <span>{member.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {!project.isLimited && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Tasks Column */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Tasks</h2>
                                {user.role === 'manager' && (
                                    <button
                                        onClick={() => setShowTaskForm(!showTaskForm)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                                    >
                                        + New Task
                                    </button>
                                )}
                            </div>

                            {showTaskForm && (
                                <form onSubmit={handleCreateTask} className="mb-6 bg-gray-700 p-4 rounded-lg">
                                    <div className="grid grid-cols-1 gap-4">
                                        <input
                                            type="text" placeholder="Title" required
                                            className="bg-gray-800 text-white p-2 rounded border border-gray-600"
                                            value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                        />
                                        <textarea
                                            placeholder="Description"
                                            className="bg-gray-800 text-white p-2 rounded border border-gray-600"
                                            value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                        />
                                        <div className="flex space-x-4">
                                            <select
                                                className="bg-gray-800 text-white p-2 rounded border border-gray-600"
                                                value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                            <input
                                                type="date"
                                                className="bg-gray-800 text-white p-2 rounded border border-gray-600"
                                                value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                                            />
                                        </div>
                                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 rounded font-bold">Save Task</button>
                                    </div>
                                </form>
                            )}

                            <div className="space-y-4">
                                {project.tasks && project.tasks.length > 0 ? (
                                    project.tasks.map(task => (
                                        <div key={task._id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center hover:bg-gray-600 transition">
                                            <div>
                                                <h4 className="font-bold text-lg">{task.title}</h4>
                                                <p className="text-gray-400 text-sm">{task.description}</p>
                                                <div className="flex space-x-2 mt-2 text-xs">
                                                    <span className={`px-2 py-0.5 rounded ${task.priority === 'high' ? 'bg-red-900 text-red-300' :
                                                            task.priority === 'medium' ? 'bg-yellow-900 text-yellow-300' : 'bg-green-900 text-green-300'
                                                        }`}>{task.priority}</span>
                                                    <span className="bg-gray-800 px-2 py-0.5 rounded text-gray-300">
                                                        {task.status}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Actions like change status can go here */}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400">No tasks yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Notes Column */}
                    <div>
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 h-full">
                            <h2 className="text-2xl font-bold mb-6">Notes</h2>
                            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                                {project.notes && project.notes.length > 0 ? (
                                    project.notes.map(note => (
                                        <div key={note._id} className="bg-gray-700 p-3 rounded-lg">
                                            <p className="text-gray-200 mb-2">{note.content}</p>
                                            <div className="flex items-center justify-between text-xs text-gray-400">
                                                <span>{note.author && note.author.name}</span>
                                                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400">No notes yet.</p>
                                )}
                            </div>

                            <form onSubmit={handleAddNote}>
                                <textarea
                                    placeholder="Add a note..."
                                    className="w-full bg-gray-900 text-white p-3 rounded border border-gray-600 mb-2 focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                    value={newNote}
                                    onChange={e => setNewNote(e.target.value)}
                                    required
                                ></textarea>
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold transition">
                                    Post Note
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectView;
