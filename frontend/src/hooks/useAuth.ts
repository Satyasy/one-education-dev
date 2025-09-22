import { useContext } from "react";
import { AuthContext, AuthContextType } from "../context/AuthContext";

export const useAuth = (): AuthContextType => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return authContext;
};

export const useRole = () => {
    const { user } = useAuth();
    
    // Role Checkers
    const hasRole = (role: string): boolean => {
        return user?.roles?.includes(role) || false;
    };
    
    const hasAnyRole = (roles: string[]): boolean => {
        return roles.some(role => hasRole(role));
    };
    
    const hasAllRoles = (roles: string[]): boolean => {
        return roles.every(role => hasRole(role));
    };
    
    // Permission Checkers (from Spatie Laravel Permission structure)
    const hasPermission = (permission: string): boolean => {
        return user?.permissions?.permission_names?.includes(permission) || false;
    };
    
    const hasAnyPermission = (permissions: string[]): boolean => {
        return permissions.some(permission => hasPermission(permission));
    };
    
    const hasAllPermissions = (permissions: string[]): boolean => {
        return permissions.every(permission => hasPermission(permission));
    };
    
    // Role Helper Functions
    const isAdmin = (): boolean => {
        return hasRole('admin');
    };
    
    const isKepalaSekolah = (): boolean => {
        return hasRole('kepala-sekolah');
    };
    
    const isKepalaAdministrasi = (): boolean => {
        return hasRole('kepala-administrasi');
    };
    
    const isWakilKepalaSekolah = (): boolean => {
        return hasRole('wakil-kepala-sekolah');
    };
    
    const isKepalaUrusan = (): boolean => {
        return hasRole('kepala-urusan');
    };
    
    const isStaff = (): boolean => {
        return hasRole('staff');
    };
    
    const isGuru = (): boolean => {
        return hasRole('guru');
    };
    
    const isSiswa = (): boolean => {
        return hasRole('siswa');
    };
    
    // Permission Helper Functions (based on actual permissions from your JSON)
    const canViewPanjarRequests = (): boolean => {
        return hasPermission('view panjar-requests');
    };
    
    const canCreatePanjarRequests = (): boolean => {
        return hasPermission('create panjar-requests');
    };
    
    const canEditPanjarRequests = (): boolean => {
        return hasPermission('edit panjar-requests');
    };
    
    const canDeletePanjarRequests = (): boolean => {
        return hasPermission('delete panjar-requests');
    };
    
    const canVerifyPanjarRequests = (): boolean => {
        return hasPermission('verify panjar-requests');
    };
    
    const canApprovePanjarRequests = (): boolean => {
        return hasPermission('approve panjar-requests');
    };
    
    const canRevisePanjarRequests = (): boolean => {
        return hasPermission('revise panjar-requests');
    };
    
    const canRejectPanjarRequests = (): boolean => {
        return hasPermission('reject panjar-requests');
    };
    
    // Panjar Items Permissions
    const canViewPanjarItems = (): boolean => {
        return hasPermission('view panjar-items');
    };
    
    const canCreatePanjarItems = (): boolean => {
        return hasPermission('create panjar-items');
    };
    
    const canEditPanjarItems = (): boolean => {
        return hasPermission('edit panjar-items');
    };
    
    const canDeletePanjarItems = (): boolean => {
        return hasPermission('delete panjar-items');
    };
    
    const canVerifyPanjarItems = (): boolean => {
        return hasPermission('verify panjar-items');
    };
    
    const canApprovePanjarItems = (): boolean => {
        return hasPermission('approve panjar-items');
    };
    
    const canRevisePanjarItems = (): boolean => {
        return hasPermission('revise panjar-items');
    };
    
    const canRejectPanjarItems = (): boolean => {
        return hasPermission('reject panjar-items');
    };
    
    // Get all permission names as array
    const getPermissionNames = (): string[] => {
        return user?.permissions?.permission_names || [];
    };
    
    // Get permissions with details
    const getAllPermissions = () => {
        return user?.permissions?.all_permissions || [];
    };
    
    // Get direct permissions (assigned directly to user, not via roles)
    const getDirectPermissions = () => {
        return user?.permissions?.direct_permissions || [];
    };
    
    // Get permissions via roles
    const getPermissionsViaRoles = () => {
        return user?.permissions?.permissions_via_roles || [];
    };
    
    return {
        user,
        roles: user?.roles || [],
        permissions: getPermissionNames(),
        
        // Role methods
        hasRole,
        hasAnyRole,
        hasAllRoles,
        
        // Permission methods
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        
        // Role checkers
        isAdmin,
        isKepalaSekolah,
        isKepalaAdministrasi,
        isWakilKepalaSekolah,
        isKepalaUrusan,
        isStaff,
        isGuru,
        isSiswa,
        
        // Panjar Request Permission checkers
        canViewPanjarRequests,
        canCreatePanjarRequests,
        canEditPanjarRequests,
        canDeletePanjarRequests,
        canVerifyPanjarRequests,
        canApprovePanjarRequests,
        canRevisePanjarRequests,
        canRejectPanjarRequests,
        
        // Panjar Items Permission checkers
        canViewPanjarItems,
        canCreatePanjarItems,
        canEditPanjarItems,
        canDeletePanjarItems,
        canVerifyPanjarItems,
        canApprovePanjarItems,
        canRevisePanjarItems,
        canRejectPanjarItems,
        
        // Permission getters
        getPermissionNames,
        getAllPermissions,
        getDirectPermissions,
        getPermissionsViaRoles,
    };
};
