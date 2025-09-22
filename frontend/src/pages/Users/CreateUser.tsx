import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useCreateUserMutation, useGetUserCreateFormDataQuery } from '../../api/userApi'
import { Role, Permission } from '../../types/user';
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import PageMeta from '../../components/common/PageMeta'
import ComponentCard from '../../components/common/ComponentCard'
import toast from 'react-hot-toast'
import Button from '../../components/ui/button/Button';

interface FormData {
    name: string
    email: string
    password: string
    confirmPassword: string
    selectedRoles: string[]
    selectedPermissions: string[]
    userType?: 'employee' | 'student'
    // Employee data
    employee?: {
        unit_id?: number
        position_id?: number
        nip?: string
    }
    // Student data
    student?: {
        study_program_id?: number
        cohort_id?: number
        parent_number?: string
        parent_name?: string
        gender?: 'male' | 'female'
    }
}

const CreateUser = () => {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        selectedRoles: [],
        selectedPermissions: [],
        userType: undefined,
        employee: {
            unit_id: undefined,
            position_id: undefined,
            nip: ''
        },
        student: {
            study_program_id: undefined,
            cohort_id: undefined,
            parent_number: '',
            parent_name: '',
            gender: undefined
        }
    })

    // API calls
    const { data: formDataResponse, isLoading: isLoadingFormData, error: formDataError } = useGetUserCreateFormDataQuery()
    const [createUser, { isLoading: isCreating }] = useCreateUserMutation()

    const steps = [
        { number: 1, title: 'User Data', description: 'Basic user information' },
        { number: 2, title: 'Roles', description: 'Assign user roles' },
        { number: 3, title: 'Permissions', description: 'Additional permissions' },
        { number: 4, title: 'User Type', description: 'Choose user type' },
        { number: 5, title: 'Additional Data', description: 'Employee/Student details' },
        { number: 6, title: 'Review', description: 'Review and submit' }
    ]

    const handleInputChange = (field: keyof FormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleRoleToggle = (roleName: string) => {
        setFormData(prev => ({
            ...prev,
            selectedRoles: prev.selectedRoles.includes(roleName)
                ? prev.selectedRoles.filter(r => r !== roleName)
                : [...prev.selectedRoles, roleName]
        }))
    }

    const handlePermissionToggle = (permissionName: string) => {
        setFormData(prev => ({
            ...prev,
            selectedPermissions: prev.selectedPermissions.includes(permissionName)
                ? prev.selectedPermissions.filter(p => p !== permissionName)
                : [...prev.selectedPermissions, permissionName]
        }))
    }

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                if (!formData.name.trim()) {
                    toast.error('Name is required')
                    return false
                }
                if (!formData.email.trim()) {
                    toast.error('Email is required')
                    return false
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    toast.error('Please enter a valid email')
                    return false
                }
                if (formData.password.length < 8) {
                    toast.error('Password must be at least 8 characters')
                    return false
                }
                if (formData.password !== formData.confirmPassword) {
                    toast.error('Passwords do not match')
                    return false
                }
                return true
            case 2:
                // Roles are optional, so always valid
                return true
            case 3:
                // Permissions are optional, so always valid
                return true
            case 4:
                // User type is optional, so always valid
                return true
            case 5:
                // Validate employee/student data based on user type
                if (formData.userType === 'employee') {
                    if (!formData.employee?.unit_id) {
                        toast.error('Unit is required for employee')
                        return false
                    }
                    if (!formData.employee?.position_id) {
                        toast.error('Position is required for employee')
                        return false
                    }
                    if (!formData.employee?.nip?.trim()) {
                        toast.error('NIP is required for employee')
                        return false
                    }
                } else if (formData.userType === 'student') {
                    if (!formData.student?.study_program_id) {
                        toast.error('Study program is required for student')
                        return false
                    }
                    if (!formData.student?.cohort_id) {
                        toast.error('Cohort is required for student')
                        return false
                    }
                    if (!formData.student?.gender) {
                        toast.error('Gender is required for student')
                        return false
                    }
                }
                return true
            default:
                return true
        }
    }

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 6))
        }
    }

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1))
    }

    // Fix untuk error handling - tambahkan type guard
    // filepath: d:\Project-SKOMDA\one-tailadmin\src\pages\Users\CreateUser.tsx
    const handleSubmit = async () => {
        try {
            const userData: any = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                ...(formData.selectedRoles.length > 0 && { roles: formData.selectedRoles }),
                ...(formData.selectedPermissions.length > 0 && { permissions: formData.selectedPermissions })
            }

            // Add user type if selected
            if (formData.userType) {
                userData.user_type = formData.userType
            }

            // Add employee data if user type is employee
            if (formData.userType === 'employee' && formData.employee) {
                userData.employee = {
                    unit_id: formData.employee.unit_id,
                    position_id: formData.employee.position_id,
                    nip: formData.employee.nip
                }
            }

            // Add student data if user type is student
            if (formData.userType === 'student' && formData.student) {
                userData.student = {
                    study_program_id: formData.student.study_program_id,
                    cohort_id: formData.student.cohort_id,
                    parent_number: formData.student.parent_number,
                    parent_name: formData.student.parent_name,
                    gender: formData.student.gender
                }
            }

            console.log('Creating user with data:', userData)

            await createUser(userData).unwrap()
            toast.success('User created successfully!')
            navigate('/users')
        } catch (error: unknown) {
            console.error('Create user error:', error)

            if (error && typeof error === 'object' && 'data' in error) {
                const errorData = error.data as any
                if (errorData?.message) {
                    toast.error(errorData.message)
                } else if (errorData?.errors) {
                    Object.keys(errorData.errors).forEach(key => {
                        errorData.errors[key].forEach((message: string) => {
                            toast.error(message)
                        })
                    })
                } else {
                    toast.error('Failed to create user')
                }
            } else {
                toast.error('Failed to create user')
            }
        }
    }

    if (isLoadingFormData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (formDataError) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-500">Failed to load form data</div>
            </div>
        )
    }

    const roles = formDataResponse?.data?.roles ?? []
    const permissions = formDataResponse?.data?.permissions ?? []
    
    // Enhanced form data - these might not be available yet
    const formDataExtended = formDataResponse?.data as any
    const units = formDataExtended?.units ?? []
    const positions = formDataExtended?.positions ?? []
    const studyPrograms = formDataExtended?.study_programs ?? []
    const cohorts = formDataExtended?.cohorts ?? []

    return (
        <>
            <PageMeta
                title="Create User | TailAdmin"
                description="Create a new user with roles and permissions"
            />
            <PageBreadcrumb pageTitle="Create User" />

            <div className="space-y-6">
                {/* Progress Steps */}
                <ComponentCard title="Create New User">
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            {steps.map((step, index) => (
                                <div key={step.number} className="flex items-center">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.number
                                            ? 'bg-primary border-primary text-black'
                                            : 'border-gray-300 text-gray-500'
                                        }`}>
                                        {step.number}
                                    </div>
                                    <div className="ml-3">
                                        <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-primary' : 'text-gray-500'
                                            }`}>
                                            {step.title}
                                        </p>
                                        <p className="text-xs text-gray-400">{step.description}</p>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.number ? 'bg-primary' : 'bg-gray-300'
                                            }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="min-h-96">
                        {currentStep === 1 && (
                            <UserDataStep
                                formData={formData}
                                onInputChange={handleInputChange}
                            />
                        )}
                        {currentStep === 2 && (
                            <RolesStep
                                roles={roles || []}
                                selectedRoles={formData.selectedRoles}
                                onRoleToggle={handleRoleToggle}
                            />
                        )}
                        {currentStep === 3 && (
                            <PermissionsStep
                                permissions={permissions || []}
                                selectedPermissions={formData.selectedPermissions}
                                onPermissionToggle={handlePermissionToggle}
                            />
                        )}
                        {currentStep === 4 && (
                            <UserTypeStep
                                formData={formData}
                                onInputChange={handleInputChange}
                            />
                        )}
                        {currentStep === 5 && (
                            <AdditionalDataStep
                                formData={formData}
                                onInputChange={handleInputChange}
                                units={units}
                                positions={positions}
                                studyPrograms={studyPrograms}
                                cohorts={cohorts}
                            />
                        )}
                        {currentStep === 6 && (
                            <ReviewStep
                                formData={formData}
                                roles={roles || []}
                                permissions={permissions || []}
                                units={units}
                                positions={positions}
                                studyPrograms={studyPrograms}
                                cohorts={cohorts}
                            />
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        <Button
                            variant='outline'
                            onClick={handlePrevious}
                            disabled={currentStep === 1}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </Button>

                        <div className="space-x-3">
                            <Button
                                variant='outline'
                                onClick={() => navigate('/users')}
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>

                            {currentStep < 6 ? (
                                <Button
                                    onClick={handleNext}
                                    className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                                >
                                    Next
                                </Button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isCreating}
                                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isCreating ? 'Creating...' : 'Create User'}
                                </button>
                            )}
                        </div>
                    </div>
                </ComponentCard>
            </div>
        </>
    )
}

