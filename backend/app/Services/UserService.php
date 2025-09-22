<?php

namespace App\Services;

use App\Repositories\UserRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserService
{
    private UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function getAll(array $fields, array $params = [])
    {
        return $this->userRepository->getAll($fields, $params);
    }

    public function getAllUserStatistics()
    {
        return $this->userRepository->getAllUserStatistics();
    }

    public function getById(int $id, array $fields)
    {
        return $this->userRepository->getById($id, $fields);
    }

    public function create(array $data)
    {
        $data['password'] = bcrypt($data['password']);

        return $this->userRepository->create($data);
    }

    public function update(int $id, array $data)
    {
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        return $this->userRepository->update($id, $data);
    }

    public function delete(int $id)
    {
        return $this->userRepository->delete($id);
    }

    /**
     * Create user with roles and permissions in one transaction
     */
    public function createUserWithRolesAndPermissions(array $userData)
    {
        return DB::transaction(function () use ($userData) {
            // Extract roles, permissions, user_type, employee and student data
            $roles = $userData['roles'] ?? [];
            $permissions = $userData['permissions'] ?? [];
            $userType = $userData['user_type'] ?? null;
            $employeeData = $userData['employee'] ?? null;
            $studentData = $userData['student'] ?? null;

            // Remove additional data from user data before creating user
            $userDataForCreation = collect($userData)->except([
                'roles',
                'permissions',
                'user_type',
                'employee',
                'student',
            ])->toArray();

            // Hash password
            $userDataForCreation['password'] = Hash::make($userDataForCreation['password']);

            // Create user
            $user = $this->userRepository->create($userDataForCreation);

            // Create employee record if user_type is employee
            if ($userType === 'employee' && $employeeData) {
                $employeeData['user_id'] = $user->id;
                \App\Models\Employee::create($employeeData);
            }

            // Create student record if user_type is student
            if ($userType === 'student' && $studentData) {
                $studentData['user_id'] = $user->id;
                \App\Models\Student::create($studentData);
            }

            // Assign roles if provided
            if (! empty($roles)) {
                $user->syncRoles($roles);
            }

            // Assign direct permissions if provided
            if (! empty($permissions)) {
                $user->syncPermissions($permissions);
            }

            // Load relationships and return
            return $user->load([
                'roles',
                'permissions',
                'roles.permissions',
                'employee.unit',
                'employee.position',
                'student.studyProgram',
                'student.cohort',
            ]);
        });
    }

    /**
     * Get available roles for assignment
     */
    public function getAvailableRoles()
    {
        return Role::select('id', 'name', 'guard_name')->orderBy('name')->get();
    }

    /**
     * Get available permissions for assignment
     */
    public function getAvailablePermissions()
    {
        return Permission::select('id', 'name', 'guard_name')->orderBy('name')->get();
    }

    /**
     * Get available units for employee assignment
     */
    public function getAvailableUnits()
    {
        return \App\Models\Unit::select('id', 'name')->orderBy('name')->get();
    }

    /**
     * Get available positions for employee assignment
     */
    public function getAvailablePositions()
    {
        return \App\Models\Position::select('id', 'name')->orderBy('name')->get();
    }

    /**
     * Get available study programs for student assignment
     */
    public function getAvailableStudyPrograms()
    {
        return \App\Models\StudyProgram::select('id', 'name')->orderBy('name')->get();
    }

    /**
     * Get available cohorts for student assignment
     */
    public function getAvailableCohorts()
    {
        return \App\Models\Cohort::select('id', 'year')->orderBy('year', 'desc')->get();
    }
}
