<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Itinerary extends Model
{
    protected $table = 'itineraries';
    protected $primaryKey = 'itinerary_id';

    protected $fillable = [
        'user_id',
        'target_city',
        'start_date',
        'duration_days',
        'budget_category',
        'max_budget',
        'total_estimated_cost',
    ];

    protected $casts = [
        'start_date' => 'date',
        'max_budget' => 'decimal:2',
        'total_estimated_cost' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function details()
    {
        return $this->hasMany(ItineraryDetail::class, 'itinerary_id');
    }
}