// Step Components
const UserDataStep = ({
    formData,
    onInputChange
}: {
    formData: FormData
    onInputChange: (field: keyof FormData, value: string) => void
}) => {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Basic User Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => onInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter full name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => onInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter email address"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                    </label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => onInputChange('password', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter password (min. 8 characters)"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password *
                    </label>
                    <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => onInputChange('confirmPassword', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Confirm password"
                    />
                </div>
            </div>
        </div>
    )
}

const RolesStep = ({
    roles,
    selectedRoles,
    onRoleToggle
}: {
    roles: Role[]
    selectedRoles: string[]
    onRoleToggle: (roleName: string) => void
}) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900">Assign Roles</h3>
                <p className="text-sm text-gray-600 mt-1">Select roles for this user (optional)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map((role) => (
                    <div key={role.id} className="relative">
                        <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={selectedRoles.includes(role.name)}
                                onChange={() => onRoleToggle(role.name)}
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <div className="ml-3">
                                <span className="block text-sm font-medium text-gray-900">{role.name}</span>
                            </div>
                        </label>
                    </div>
                ))}
            </div>

            {selectedRoles.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Selected Roles:</h4>
                    <div className="flex flex-wrap gap-2">
                        {selectedRoles.map((role) => (
                            <span key={role} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {role}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

const PermissionsStep = ({
    permissions,
    selectedPermissions,
    onPermissionToggle
}: {
    permissions: Permission[]
    selectedPermissions: string[]
    onPermissionToggle: (permissionName: string) => void
}) => {
    // Group permissions by category
    const groupedPermissions = permissions.reduce((groups, permission) => {
        const category = permission.name.includes('panjar') ? 'Panjar' : 'General'
        if (!groups[category]) {
            groups[category] = []
        }
        groups[category].push(permission)
        return groups
    }, {} as Record<string, Permission[]>)

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900">Additional Permissions</h3>
                <p className="text-sm text-gray-600 mt-1">Grant additional permissions to this user (optional)</p>
            </div>

            {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                <div key={category} className="space-y-3">
                    <h4 className="text-md font-medium text-gray-800 border-b border-gray-200 pb-2">
                        {category} Permissions
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {categoryPermissions.map((permission) => (
                            <div key={permission.id} className="relative">
                                <label className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="checkbox"
                                        checked={selectedPermissions.includes(permission.name)}
                                        onChange={() => onPermissionToggle(permission.name)}
                                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                    />
                                    <span className="ml-3 text-sm text-gray-900">{permission.name}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {selectedPermissions.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-green-800 mb-2">Selected Permissions:</h4>
                    <div className="flex flex-wrap gap-2">
                        {selectedPermissions.map((permission) => (
                            <span key={permission} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {permission}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

const ReviewStep = ({
    formData,
    roles,
    permissions,
    units,
    positions,
    studyPrograms,
    cohorts
}: {
    formData: FormData
    roles: Role[]
    permissions: Permission[]
    units: any[]
    positions: any[]
    studyPrograms: any[]
    cohorts: any[]
}) => {
    const selectedRoleObjects = roles.filter(role => formData.selectedRoles.includes(role.name))
    const selectedPermissionObjects = permissions.filter(permission => formData.selectedPermissions.includes(permission.name))

    // Get additional data objects
    const selectedUnit = units.find(unit => unit.id === formData.employee?.unit_id)
    const selectedPosition = positions.find(position => position.id === formData.employee?.position_id)
    const selectedStudyProgram = studyPrograms.find(program => program.id === formData.student?.study_program_id)
    const selectedCohort = cohorts.find(cohort => cohort.id === formData.student?.cohort_id)

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Review User Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Data */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-800 mb-3">User Details</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Name:</span>
                            <span className="text-sm font-medium">{formData.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Email:</span>
                            <span className="text-sm font-medium">{formData.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Password:</span>
                            <span className="text-sm font-medium">••••••••</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">User Type:</span>
                            <span className="text-sm font-medium">
                                {formData.userType ? (
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                        {formData.userType === 'employee' ? '👩‍💼 Employee' : '🎓 Student'}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                        👤 Basic User
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Roles */}
                <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-800 mb-3">Assigned Roles</h4>
                    {selectedRoleObjects.length > 0 ? (
                        <div className="space-y-2">
                            {selectedRoleObjects.map((role) => (
                                <div key={role.id} className="flex items-center">
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                        {role.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No roles assigned</p>
                    )}
                </div>
            </div>

            {/* Permissions */}
            <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-800 mb-3">Additional Permissions</h4>
                {selectedPermissionObjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {selectedPermissionObjects.map((permission) => (
                            <span key={permission.id} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                {permission.name}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No additional permissions assigned</p>
                )}
            </div>

            {/* Employee Data */}
            {formData.userType === 'employee' && (
                <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-800 mb-3">Employee Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Unit:</span>
                            <span className="text-sm font-medium">{selectedUnit?.name || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Position:</span>
                            <span className="text-sm font-medium">{selectedPosition?.name || '-'}</span>
                        </div>
                        <div className="flex justify-between md:col-span-2">
                            <span className="text-sm text-gray-600">NIP:</span>
                            <span className="text-sm font-medium">{formData.employee?.nip || '-'}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Student Data */}
            {formData.userType === 'student' && (
                <div className="bg-indigo-50 rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-800 mb-3">Student Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Study Program:</span>
                            <span className="text-sm font-medium">{selectedStudyProgram?.name || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Cohort:</span>
                            <span className="text-sm font-medium">{selectedCohort?.year || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Gender:</span>
                            <span className="text-sm font-medium">
                                {formData.student?.gender === 'male' ? 'Male' : formData.student?.gender === 'female' ? 'Female' : '-'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Parent Name:</span>
                            <span className="text-sm font-medium">{formData.student?.parent_name || '-'}</span>
                        </div>
                        <div className="flex justify-between md:col-span-2">
                            <span className="text-sm text-gray-600">Parent Phone:</span>
                            <span className="text-sm font-medium">{formData.student?.parent_number || '-'}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// User Type Selection Step
const UserTypeStep = ({
    formData,
    onInputChange
}: {
    formData: FormData
    onInputChange: (field: keyof FormData, value: string) => void
}) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900">Choose User Type</h3>
                <p className="text-sm text-gray-600 mt-1">Select the type of user account (optional - leave blank for basic user)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Basic User */}
                <div className="relative">
                    <label className={`flex flex-col p-6 border-2 rounded-lg cursor-pointer transition-all ${!formData.userType ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input
                            type="radio"
                            name="userType"
                            value=""
                            checked={!formData.userType}
                            onChange={() => onInputChange('userType', '')}
                            className="sr-only"
                        />
                        <div className="text-center">
                            <div className="text-2xl mb-2">👤</div>
                            <h4 className="font-medium text-gray-900">Basic User</h4>
                            <p className="text-sm text-gray-600 mt-1">Standard user account with roles and permissions only</p>
                        </div>
                    </label>
                </div>

                {/* Employee */}
                <div className="relative">
                    <label className={`flex flex-col p-6 border-2 rounded-lg cursor-pointer transition-all ${formData.userType === 'employee' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input
                            type="radio"
                            name="userType"
                            value="employee"
                            checked={formData.userType === 'employee'}
                            onChange={() => onInputChange('userType', 'employee')}
                            className="sr-only"
                        />
                        <div className="text-center">
                            <div className="text-2xl mb-2">👩‍💼</div>
                            <h4 className="font-medium text-gray-900">Employee</h4>
                            <p className="text-sm text-gray-600 mt-1">Staff member with unit, position, and NIP</p>
                        </div>
                    </label>
                </div>

                {/* Student */}
                <div className="relative">
                    <label className={`flex flex-col p-6 border-2 rounded-lg cursor-pointer transition-all ${formData.userType === 'student' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input
                            type="radio"
                            name="userType"
                            value="student"
                            checked={formData.userType === 'student'}
                            onChange={() => onInputChange('userType', 'student')}
                            className="sr-only"
                        />
                        <div className="text-center">
                            <div className="text-2xl mb-2">🎓</div>
                            <h4 className="font-medium text-gray-900">Student</h4>
                            <p className="text-sm text-gray-600 mt-1">Student with study program, cohort, and parent details</p>
                        </div>
                    </label>
                </div>
            </div>

            {formData.userType && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Selected User Type:</h4>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {formData.userType === 'employee' ? '👩‍💼 Employee' : '🎓 Student'}
                    </span>
                </div>
            )}
        </div>
    )
}

// Additional Data Step (Employee/Student)
const AdditionalDataStep = ({
    formData,
    onInputChange,
    units,
    positions,
    studyPrograms,
    cohorts
}: {
    formData: FormData
    onInputChange: (field: keyof FormData, value: any) => void
    units: any[]
    positions: any[]
    studyPrograms: any[]
    cohorts: any[]
}) => {
    const handleEmployeeChange = (field: string, value: any) => {
        onInputChange('employee', {
            ...formData.employee,
            [field]: value
        })
    }

    const handleStudentChange = (field: string, value: any) => {
        onInputChange('student', {
            ...formData.student,
            [field]: value
        })
    }

    if (!formData.userType) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Additional Data Required</h3>
                    <p className="text-gray-600">Basic user account doesn't require additional information.</p>
                    <p className="text-gray-600">You can proceed to review and submit.</p>
                </div>
            </div>
        )
    }

    if (formData.userType === 'employee') {
        return (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Employee Information</h3>
                    <p className="text-sm text-gray-600 mt-1">Complete the employee details</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Unit *
                        </label>
                        <select
                            value={formData.employee?.unit_id || ''}
                            onChange={(e) => handleEmployeeChange('unit_id', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="">Select Unit</option>
                            {units.map((unit) => (
                                <option key={unit.id} value={unit.id}>
                                    {unit.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Position *
                        </label>
                        <select
                            value={formData.employee?.position_id || ''}
                            onChange={(e) => handleEmployeeChange('position_id', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="">Select Position</option>
                            {positions.map((position) => (
                                <option key={position.id} value={position.id}>
                                    {position.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            NIP (Nomor Induk Pegawai) *
                        </label>
                        <input
                            type="text"
                            value={formData.employee?.nip || ''}
                            onChange={(e) => handleEmployeeChange('nip', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter employee NIP"
                        />
                    </div>
                </div>
            </div>
        )
    }

    if (formData.userType === 'student') {
        return (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Student Information</h3>
                    <p className="text-sm text-gray-600 mt-1">Complete the student details</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Study Program *
                        </label>
                        <select
                            value={formData.student?.study_program_id || ''}
                            onChange={(e) => handleStudentChange('study_program_id', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="">Select Study Program</option>
                            {studyPrograms.map((program) => (
                                <option key={program.id} value={program.id}>
                                    {program.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cohort *
                        </label>
                        <select
                            value={formData.student?.cohort_id || ''}
                            onChange={(e) => handleStudentChange('cohort_id', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="">Select Cohort</option>
                            {cohorts.map((cohort) => (
                                <option key={cohort.id} value={cohort.id}>
                                    {cohort.year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gender *
                        </label>
                        <select
                            value={formData.student?.gender || ''}
                            onChange={(e) => handleStudentChange('gender', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Parent Name
                        </label>
                        <input
                            type="text"
                            value={formData.student?.parent_name || ''}
                            onChange={(e) => handleStudentChange('parent_name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter parent name"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Parent Phone Number
                        </label>
                        <input
                            type="text"
                            value={formData.student?.parent_number || ''}
                            onChange={(e) => handleStudentChange('parent_number', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter parent phone number"
                        />
                    </div>
                </div>
            </div>
        )
    }

    return null
}

export default CreateUser
