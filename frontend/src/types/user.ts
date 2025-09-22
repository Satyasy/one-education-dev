export interface Role {
  id: number
  name: string
}

export interface Permission {
  id: number
  name: string
}

export interface CreateUserFormData {
  roles: Role[]
  permissions: Permission[]
}

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  roles?: string[]
  permissions?: string[]
}

export interface CreatedUser {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
  roles: Role[]
  permissions: {
    all_permissions: Array<Permission & { source: string }>
    permission_names: string[]
    permissions_via_roles: Permission[]
    direct_permissions: Permission[]
  }
  employee: any
  student: any
  approval_hierarchy: {
    verifiers: any[]
    approvers: any[]
  }
  finance_verification_hierarchy: {
    finance_verifiers: any[]
  }
  finance_approval_hierarchy: {
    finance_approvers: any[]
  }
}