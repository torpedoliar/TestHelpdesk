import React, { useState } from 'react';
import { DndContext, DragEndEvent, useDroppable } from '@dnd-kit/core';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Clock, User, MessageSquare } from 'lucide-react';
import api from '../../../lib/api';

const fetchTickets = async () => {
    const res = await api.get('/tickets');
    return res.data;
};

const COLUMNS = [
    { id: 'TODO', title: 'New Tickets', color: 'from-mint/30 to-mint/10', badge: 'bg-mint' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'from-sky-blue/30 to-sky-blue/10', badge: 'bg-sky-blue' },
    { id: 'WAITING_VENDOR', title: 'Pending', color: 'from-pale-yellow/30 to-pale-yellow/10', badge: 'bg-pale-yellow' },
    { id: 'RESOLVED', title: 'Resolved', color: 'from-lavender/30 to-lavender/10', badge: 'bg-lavender' },
];

const BentoTicketCard = ({ ticket, onClick }: any) => {
    const priorityColors: any = {
        LOW: 'bg-sky-blue/50 text-gray-700',
        MEDIUM: 'bg-pale-yellow/50 text-gray-700',
        HIGH: 'bg-soft-coral/50 text-gray-700',
        CRITICAL: 'bg-soft-coral text-white',
    };

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-3xl p-6 mb-4 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:scale-[1.02] transform"
        >
            <div className="flex items-start justify-between mb-4">
                <span className={`px-3 py-1.5 rounded-2xl text-xs font-semibold ${priorityColors[ticket.priority]}`}>
                    {ticket.priority}
                </span>
                <span className="text-xs text-gray-400 font-mono">#{ticket.id.slice(0, 6)}</span>
            </div>

            <h4 className="text-base font-semibold text-gray-800 mb-4 line-clamp-2">
                {ticket.title}
            </h4>

            <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-mint to-sky-blue flex items-center justify-center text-sm font-bold text-gray-700">
                        {ticket.user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <span className="text-xs">{ticket.user?.fullName?.split(' ')[0] || 'User'}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>2</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>2h</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const KanbanColumn = ({ id, title, color, badge, children }: any) => {
    const { setNodeRef } = useDroppable({ id });
    const count = React.Children.count(children);

    return (
        <div ref={setNodeRef} className="flex-1 min-w-[320px]">
            <div className={`bg-gradient-to-br ${color} rounded-3xl p-6 mb-4 shadow-sm`}>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    <span className={`${badge} text-gray-700 px-3 py-1 rounded-2xl text-sm font-bold shadow-sm`}>
                        {count}
                    </span>
                </div>
            </div>
            <div className="space-y-3 min-h-[400px] px-2">{children}</div>
        </div>
    );
};

export const BentoTicketKanban: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

    const { data: tickets = [] } = useQuery({
        queryKey: ['tickets'],
        queryFn: fetchTickets,
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            await api.patch(`/tickets/${id}/status`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tickets'] });
        },
    });

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const ticketId = active.data.current?.ticket?.id;
            if (ticketId) {
                updateStatusMutation.mutate({
                    id: ticketId,
                    status: over.id as string,
                });
            }
        }
    };

    return (
        <div className="h-full">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                    Ticket Board
                </h1>
                <p className="text-lg text-gray-500">Manage and track all support tickets</p>
            </div>

            <DndContext onDragEnd={handleDragEnd}>
                <div className="flex gap-6 overflow-x-auto pb-4">
                    {COLUMNS.map((col) => (
                        <KanbanColumn
                            key={col.id}
                            id={col.id}
                            title={col.title}
                            color={col.color}
                            badge={col.badge}
                        >
                            {tickets
                                .filter((t: any) => t.status === col.id)
                                .map((ticket: any) => (
                                    <BentoTicketCard
                                        key={ticket.id}
                                        ticket={ticket}
                                        onClick={() => setSelectedTicketId(ticket.id)}
                                    />
                                ))}
                        </KanbanColumn>
                    ))}
                </div>
            </DndContext>
        </div>
    );
};
