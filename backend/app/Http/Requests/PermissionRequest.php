<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PermissionRequest extends FormRequest
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
        $permissionId = $this->route('permission') ? $this->route('permission') : null;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-zA-Z0-9\-_\s]+$/',
                Rule::unique('permissions', 'name')->where(function ($query) {
                    return $query->where('guard_name', $this->input('guard_name', 'web'));
                })->ignore($permissionId),
            ],
            'guard_name' => [
                'sometimes',
                'string',
                'max:255',
                'in:web,api,sanctum',
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
            'name.required' => 'Permission name is required',
            'name.string' => 'Permission name must be a string',
            'name.max' => 'Permission name may not be greater than 255 characters',
            'name.regex' => 'Permission name may only contain letters, numbers, hyphens, underscores, and spaces',
            'name.unique' => 'Permission name already exists for this guard',

            'guard_name.string' => 'Guard name must be a string',
            'guard_name.max' => 'Guard name may not be greater than 255 characters',
            'guard_name.in' => 'Guard name must be one of: web, api, sanctum',
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
            'name' => 'permission name',
            'guard_name' => 'guard name',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Set default guard_name if not provided
        if (! $this->has('guard_name')) {
            $this->merge([
                'guard_name' => 'web',
            ]);
        }

        // Clean and format the permission name
        if ($this->has('name')) {
            $this->merge([
                'name' => trim(strtolower($this->input('name'))),
            ]);
        }
    }
}
