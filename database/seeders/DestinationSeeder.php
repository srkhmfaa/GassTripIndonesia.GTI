<?php

namespace Database\Seeders;

use App\Models\Destination;
use Illuminate\Database\Seeder;

class DestinationSeeder extends Seeder
{
    public function run(): void
    {
        $destinations = [
            [
                'name' => 'Candi Borobudur',
                'category' => 'Wisata Alam',
                'city' => 'Yogyakarta',
                'price' => 50000,
                'latitude' => -7.6079,
                'longitude' => 110.2038,
                'jam_operasional' => '2026-01-01 06:00:00',
                'hidden_gem' => false,
            ],
            [
                'name' => 'Keraton Yogyakarta',
                'category' => 'Budaya',
                'city' => 'Yogyakarta',
                'price' => 15000,
                'latitude' => -7.8053,
                'longitude' => 110.3642,
                'jam_operasional' => '2026-01-01 08:00:00',
                'hidden_gem' => false,
            ],
            [
                'name' => 'Warung Bu Ageng',
                'category' => 'Kuliner',
                'city' => 'Yogyakarta',
                'price' => 35000,
                'latitude' => -7.7956,
                'longitude' => 110.3695,
                'jam_operasional' => '2026-01-01 10:00:00',
                'hidden_gem' => false,
            ],
            [
                'name' => 'Tebing Breksi',
                'category' => 'Wisata Alam',
                'city' => 'Yogyakarta',
                'price' => 10000,
                'latitude' => -7.7686,
                'longitude' => 110.4936,
                'jam_operasional' => '2026-01-01 07:00:00',
                'hidden_gem' => true,
            ],
            [
                'name' => 'Malioboro Street',
                'category' => 'Belanja',
                'city' => 'Yogyakarta',
                'price' => 0,
                'latitude' => -7.7926,
                'longitude' => 110.3658,
                'jam_operasional' => '2026-01-01 00:00:00',
                'hidden_gem' => false,
            ],
            [
                'name' => 'Gudeg Yu Djum',
                'category' => 'Kuliner',
                'city' => 'Yogyakarta',
                'price' => 30000,
                'latitude' => -7.7853,
                'longitude' => 110.3733,
                'jam_operasional' => '2026-01-01 06:00:00',
                'hidden_gem' => false,
            ],
            [
                'name' => 'Hutan Pinus Mangunan',
                'category' => 'Wisata Alam',
                'city' => 'Yogyakarta',
                'price' => 5000,
                'latitude' => -7.9408,
                'longitude' => 110.4519,
                'jam_operasional' => '2026-01-01 07:00:00',
                'hidden_gem' => true,
            ],
            [
                'name' => 'Taman Sari',
                'category' => 'Budaya',
                'city' => 'Yogyakarta',
                'price' => 15000,
                'latitude' => -7.8104,
                'longitude' => 110.3592,
                'jam_operasional' => '2026-01-01 09:00:00',
                'hidden_gem' => false,
            ],
        ];

        foreach ($destinations as $destination) {
            Destination::create($destination);
        }
    }
}