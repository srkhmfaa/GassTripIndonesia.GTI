<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItineraryDetail extends Model
{
    protected $table = 'itinerary_details';
    protected $primaryKey = 'detail_id';

    protected $fillable = [
        'itinerary_id',
        'destination_id',
        'visit_day',
        'visit_order',
        'estimated_time',
    ];

    protected $casts = [
        'visit_day' => 'date',
    ];

    public function itinerary()
    {
        return $this->belongsTo(Itinerary::class, 'itinerary_id');
    }

    public function destination()
    {
        return $this->belongsTo(Destination::class, 'destination_id');
    }
}