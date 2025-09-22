<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UnitRequest extends FormRequest
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
        return [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50',
            'parent_id' => 'nullable|exists:units,id',
            'head_id' => 'nullable|exists:users,id',
            'description' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama unit wajib diisi.',
            'name.string' => 'Nama unit harus berupa text.',
            'name.max' => 'Nama unit maksimal 255 karakter.',
            'code.required' => 'Kode unit wajib diisi.',
            'code.string' => 'Kode unit harus berupa text.',
            'code.max' => 'Kode unit maksimal 50 karakter.',
            'code.unique' => 'Kode unit sudah digunakan.',
            'parent_id.exists' => 'Unit parent tidak ditemukan.',
            'head_id.exists' => 'Kepala unit tidak ditemukan.',
            'description.string' => 'Deskripsi harus berupa text.',
            'description.max' => 'Deskripsi maksimal 1000 karakter.',
        ];
    }
}
