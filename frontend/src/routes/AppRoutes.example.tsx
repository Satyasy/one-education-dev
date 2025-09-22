// Example usage of role-based routing
import { Routes, Route } from 'react-router';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import UnauthorizedPage from '../pages/Unauthorized';
import PermissionExamplePage from '../pages/PermissionExamplePage';

// Import your page components
// import Dashboard from '../pages/Dashboard';
// import PanjarList from '../pages/Panjars/PanjarList';
// import BudgetList from '../pages/Budgets/BudgetList';
// import UserSettings from '../pages/Settings/Users';

export const AppRoutes = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Protected routes - Dashboard (all authenticated users) */}
            <Route 
                path="/" 
                element={
                    <ProtectedRoute>
                        <div>Dashboard</div>
                        {/* <Dashboard /> */}
                    </ProtectedRoute>
                } 
            />
            
            {/* Protected routes - Panjar (multiple roles) */}
            <Route 
                path="/panjars/*" 
                element={
                    <ProtectedRoute roles={['admin', 'finance', 'unit_head', 'verifier', 'approver', 'employee']}>
                        <div>Panjar Pages</div>
                        {/* <PanjarList /> */}
                    </ProtectedRoute>
                } 
            />
            
            {/* Protected routes - Budget (admin, finance, unit_head only) */}
            <Route 
                path="/budgets/*" 
                element={
                    <ProtectedRoute roles={['admin', 'finance', 'unit_head']}>
                        <div>Budget Pages</div>
                        {/* <BudgetList /> */}
                    </ProtectedRoute>
                } 
            />
            
            {/* Permission Example Page - Available to all authenticated users */}
            <Route 
                path="/permission-example" 
                element={
                    <ProtectedRoute>
                        <PermissionExamplePage />
                    </ProtectedRoute>
                } 
            />
            
            {/* Protected routes - Settings (admin only) */}
            <Route 
                path="/users/*" 
                element={
                    <ProtectedRoute roles={['admin', 'super_admin']}>
                        <div>User Settings</div>
                        {/* <UserSettings /> */}
                    </ProtectedRoute>
                } 
            />
            
            {/* Catch all - redirect to unauthorized if not found */}
            <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
    );
};

// Example of using the withRoleProtection HOC
// import { withRoleProtection } from '../components/common/ProtectedRoute';
// const ProtectedBudgetPage = withRoleProtection(BudgetList, ['admin', 'finance', 'unit_head']);
