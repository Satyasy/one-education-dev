<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BudgetItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'budget_id' => 'required|exists:budgets,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'amount_allocation' => 'required|numeric|min:0',
        ];
    }
}
