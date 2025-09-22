<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PanjarItemRequest extends FormRequest
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
            'item_name' => 'required|string|max:255',
            'spesification' => 'nullable|string|max:255',
            'quantity' => 'required|integer|min:1',
            'unit' => 'required|string|max:50',
            'price' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'status' => 'in:pending,verified,approved,rejected,revision',
        ];
    }
}
