<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StudentRequest extends FormRequest
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
        $studentId = $this->route('student') ? $this->route('student') : null;

        return [
            'user_id' => [
                'required',
                'integer',
                'exists:users,id',
                Rule::unique('students', 'user_id')->ignore($studentId),
            ],
            'study_program_id' => [
                'required',
                'integer',
                'exists:study_programs,id',
            ],
            'cohort_id' => [
                'required',
                'integer',
                'exists:cohorts,id',
            ],
            'parent_number' => [
                'nullable',
                'string',
                'max:20',
            ],
            'parent_name' => [
                'nullable',
                'string',
                'max:255',
            ],
            'gender' => [
                'required',
                'string',
                'in:male,female',
            ],
        ];
    }

    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'user_id.required' => 'User ID wajib diisi',
            'user_id.exists' => 'User tidak ditemukan',
            'user_id.unique' => 'User sudah menjadi student',
            'study_program_id.required' => 'Program studi wajib dipilih',
            'study_program_id.exists' => 'Program studi tidak ditemukan',
            'cohort_id.required' => 'Angkatan wajib dipilih',
            'cohort_id.exists' => 'Angkatan tidak ditemukan',
            'parent_number.max' => 'Nomor orang tua maksimal 20 karakter',
            'parent_name.max' => 'Nama orang tua maksimal 255 karakter',
            'gender.required' => 'Jenis kelamin wajib dipilih',
            'gender.in' => 'Jenis kelamin harus male atau female',
        ];
    }
}
