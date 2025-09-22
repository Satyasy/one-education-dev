<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PanjarItemStatusUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled in controller
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => 'required|in:pending,verified,approved,rejected,revision',
            'note' => 'nullable|string|max:500',
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'status.required' => 'Status wajib diisi.',
            'status.in' => 'Status yang dipilih tidak valid.',
            'note.string' => 'Catatan harus berupa teks.',
            'note.max' => 'Catatan maksimal 500 karakter.',
        ];
    }
} 