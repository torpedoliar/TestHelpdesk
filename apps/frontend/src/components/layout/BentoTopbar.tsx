import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { useAuth } from '../../stores/useAuth';

export const BentoTopbar: React.FC = () => {
    const { user } = useAuth();

    return (
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm">
            <div className="flex items-center flex-1 max-w-xl">
                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-blue focus:border-transparent transition-all"
                        placeholder="Search tickets, agents, or knowledge base..."
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 ml-8">
                <button className="relative p-3 rounded-2xl hover:bg-gray-50 transition-all">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-soft-coral rounded-full"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-800">{user?.fullName || 'User'}</p>
                        <p className="text-xs text-gray-500">{user?.role || 'Agent'}</p>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-mint to-sky-blue flex items-center justify-center shadow-md overflow-hidden">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-5 h-5 text-gray-700" />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
