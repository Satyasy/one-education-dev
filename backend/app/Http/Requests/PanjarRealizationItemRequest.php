<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PanjarRealizationItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'panjar_request_id' => 'required|exists:panjar_requests,id',
            'item_name' => 'required|string|max:255',
            'spesification' => 'nullable|string|max:255',
            'quantity' => 'required|integer|min:1',
            'unit' => 'required|string|max:50',
            'price' => 'required|numeric|min:0',
            'total' => 'nullable|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'report_status' => 'nullable|string|max:50',
            'receipt_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'item_photo' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
        ];
    }
}
