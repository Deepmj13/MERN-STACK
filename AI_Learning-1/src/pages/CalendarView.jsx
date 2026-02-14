import { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const CalendarView = () => {
    const { user } = useContext(AuthContext);
    const [date, setDate] = useState(new Date());
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [leaveForm, setLeaveForm] = useState({
        startDate: '',
        endDate: '',
        reason: ''
    });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const res = await api.get('/leaves?status=approved');
                setLeaves(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchLeaves();
    }, []);

    const handleLeaveSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/leaves', leaveForm);
            alert('Leave requested successfully!');
            setShowForm(false);
            setLeaveForm({ startDate: '', endDate: '', reason: '' });
            // Optionally refetch leaves if we want to show pending ones or if manager auto-approves
        } catch (err) {
            alert('Error requesting leave');
        }
    };

    const isDayHasLeave = (date) => {
        return leaves.some(leave => {
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            const current = new Date(date);
            // Reset hours to compare only dates
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            current.setHours(12, 0, 0, 0); // mid-day to be safe
            return current >= start && current <= end;
        });
    };

    const getLeaveDetails = (date) => {
        return leaves.filter(leave => {
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            const current = new Date(date);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            current.setHours(12, 0, 0, 0);
            return current >= start && current <= end;
        });
    };

    return (
        <div className="container mx-auto px-4 py-8 text-white">
            <h1 className="text-3xl font-bold mb-8">Team Calendar & Leaves</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                        <Calendar
                            onChange={setDate}
                            value={date}
                            tileClassName={({ date, view }) => {
                                if (view === 'month' && isDayHasLeave(date)) {
                                    return 'bg-red-900 text-white rounded-full'; // Custom class won't directly work easily with react-calendar structure without !important in css or specific logic
                                }
                            }}
                            tileContent={({ date, view }) => {
                                if (view === 'month') {
                                    const daysLeaves = getLeaveDetails(date);
                                    if (daysLeaves.length > 0) {
                                        return (
                                            <div className="flex justify-center mt-1">
                                                <div className="flex -space-x-1">
                                                    {daysLeaves.map(l => (
                                                        <div key={l._id} className="w-2 h-2 rounded-full bg-red-500" title={l.user && l.user.name}></div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    }
                                }
                            }}
                        />
                    </motion.div>

                    <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                        <h2 className="text-xl font-bold mb-4">Leaves on {date.toDateString()}</h2>
                        {getLeaveDetails(date).length > 0 ? (
                            <ul className="space-y-4">
                                {getLeaveDetails(date).map(leave => (
                                    <li key={leave._id} className="flex items-center space-x-4 bg-gray-700 p-3 rounded">
                                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-lg">
                                            {leave.user?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold">{leave.user?.name}</p>
                                            <p className="text-sm text-gray-300">{leave.reason}</p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400">No leaves scheduled for this day.</p>
                        )}
                    </div>
                </div>

                <div>
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg border border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Request Leave</h2>
                            <button onClick={() => setShowForm(!showForm)} className="text-sm text-blue-400 hover:text-blue-300 underline">
                                {showForm ? 'Cancel' : 'Apply'}
                            </button>
                        </div>

                        {showForm && (
                            <form onSubmit={handleLeaveSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                                    <input
                                        type="date" required
                                        className="w-full bg-gray-800 text-white p-2 rounded border border-gray-600 focus:border-blue-500 outline-none"
                                        value={leaveForm.startDate}
                                        onChange={e => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">End Date</label>
                                    <input
                                        type="date" required
                                        className="w-full bg-gray-800 text-white p-2 rounded border border-gray-600 focus:border-blue-500 outline-none"
                                        value={leaveForm.endDate}
                                        onChange={e => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Reason</label>
                                    <textarea
                                        required rows="3"
                                        className="w-full bg-gray-800 text-white p-2 rounded border border-gray-600 focus:border-blue-500 outline-none"
                                        value={leaveForm.reason}
                                        onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                                    ></textarea>
                                </div>
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition shadow-lg">
                                    Submit Request
                                </button>
                            </form>
                        )}

                        {!showForm && (
                            <div className="text-center py-10">
                                <p className="text-gray-400 mb-4">Need time off?</p>
                                <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition shadow-lg transform hover:scale-105">
                                    Apply for Leave
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
