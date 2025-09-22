export interface Employee {
    id: number;
    unit: {
        id: number;
        name: string;
    };
    position: {
        id: number;
        name: string;
    };
}

export interface Permission {
    id: number;
    name: string;
    guard_name: string;
    source?: string;
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;
}

export interface PermissionsViaRole {
    role: Role;
    permissions: Permission[];
}

export interface UserPermissions {
    all_permissions: Permission[];
    permission_names: string[];
    can: Record<string, boolean>;
    permissions_via_roles: PermissionsViaRole[];
    direct_permissions: Permission[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    roles?: string[];
    permissions?: UserPermissions;
    phone?: string;
    photo?: string;
    employee?: Employee;
    approval_hierarchy: {
        verifiers?: Array<{
            id: number;
            name: string;
            email: string;
            role: string;
            position?: string;
            unit: {
                id: number;
                name: string;
            }
        }>;
        approvers?: Array<{
            id: number;
            name: string;
            email: string;
            role: string;
            position: string;
        }>;
    }
    finance_approval_hierarchy?: {
        finance_approvers?: Array<{
            id: number;
            name: string;
            email: string;
            role: string;
            position: string;
        }>;
    }
    finance_verification_hierarchy?: {
        finance_verifiers?: Array<{
            id: number;
            name: string;
            email: string;
            role: string;
            position: string;
        }>;
    }
    finance_tax_verification_hierarchy?: {
        finance_tax_verifiers?: Array<{
            id: number;
            name: string;
            email: string;
            role: string;
            position: string;
        }>;
    }
}
