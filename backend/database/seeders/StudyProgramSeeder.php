<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StudyProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('study_programs')->insert([
            [
                'id' => 1,
                'name' => 'Teknik Komputer dan Jaringan',
                'code' => 'TKJ',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 2,
                'name' => 'Rekayasa Perangkat Lunak',
                'code' => 'RPL',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 3,
                'name' => 'Multimedia',
                'code' => 'MM',
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }
} 