import React from 'react';
import { useRole } from '../../hooks/useAuth';

/**
 * Debug component to show current user state and create mock user
 */
const UserDebugInfo: React.FC = () => {
  const { user } = useRole();

  const createMockUser = () => {
    // This would normally come from your AuthContext
    const mockUser = {
      id: 1,
      name: 'Demo User',
      email: 'demo@example.com',
      roles: ['admin'],
      permissions: {
        permission_names: [
          'view panjar requests',
          'create panjar requests',
          'edit panjar requests',
          'delete panjar requests',
          'verify panjar requests',
          'approve panjar requests',
          'revise panjar requests',
          'reject panjar requests',
          'view panjar items',
          'create panjar items',
          'edit panjar items',
          'delete panjar items',
          'verify panjar items',
          'approve panjar items',
          'revise panjar items',
          'reject panjar items',
          'view budget',
          'create budget',
          'edit budget',
          'delete budget',
          'view reports',
          'generate reports',
          'manage users',
          'manage settings'
        ],
        can: {},
        all_permissions: [],
        permissions_via_roles: [],
        direct_permissions: []
      }
    };
    
    console.log('Mock user created:', mockUser);
    alert('Check console for mock user data. In real app, this would come from login.');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">
          🔍 User Authentication Debug
        </h2>
        
        {user ? (
          <div className="text-green-700">
            <p><strong>✅ User is authenticated!</strong></p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Roles:</strong> {Array.isArray(user.roles) ? user.roles.join(', ') : 'No roles'}</p>
            <p><strong>Permissions:</strong> {user.permissions?.permission_names?.length || 0} permissions found</p>
          </div>
        ) : (
          <div className="text-red-700">
            <p><strong>❌ No user found!</strong></p>
            <p>The permission system requires a logged-in user.</p>
            <p className="mt-2">
              <strong>Possible solutions:</strong>
            </p>
            <ul className="list-disc ml-6 mt-1">
              <li>Make sure AuthContext is providing user data</li>
              <li>Check if login process sets user in context</li>
              <li>Verify AuthProvider wraps your app</li>
              <li>Use the mock user button below for testing</li>
            </ul>
            
            <button
              onClick={createMockUser}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Create Mock User (for testing)
            </button>
          </div>
        )}
      </div>

      {/* Show raw user object for debugging */}
      {user && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Raw User Object:</h3>
          <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-96">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default UserDebugInfo;
