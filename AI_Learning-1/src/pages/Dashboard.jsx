import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/projects');
                setProjects(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                {user && user.role === 'manager' && (
                    <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200">
                        Create Project
                    </button>
                )}
            </div>

            {loading ? (
                <div className="text-center text-white text-xl">Loading Projects...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <motion.div
                                key={project._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-700"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-xl font-bold text-white truncate w-3/4">{project.name}</h2>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${project.status === 'active' ? 'bg-green-900 text-green-300' :
                                                project.status === 'completed' ? 'bg-blue-900 text-blue-300' : 'bg-gray-700 text-gray-400'
                                            }`}>
                                            {project.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 mb-4 h-12 overflow-hidden text-ellipsis line-clamp-2">
                                        {project.description || 'No description available.'}
                                    </p>

                                    <div className="flex justify-between items-center mt-4">
                                        <div className="flex -space-x-2 overflow-hidden">
                                            {project.team && project.team.slice(0, 3).map((member, idx) => (
                                                <div key={idx} className="inline-block h-8 w-8 rounded-full bg-gray-600 text-white flex items-center justify-center text-xs border-2 border-gray-800 font-bold" title={member.name}>
                                                    {member.name.charAt(0)}
                                                </div>
                                            ))}
                                            {project.team && project.team.length > 3 && (
                                                <div className="inline-block h-8 w-8 rounded-full bg-gray-700 text-white flex items-center justify-center text-xs border-2 border-gray-800 font-bold">
                                                    +{project.team.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <Link to={`/projects/${project._id}`} className="text-blue-400 hover:text-blue-300 text-sm font-semibold">
                                            View Details &rarr;
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10">
                            <p className="text-gray-400 text-lg">No projects found. {user?.role === 'manager' ? 'Create one to get started!' : 'You are not assigned to any projects.'}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
