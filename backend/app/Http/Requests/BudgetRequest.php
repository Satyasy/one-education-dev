<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BudgetRequest extends FormRequest
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
            'unit_id' => 'required|exists:units,id',
            'budget_year_id' => 'required|exists:budget_years,id',
            'quarterly' => 'required|integer|min:1|max:4',

            'budget_items' => 'required|array|min:1',
            'budget_items.*.name' => 'required|string|max:255',
            'budget_items.*.description' => 'nullable|string|max:255',
            'budget_items.*.amount_allocation' => 'required|numeric|min:0',
        ];
    }
}
