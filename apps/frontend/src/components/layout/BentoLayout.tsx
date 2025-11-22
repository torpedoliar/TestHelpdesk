import React from 'react';
import { Outlet } from 'react-router-dom';
import { BentoSidebar } from './BentoSidebar';
import { BentoTopbar } from './BentoTopbar';
import { Toaster } from 'sonner';

export const BentoLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-cream overflow-hidden">
            <BentoSidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <BentoTopbar />

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
            <Toaster position="top-right" />
        </div>
    );
};
