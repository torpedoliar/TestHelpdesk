import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Kanban,
    List,
    Settings,
    Users,
    LogOut,
    Plus,
    FileSpreadsheet,
    BookOpen,
    Clock
} from 'lucide-react';
import { useAuth } from '../../stores/useAuth';
import { CreateTicketDialog } from '../../features/ticket-board/components/CreateTicketDialog';

export const BentoSidebar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const adminLinks = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/kanban', icon: Kanban, label: 'Kanban Board' },
        { path: '/tickets/list', icon: List, label: 'All Tickets' },
        { path: '/agents', icon: Users, label: 'Agents' },
        { path: '/reports', icon: FileSpreadsheet, label: 'Reports' },
        { path: '/sla', icon: Clock, label: 'SLA Settings' },
        { path: '/kb', icon: BookOpen, label: 'Knowledge Base' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    const links = user?.role === 'USER' ? [] : adminLinks;

    return (
        <>
            <aside className="w-72 flex-shrink-0 bg-white border-r border-gray-100 hidden md:flex flex-col h-full shadow-sm">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-mint to-sky-blue rounded-3xl flex items-center justify-center shadow-md">
                            <span className="text-2xl font-bold text-gray-700">H</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                                HelpDesk
                            </h1>
                            <p className="text-xs text-gray-500">Support Portal</p>
                        </div>
                    </div>

                    {user?.role !== 'USER' && (
                        <button
                            onClick={() => setIsCreateTicketOpen(true)}
                            className="w-full bg-gradient-to-r from-mint to-sky-blue text-gray-800 font-semibold py-4 px-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                        >
                            <Plus className="w-5 h-5" />
                            <span>New Ticket</span>
                        </button>
                    )}
                </div>

                <div className="flex-1 p-4 overflow-y-auto">
                    <nav className="space-y-2">
                        {links.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 ${isActive
                                        ? 'bg-gradient-to-r from-mint/30 to-sky-blue/30 text-gray-800 shadow-md font-semibold'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                    }`
                                }
                            >
                                <link.icon className="w-5 h-5" />
                                <span className="text-base">{link.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-5 py-4 w-full rounded-2xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-base font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            <CreateTicketDialog
                isOpen={isCreateTicketOpen}
                onClose={() => setIsCreateTicketOpen(false)}
            />
        </>
    );
};
