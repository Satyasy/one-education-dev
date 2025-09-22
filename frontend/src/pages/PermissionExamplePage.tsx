import React from 'react';
import { usePanjarAuthorization } from '../hooks/useMenuAccess';
import { useRole } from '../hooks/useAuth';
import UserDebugInfo from '../components/debug/UserDebugInfo';

interface PanjarCardProps {
  panjar: {
    id: number;
    title: string;
    status: 'draft' | 'pending' | 'verified' | 'approved' | 'rejected';
    created_by: string | number;
    amount: number;
  };
  currentUserId: string | number;
}

const PanjarCard: React.FC<PanjarCardProps> = ({ panjar, currentUserId }) => {
  const panjarAuth = usePanjarAuthorization();
  const { user } = useRole();
  
  const isCreator = String(panjar.created_by) === String(currentUserId);
  
  // Get all available actions for this panjar
  const availableActions = {
    canEdit: panjarAuth.canEditPanjar(panjar.status, isCreator),
    canDelete: panjarAuth.canDeletePanjar(panjar.status, isCreator),
    canVerify: panjarAuth.canPerformAction('verify', panjar.status, isCreator),
    canApprove: panjarAuth.canPerformAction('approve', panjar.status, isCreator),
    canRevise: panjarAuth.canPerformAction('revise', panjar.status, isCreator),
    canReject: panjarAuth.canPerformAction('reject', panjar.status, isCreator),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {panjar.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ID: {panjar.id} {isCreator && '(Created by you)'}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(panjar.status)}`}>
          {panjar.status.toUpperCase()}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Amount: <span className="font-semibold">{formatCurrency(panjar.amount)}</span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {availableActions.canEdit && (
          <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">
            Edit
          </button>
        )}
        
        {availableActions.canDelete && (
          <button className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors">
            Delete
          </button>
        )}
        
        {availableActions.canVerify && (
          <button className="px-3 py-1 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600 transition-colors">
            Verify
          </button>
        )}
        
        {availableActions.canApprove && (
          <button className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors">
            Approve
          </button>
        )}
        
        {availableActions.canRevise && (
          <button className="px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition-colors">
            Revise
          </button>
        )}
        
        {availableActions.canReject && (
          <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors">
            Reject
          </button>
        )}
      </div>

      {/* Debug Information - Remove in production */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-500 dark:text-gray-400">
            Debug: Permission Info
          </summary>
          <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900 rounded text-gray-600 dark:text-gray-300">
            <p><strong>User:</strong> {user?.name} (ID: {user?.id})</p>
            <p><strong>User Roles:</strong> {user?.roles?.map(r => 
              typeof r === 'string' ? r : (r as any)?.name || 'Role'
            ).join(', ')}</p>
            <p><strong>Is Creator:</strong> {isCreator ? 'Yes' : 'No'}</p>
            <p><strong>Panjar Status:</strong> {panjar.status}</p>
            <p><strong>Available Actions:</strong></p>
            <ul className="ml-4 list-disc">
              {Object.entries(availableActions).map(([action, allowed]) => (
                <li key={action} className={allowed ? 'text-green-600' : 'text-red-600'}>
                  {action}: {allowed ? 'Allowed' : 'Denied'}
                </li>
              ))}
            </ul>
          </div>
        </details>
      </div>
    </div>
  );
};

/**
 * Example page showing permission-based UI
 */
const PermissionExamplePage: React.FC = () => {
  const { user } = useRole();
  const panjarAuth = usePanjarAuthorization();

  // Debug: Check if user exists
  console.log('PermissionExamplePage - User:', user);
  console.log('PermissionExamplePage - User roles:', user?.roles);
  console.log('PermissionExamplePage - User permissions:', user?.permissions);

  // If no user, show message instead of crashing
  if (!user) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Permission System Example
          </h1>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">No user data found!</p>
            <p>Please make sure you are logged in. This page requires authentication.</p>
            <p className="mt-2 text-sm">Debug info: User object is null or undefined</p>
          </div>
          
          {/* Debug component to help troubleshoot authentication */}
          <UserDebugInfo />
        </div>
      </div>
    );
  }

  // Sample panjar data
  const samplePanjars = [
    {
      id: 1,
      title: 'Office Supplies Purchase',
      status: 'draft' as const,
      created_by: user?.id || 1,
      amount: 5000000,
    },
    {
      id: 2,
      title: 'Travel Expenses',
      status: 'pending' as const,
      created_by: 999, // Different user
      amount: 8000000,
    },
    {
      id: 3,
      title: 'Equipment Maintenance',
      status: 'verified' as const,
      created_by: user?.id || 1,
      amount: 3000000,
    },
    {
      id: 4,
      title: 'Training Budget',
      status: 'approved' as const,
      created_by: 999, // Different user
      amount: 12000000,
    },
  ];

  // Get workflow permissions summary
  const workflowPermissions = panjarAuth.getWorkflowPermissions();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Permission System Example
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          This page demonstrates the role-based permission system in action.
        </p>
      </div>

      {/* User Permission Summary */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Your Permissions Summary
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Panjar Request Permissions
            </h3>
            <ul className="space-y-1 text-sm">
              {Object.entries(workflowPermissions.panjarRequests).map(([action, allowed]) => (
                <li key={action} className={`flex items-center gap-2 ${allowed ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`w-2 h-2 rounded-full ${allowed ? 'bg-green-500' : 'bg-red-500'}`} />
                  {action.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Panjar Item Permissions
            </h3>
            <ul className="space-y-1 text-sm">
              {Object.entries(workflowPermissions.panjarItems).map(([action, allowed]) => (
                <li key={action} className={`flex items-center gap-2 ${allowed ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`w-2 h-2 rounded-full ${allowed ? 'bg-green-500' : 'bg-red-500'}`} />
                  {action.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Sample Panjar Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Sample Panjar Cards (Action buttons based on your permissions)
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {samplePanjars.map((panjar) => (
            <PanjarCard
              key={panjar.id}
              panjar={panjar}
              currentUserId={typeof user?.id === 'number' ? user.id : parseInt(String(user?.id)) || 1}
            />
          ))}
        </div>
      </div>

      {/* Create Panjar Button */}
      {panjarAuth.canCreatePanjar() && (
        <div className="text-center">
          <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Create New Panjar Request
          </button>
        </div>
      )}
    </div>
  );
};

export default PermissionExamplePage;
