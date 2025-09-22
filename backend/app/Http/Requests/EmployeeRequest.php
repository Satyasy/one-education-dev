<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EmployeeRequest extends FormRequest
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
        $employeeId = $this->route('employee') ? $this->route('employee') : null;

        return [
            'user_id' => [
                'required',
                'integer',
                'exists:users,id',
                Rule::unique('employees', 'user_id')->ignore($employeeId),
            ],
            'unit_id' => [
                'required',
                'integer',
                'exists:units,id',
            ],
            'position_id' => [
                'required',
                'integer',
                'exists:positions,id',
            ],
            'nip' => [
                'required',
                'string',
                'max:50',
                Rule::unique('employees', 'nip')->ignore($employeeId),
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'user_id.required' => 'User ID is required',
            'user_id.integer' => 'User ID must be an integer',
            'user_id.exists' => 'Selected user does not exist',
            'user_id.unique' => 'User already has an employee record',

            'unit_id.required' => 'Unit is required',
            'unit_id.integer' => 'Unit ID must be an integer',
            'unit_id.exists' => 'Selected unit does not exist',

            'position_id.required' => 'Position is required',
            'position_id.integer' => 'Position ID must be an integer',
            'position_id.exists' => 'Selected position does not exist',

            'nip.required' => 'NIP is required',
            'nip.string' => 'NIP must be a string',
            'nip.max' => 'NIP may not be greater than 50 characters',
            'nip.unique' => 'NIP already exists',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'user_id' => 'user',
            'unit_id' => 'unit',
            'position_id' => 'position',
            'nip' => 'NIP',
        ];
    }
}
