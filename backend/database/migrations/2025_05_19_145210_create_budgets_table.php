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
        Schema::create('budgets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('unit_id')->constrained('units')->onDelete('cascade');
            $table->foreignId('budget_year_id')->constrained('budget_years')->onDelete('cascade');
            $table->bigInteger('quarterly')->check('quarterly >= 1 AND quarterly <= 4');
            $table->timestamps();

            $table->unique(['unit_id', 'budget_year_id', 'quarterly']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('budgets');
    }
};
