<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('itinerary_details', function (Blueprint $table) {
            $table->id('detail_id');
            $table->foreignId('itinerary_id')->constrained('itineraries', 'itinerary_id')->onDelete('cascade');
            $table->foreignId('destination_id')->constrained('destinations', 'destination_id')->onDelete('cascade');
            $table->date('visit_day');
            $table->integer('visit_order');
            $table->time('estimated_time')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('itinerary_details');
    }
};