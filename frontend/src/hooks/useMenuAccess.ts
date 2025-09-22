import { useRole } from './useAuth';

/**
 * Hook untuk mengecek akses menu berdasarkan roles dan permissions
 */
export const useMenuAccess = () => {
    const { 
        hasAnyRole, 
        hasAnyPermission, 
        isAdmin,
        canViewPanjarRequests,
        canViewPanjarItems,
        hasPermission,
        user
    } = useRole();
    
    const canAccessDashboard = (): boolean => {
        console.log('canAccessDashboard called');
        return true; // All authenticated users
    };
    
    const canAccessPanjar = (): boolean => {
        if (isAdmin()) return true;
        
        // Check if user can view panjar requests or items
        return canViewPanjarRequests() || canViewPanjarItems() || 
               hasAnyRole([
                   'kepala-sekolah', 
                   'kepala-administrasi',
                   'wakil-kepala-sekolah', 
                   'kepala-urusan'
               ]);
    };
    
    const canAccessBudget = (): boolean => {
        if (isAdmin()) return true;
        
        const budgetRoles = [
            'kepala-sekolah',
            'kepala-administrasi' 
        ];
        
        const budgetPermissions = [
            'view budget',
            'create budget',
            'edit budget'
        ];
        
        return hasAnyRole(budgetRoles) || hasAnyPermission(budgetPermissions);
    };
    
    const canAccessSettings = (): boolean => {
        return isAdmin() || hasPermission('manage settings');
    };
    
    const canAccessUsers = (): boolean => {
        return isAdmin() || hasPermission('manage users');
    };
    
    const canAccessReports = (): boolean => {
        if (isAdmin()) return true;
        
        const reportRoles = [
            'kepala-sekolah',
            'kepala-administrasi'
        ];
        
        const reportPermissions = [
            'view reports',
            'generate reports'
        ];
        
        return hasAnyRole(reportRoles) || hasAnyPermission(reportPermissions);
    };
    
    return {
        canAccessDashboard,
        canAccessPanjar,
        canAccessBudget,
        canAccessSettings,
        canAccessUsers,
        canAccessReports,
    };
};

/**
 * Hook khusus untuk authorization panjar berdasarkan permissions yang sebenarnya
 */
export const usePanjarAuthorization = () => {
    const { 
        user, 
        isAdmin,
        canViewPanjarRequests,
        canCreatePanjarRequests,
        canEditPanjarRequests,
        canDeletePanjarRequests,
        canVerifyPanjarRequests,
        canApprovePanjarRequests,
        canRevisePanjarRequests,
        canRejectPanjarRequests,
        canViewPanjarItems,
        canCreatePanjarItems,
        canEditPanjarItems,
        canDeletePanjarItems,
        canVerifyPanjarItems,
        canApprovePanjarItems,
        canRevisePanjarItems,
        canRejectPanjarItems,
    } = useRole();
    
    /**
     * Comprehensive permission checking for panjar workflow
     */
    const canCreatePanjar = (): boolean => {
        return canCreatePanjarRequests();
    };
    
    const canViewPanjar = (): boolean => {
        return canViewPanjarRequests() || canViewPanjarItems();
    };
    
    const canEditPanjar = (status?: string, isCreator?: boolean): boolean => {
        if (!canEditPanjarRequests()) return false;
        
        // Business rules based on status
        if (status === 'approved') return false;
        if (status === 'rejected') return Boolean(isCreator); // Only creator can edit rejected panjar
        
        return true;
    };
    
    const canDeletePanjar = (status?: string, isCreator?: boolean): boolean => {
        if (!canDeletePanjarRequests()) return false;
        
        // Only draft panjar can be deleted and only by creator or admin
        return status === 'draft' && (Boolean(isCreator) || isAdmin());
    };
    
    const canVerifyPanjar = (): boolean => {
        return canVerifyPanjarRequests();
    };
    
    const canApprovePanjar = (): boolean => {
        return canApprovePanjarRequests();
    };
    
    const canRevisePanjar = (): boolean => {
        return canRevisePanjarRequests();
    };
    
    const canRejectPanjar = (): boolean => {
        return canRejectPanjarRequests();
    };
    
    // Panjar Items specific permissions
    const canManagePanjarItems = () => {
        return {
            canView: canViewPanjarItems(),
            canCreate: canCreatePanjarItems(),
            canEdit: canEditPanjarItems(),
            canDelete: canDeletePanjarItems(),
            canVerify: canVerifyPanjarItems(),
            canApprove: canApprovePanjarItems(),
            canRevise: canRevisePanjarItems(),
            canReject: canRejectPanjarItems(),
        };
    };
    
    /**
     * Get complete workflow permissions for current user
     */
    const getWorkflowPermissions = () => {
        return {
            // Panjar Request permissions
            panjarRequests: {
                canView: canViewPanjar(),
                canCreate: canCreatePanjar(),
                canEdit: canEditPanjarRequests(),
                canDelete: canDeletePanjarRequests(),
                canVerify: canVerifyPanjar(),
                canApprove: canApprovePanjar(),
                canRevise: canRevisePanjar(),
                canReject: canRejectPanjar(),
            },
            // Panjar Items permissions
            panjarItems: canManagePanjarItems(),
            // User info
            user: {
                id: user?.id,
                name: user?.name,
                roles: user?.roles,
                isAdmin: isAdmin(),
            }
        };
    };
    
    /**
     * Check if user can perform action on specific panjar
     */
    const canPerformAction = (
        action: string, 
        panjarStatus?: string, 
        isCreator?: boolean
    ): boolean => {
        switch (action) {
            case 'view':
                return canViewPanjar();
            case 'create':
                return canCreatePanjar();
            case 'edit':
                return canEditPanjar(panjarStatus, isCreator);
            case 'delete':
                return canDeletePanjar(panjarStatus, isCreator);
            case 'verify':
                return canVerifyPanjar() && panjarStatus === 'pending';
            case 'approve':
                return canApprovePanjar() && panjarStatus === 'verified';
            case 'revise':
                return canRevisePanjar() && ['pending', 'verified'].includes(panjarStatus || '');
            case 'reject':
                return canRejectPanjar() && ['pending', 'verified'].includes(panjarStatus || '');
            default:
                return false;
        }
    };
    
    return {
        // Main permissions
        canCreatePanjar,
        canViewPanjar,
        canEditPanjar,
        canDeletePanjar,
        canVerifyPanjar,
        canApprovePanjar,
        canRevisePanjar,
        canRejectPanjar,
        
        // Item permissions
        canManagePanjarItems,
        
        // Utility functions
        getWorkflowPermissions,
        canPerformAction,
        
        // User info
        user,
    };
};
