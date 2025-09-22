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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('study_program_id')->constrained('study_programs')->onDelete('cascade');
            $table->foreignId('cohort_id')->constrained('cohorts')->onDelete('cascade');
            $table->string('parent_number')->nullable();
            $table->string('parent_name')->nullable();
            $table->string('gender')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
