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
        Schema::create('monthly_budget_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('unit_id')->constrained()->onDelete('cascade');
            $table->bigInteger('month');
            $table->bigInteger('year');
            $table->decimal('total_budget');
            $table->decimal('total_realization');
            $table->decimal('remaining_budget');
            $table->decimal('percentage_realization');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('monthly_budget_reports');
    }
};
