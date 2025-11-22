import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { BentoLoginPage } from './features/auth/pages/BentoLoginPage';
import { UnauthorizedPage } from './features/auth/pages/UnauthorizedPage';
import { BentoLayout } from './components/layout/BentoLayout';
import { BentoDashboardPage } from './features/dashboard/pages/BentoDashboardPage';
import { BentoTicketKanban } from './features/ticket-board/components/BentoTicketKanban';
import { TicketListPage } from './features/ticket-board/pages/TicketListPage';
import { SettingsPage } from './features/settings/pages/SettingsPage';
import { AdminAgentsPage } from './features/admin/pages/AdminAgentsPage';
import { ClientLayout } from './components/layout/ClientLayout';
import { MyTicketsPage } from './features/client/pages/MyTicketsPage';
import { ReportsPage } from './features/reports/pages/ReportsPage';
import { KnowledgeBasePage } from './features/knowledge-base/pages/KnowledgeBasePage';
import { ArticleDetailPage } from './features/knowledge-base/pages/ArticleDetailPage';
import { SlaSettingsPage } from './features/admin/pages/SlaSettingsPage';
import { FeedbackPage } from './features/public/pages/FeedbackPage';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
                <Router>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<BentoLoginPage />} />
                        <Route path="/unauthorized" element={<UnauthorizedPage />} />
                        <Route path="/feedback/:token" element={<FeedbackPage />} />

                        {/* Admin/Agent Routes */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute allowedRoles={['ADMIN', 'AGENT']}>
                                    <BentoLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route path="dashboard" element={<BentoDashboardPage />} />
                            <Route path="kanban" element={<BentoTicketKanban />} />
                            <Route path="tickets/list" element={<TicketListPage />} />
                            <Route path="settings" element={<SettingsPage />} />
                            <Route
                                path="agents"
                                element={
                                    <ProtectedRoute allowedRoles={['ADMIN']}>
                                        <AdminAgentsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="reports"
                                element={
                                    <ProtectedRoute allowedRoles={['ADMIN']}>
                                        <ReportsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="sla"
                                element={
                                    <ProtectedRoute allowedRoles={['ADMIN']}>
                                        <SlaSettingsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="kb" element={<KnowledgeBasePage />} />
                            <Route path="kb/articles/:id" element={<ArticleDetailPage />} />
                            <Route index element={<Navigate to="/dashboard" replace />} />
                        </Route>

                        {/* Client Routes */}
                        <Route
                            path="/client"
                            element={
                                <ProtectedRoute allowedRoles={['USER']}>
                                    <ClientLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route path="my-tickets" element={<MyTicketsPage />} />
                            <Route path="create" element={<div>Create Ticket Form Placeholder</div>} />
                            <Route index element={<Navigate to="/client/my-tickets" replace />} />
                        </Route>

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </Router>
            </ErrorBoundary>
        </QueryClientProvider>
    );
}

export default App;
