import { useAuth } from "../hooks/useAuth";

const DynamicRouteExamplePage = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dynamic Route Protection Examples</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Current User Info</h2>
        <p className="text-gray-600">Roles: <span className="font-medium">{user?.roles?.join(', ') || 'Not logged in'}</span></p>
      </div>

      <div className="grid gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Admin Only Routes</h3>
          <p className="text-blue-600 text-sm">
            Routes with <code className="bg-blue-100 px-2 py-1 rounded">requireAdmin</code> prop
          </p>
          <div className="mt-2">
            <code className="text-xs bg-blue-100 p-2 rounded block">
              {'<EnhancedProtectedRoute requireAdmin><Component /></EnhancedProtectedRoute>'}
            </code>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">Permission-based Routes</h3>
          <p className="text-green-600 text-sm">
            Routes with specific permission requirements
          </p>
          <div className="mt-2">
            <code className="text-xs bg-green-100 p-2 rounded block">
              {'<EnhancedProtectedRoute permissions={["budget.create"]}><Component /></EnhancedProtectedRoute>'}
            </code>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-800 mb-2">Role-based Routes</h3>
          <p className="text-purple-600 text-sm">
            Routes accessible by specific roles
          </p>
          <div className="mt-2">
            <code className="text-xs bg-purple-100 p-2 rounded block">
              {'<EnhancedProtectedRoute roles={["kepala-urusan"]}><Component /></EnhancedProtectedRoute>'}
            </code>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="font-semibold text-orange-800 mb-2">Combined Protection</h3>
          <p className="text-orange-600 text-sm">
            Routes with both role and permission requirements
          </p>
          <div className="mt-2">
            <code className="text-xs bg-orange-100 p-2 rounded block">
              {'<EnhancedProtectedRoute roles={["kepala-urusan"]} permissions={["panjar.create"]}><Component /></EnhancedProtectedRoute>'}
            </code>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h3 className="font-semibold text-indigo-800 mb-2">Convenience Components</h3>
          <p className="text-indigo-600 text-sm">
            Pre-configured components for common route patterns
          </p>
          <div className="mt-2 space-y-2">
            <code className="text-xs bg-indigo-100 p-2 rounded block">
              {'<PanjarRoute><PanjarList /></PanjarRoute>'}
            </code>
            <code className="text-xs bg-indigo-100 p-2 rounded block">
              {'<BudgetRoute><BudgetList /></BudgetRoute>'}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicRouteExamplePage;
