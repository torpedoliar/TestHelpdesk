import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, Users, Ticket, CheckCircle, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import api from '../../../lib/api';

const BentoCard = ({ children, className = '' }: any) => (
    <div className={`bg-white rounded-[32px] p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
        {children}
    </div>
);

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <BentoCard>
        <div className="flex items-start justify-between">
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-3">{title}</p>
                <h3 className="text-4xl font-bold text-gray-800 mb-2">{value}</h3>
                {trend && (
                    <div className="flex items-center gap-1 text-sm text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>{trend}</span>
                    </div>
                )}
            </div>
            <div className={`p-4 rounded-2xl ${color}`}>
                <Icon className="w-7 h-7" />
            </div>
        </div>
    </BentoCard>
);

export const BentoDashboardPage: React.FC = () => {
    const { data: csatStats } = useQuery({
        queryKey: ['csat-stats'],
        queryFn: async () => {
            const res = await api.get('/surveys/stats');
            return res.data;
        },
    });

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                    Welcome back!
                </h1>
                <p className="text-lg text-gray-500">Here's what's happening with your support team today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Tickets"
                    value="1,234"
                    icon={Ticket}
                    color="bg-sky-blue text-gray-700"
                    trend="+12% from last week"
                />
                <StatCard
                    title="Active Agents"
                    value="12"
                    icon={Users}
                    color="bg-lavender text-gray-700"
                />
                <StatCard
                    title="Resolved Today"
                    value="45"
                    icon={CheckCircle}
                    color="bg-mint text-gray-700"
                    trend="+8% from yesterday"
                />
                <StatCard
                    title="Avg. CSAT Score"
                    value={csatStats?.averageRating ? csatStats.averageRating.toFixed(1) : 'N/A'}
                    icon={Star}
                    color="bg-pale-yellow text-gray-700"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <BentoCard className="lg:col-span-2">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                        {[
                            { ticket: 'TKT-1234', status: 'Resolved', time: '5 mins ago', color: 'bg-mint' },
                            { ticket: 'TKT-1235', status: 'In Progress', time: '12 mins ago', color: 'bg-sky-blue' },
                            { ticket: 'TKT-1236', status: 'New', time: '23 mins ago', color: 'bg-pale-yellow' },
                            { ticket: 'TKT-1237', status: 'Resolved', time: '45 mins ago', color: 'bg-mint' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <span className={`px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 ${item.color}`}>
                                        {item.ticket}
                                    </span>
                                    <span className="text-gray-600">{item.status}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Clock className="w-4 h-4" />
                                    {item.time}
                                </div>
                            </div>
                        ))}
                    </div>
                </BentoCard>

                <BentoCard>
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Stats</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">Response Time</span>
                                <span className="text-sm font-bold text-gray-800">2.3h</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-mint to-sky-blue rounded-full" style={{ width: '75%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">Resolution Rate</span>
                                <span className="text-sm font-bold text-gray-800">94%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-mint to-sky-blue rounded-full" style={{ width: '94%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">Customer Satisfaction</span>
                                <span className="text-sm font-bold text-gray-800">4.8/5</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-mint to-sky-blue rounded-full" style={{ width: '96%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-soft-coral/20 rounded-2xl border border-soft-coral/30">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-soft-coral flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-gray-800">3 Overdue Tickets</p>
                                <p className="text-xs text-gray-600 mt-1">Require immediate attention</p>
                            </div>
                        </div>
                    </div>
                </BentoCard>
            </div>
        </div>
    );
};
