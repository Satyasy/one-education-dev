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
        Schema::create('panjar_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('panjar_request_id')->constrained('panjar_requests')->onDelete('cascade');
            $table->string('item_name');
            $table->string('spesification')->nullable();
            $table->bigInteger('quantity');
            $table->string('unit');
            $table->decimal('price', 15, 0);
            $table->decimal('total', 20, 0);
            $table->string('description')->nullable();
            $table->enum('status', ['pending', 'verified', 'approved', 'rejected', 'revision'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('panjar_items');
    }
};
