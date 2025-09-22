<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'roles' => 'nullable|array',
            'roles.*' => 'string|exists:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',

            // User type validation
            'user_type' => 'nullable|string|in:employee,student',

            // Employee data validation (conditional)
            'employee' => 'nullable|array',
            'employee.unit_id' => 'required_if:user_type,employee|integer|exists:units,id',
            'employee.position_id' => 'required_if:user_type,employee|integer|exists:positions,id',
            'employee.nip' => 'required_if:user_type,employee|string|max:50|unique:employees,nip',

            // Student data validation (conditional)
            'student' => 'nullable|array',
            'student.study_program_id' => 'required_if:user_type,student|integer|exists:study_programs,id',
            'student.cohort_id' => 'required_if:user_type,student|integer|exists:cohorts,id',
            'student.parent_number' => 'nullable|string|max:20',
            'student.parent_name' => 'nullable|string|max:255',
            'student.gender' => 'required_if:user_type,student|string|in:male,female',
        ];

        return $rules;
    }

    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama wajib diisi',
            'email.required' => 'Email wajib diisi',
            'email.unique' => 'Email sudah digunakan',
            'password.required' => 'Password wajib diisi',
            'password.min' => 'Password minimal 8 karakter',
            'roles.array' => 'Roles harus berupa array',
            'roles.*.exists' => 'Role yang dipilih tidak valid',
            'permissions.array' => 'Permissions harus berupa array',
            'permissions.*.exists' => 'Permission yang dipilih tidak valid',

            // User type messages
            'user_type.in' => 'Tipe user harus employee atau student',

            // Employee validation messages
            'employee.unit_id.required_if' => 'Unit wajib dipilih untuk employee',
            'employee.unit_id.exists' => 'Unit tidak ditemukan',
            'employee.position_id.required_if' => 'Posisi wajib dipilih untuk employee',
            'employee.position_id.exists' => 'Posisi tidak ditemukan',
            'employee.nip.required_if' => 'NIP wajib diisi untuk employee',
            'employee.nip.unique' => 'NIP sudah digunakan',
            'employee.nip.max' => 'NIP maksimal 50 karakter',

            // Student validation messages
            'student.study_program_id.required_if' => 'Program studi wajib dipilih untuk student',
            'student.study_program_id.exists' => 'Program studi tidak ditemukan',
            'student.cohort_id.required_if' => 'Angkatan wajib dipilih untuk student',
            'student.cohort_id.exists' => 'Angkatan tidak ditemukan',
            'student.parent_number.max' => 'Nomor orang tua maksimal 20 karakter',
            'student.parent_name.max' => 'Nama orang tua maksimal 255 karakter',
            'student.gender.required_if' => 'Jenis kelamin wajib dipilih untuk student',
            'student.gender.in' => 'Jenis kelamin harus male atau female',
        ];
    }

    /**
     * Get custom attribute names for validation errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'nama',
            'email' => 'email',
            'password' => 'password',
            'roles' => 'roles',
            'permissions' => 'permissions',
        ];
    }
}
