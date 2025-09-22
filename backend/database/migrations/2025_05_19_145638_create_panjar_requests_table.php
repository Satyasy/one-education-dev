<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('panjar_requests', function (Blueprint $table) {
        $table->id();

        // Unit ID (divisi/unit pengaju)
        $table->foreignId('unit_id')->constrained()->onDelete('cascade');
        $table->foreignId('budget_item_id')->constrained('budget_items')->onDelete('cascade');

        // Tambahkan kolom foreign key terlebih dahulu
        $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
        $table->foreignId('verified_by')->nullable()->constrained('users')->onDelete('cascade');
        $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('cascade');
        $table->foreignId('finance_approval_by')->nullable()->constrained('users')->onDelete('cascade');
        $table->foreignId('finance_verification_by')->nullable()->constrained('users')->onDelete('cascade');
        $table->foreignId('finance_tax_verification_by')->nullable()->constrained('users')->onDelete('cascade');
        $table->enum('status', ['pending', 'verified', 'approved', 'rejected', 'revision'])->default('pending');
        $table->enum('report_status', ['not_reported', 'reported', 'rejected', 'revision','submitted'])->default('not_reported');
        $table->decimal('total_amount', 20, 0);
        $table->date('request_date');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('panjar_requests');
    }
};
