<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BudgetYearRequest extends FormRequest
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
            'year' => 'required|integer|min:2020|max:2099|unique:budget_years,year',
            'is_active' => 'boolean',
            'description' => 'nullable|string|max:255',
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
            'year.required' => 'Tahun anggaran wajib diisi.',
            'year.integer' => 'Tahun anggaran harus berupa angka.',
            'year.min' => 'Tahun anggaran minimal 2020.',
            'year.max' => 'Tahun anggaran maksimal 2099.',
            'year.unique' => 'Tahun anggaran sudah ada.',
            'is_active.boolean' => 'Status aktif harus berupa true/false.',
            'description.string' => 'Deskripsi harus berupa text.',
            'description.max' => 'Deskripsi maksimal 255 karakter.',
        ];
    }
}
