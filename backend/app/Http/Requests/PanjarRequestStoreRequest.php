<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PanjarRequestStoreRequest extends FormRequest
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
            // Panjar Request data validation
            'unit_id' => 'required|exists:units,id',
            'budget_item_id' => 'required|exists:budget_items,id',
            'created_by' => 'required|exists:users,id',
            'request_date' => 'nullable|date',
            
            // Panjar Items validation
            'panjar_items' => 'required|array|min:1',
            'panjar_items.*.item_name' => 'required|string|max:255',
            'panjar_items.*.spesification' => 'nullable|string|max:255',
            'panjar_items.*.quantity' => 'required|integer|min:1',
            'panjar_items.*.unit' => 'required|string|max:50',
            'panjar_items.*.price' => 'required|numeric|min:0',
            'panjar_items.*.description' => 'nullable|string|max:255',
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
            'unit_id.required' => 'Unit wajib dipilih.',
            'unit_id.exists' => 'Unit yang dipilih tidak valid.',
            'budget_item_id.required' => 'Item budget wajib dipilih.',
            'budget_item_id.exists' => 'Item budget yang dipilih tidak valid.',
            'created_by.required' => 'Pembuat request wajib diisi.',
            'created_by.exists' => 'User yang dipilih tidak valid.',
            'request_date.date' => 'Format tanggal request tidak valid.',
            
            'panjar_items.required' => 'Item panjar wajib diisi.',
            'panjar_items.array' => 'Item panjar harus berupa array.',
            'panjar_items.min' => 'Minimal harus ada 1 item panjar.',
            'panjar_items.*.item_name.required' => 'Nama item wajib diisi.',
            'panjar_items.*.item_name.max' => 'Nama item maksimal 255 karakter.',
            'panjar_items.*.spesification.max' => 'Spesifikasi maksimal 255 karakter.',
            'panjar_items.*.quantity.required' => 'Jumlah item wajib diisi.',
            'panjar_items.*.quantity.integer' => 'Jumlah item harus berupa angka.',
            'panjar_items.*.quantity.min' => 'Jumlah item minimal 1.',
            'panjar_items.*.unit.required' => 'Satuan item wajib diisi.',
            'panjar_items.*.unit.max' => 'Satuan maksimal 50 karakter.',
            'panjar_items.*.price.required' => 'Harga item wajib diisi.',
            'panjar_items.*.price.numeric' => 'Harga item harus berupa angka.',
            'panjar_items.*.price.min' => 'Harga item minimal 0.',
            'panjar_items.*.description.max' => 'Deskripsi maksimal 255 karakter.',
        ];
    }
}