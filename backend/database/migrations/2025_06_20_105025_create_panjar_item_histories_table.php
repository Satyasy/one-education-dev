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
        Schema::create('panjar_item_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('panjar_item_id')->constrained('panjar_items')->onDelete('cascade');
            $table->text('note')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->string('status')->nullable();
            $table->string('reviewer_role')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('panjar_item_histories');
    }
};
