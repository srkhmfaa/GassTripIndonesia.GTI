<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    protected $table = 'destinations';
    protected $primaryKey = 'destination_id';

    protected $fillable = [
        'name',
        'category',
        'city',
        'price',
        'latitude',
        'longitude',
        'jam_operasional',
        'hidden_gem',
    ];

    protected $casts = [
        'hidden_gem' => 'boolean',
        'price' => 'decimal:2',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'jam_operasional' => 'datetime',
    ];

    public function itineraryDetails()
    {
        return $this->hasMany(ItineraryDetail::class, 'destination_id');
    }
}