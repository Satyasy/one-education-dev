import React from 'react';
import { PermissionGate } from '../components/auth/ProtectedRoute';
import { useRole } from '../hooks/useAuth';
import { usePanjarAuthorization } from '../hooks/useMenuAccess';

/**
 * Example Dashboard showing permission-based content
 */
const Dashboard: React.FC = () => {
  const { user, isAdmin } = useRole();
  const panjarAuth = usePanjarAuthorization();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Welcome back, {user?.name}!
        </p>
      </div>

      {/* Stats Cards with Permission-based visibility */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Always visible */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Welcome
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            🎉
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            You are logged in!
          </p>
        </div>

        {/* Only visible if user can view panjar */}
        <PermissionGate permissions={['view panjar requests']}>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Panjar Requests
            </h3>
            <p className="text-3xl font-bold text-green-600">
              24
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Active requests
            </p>
          </div>
        </PermissionGate>

        {/* Only visible if user can view budget */}
        <PermissionGate permissions={['view budget']}>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Budget
            </h3>
            <p className="text-3xl font-bold text-orange-600">
              85%
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Budget utilized
            </p>
          </div>
        </PermissionGate>

        {/* Admin only */}
        <PermissionGate roles={['admin']}>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              System
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              ⚙️
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Admin panel
            </p>
          </div>
        </PermissionGate>
      </div>

      {/* Quick Actions with Permission-based buttons */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        
        <div className="flex flex-wrap gap-3">
          {/* Create Panjar - Only if user has permission */}
          {panjarAuth.canCreatePanjar() && (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Create Panjar Request
            </button>
          )}

          {/* Approve Panjar - Only if user can approve */}
          {panjarAuth.canApprovePanjar() && (
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Approve Requests
            </button>
          )}

          {/* Create Budget - Only if user has permission */}
          <PermissionGate permissions={['create budget']}>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Create Budget
            </button>
          </PermissionGate>

          {/* Admin Settings - Admin only */}
          {isAdmin() && (
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              System Settings
            </button>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        
        <div className="space-y-3">
          {/* Sample activities with permission-based visibility */}
          <PermissionGate permissions={['view panjar requests']}>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  New panjar request submitted
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  2 hours ago
                </p>
              </div>
            </div>
          </PermissionGate>

          <PermissionGate permissions={['approve panjar requests']}>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Panjar request approved
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  4 hours ago
                </p>
              </div>
            </div>
          </PermissionGate>

          <PermissionGate permissions={['view budget']}>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Budget updated
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  1 day ago
                </p>
              </div>
            </div>
          </PermissionGate>

          <PermissionGate roles={['admin']}>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  System backup completed
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  2 days ago
                </p>
              </div>
            </div>
          </PermissionGate>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
