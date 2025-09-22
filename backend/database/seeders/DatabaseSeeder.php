<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call([
            // Base data
            UnitSeeder::class,
            UserRoleSeeder::class, // Now includes positions and employees

            // Academic data
            StudyProgramSeeder::class,
            AcademicYearSeeder::class,
            CohortSeeder::class,
            SemesterSeeder::class,
            ClassSeeder::class,

            // Student data
            StudentSeeder::class,
            StudentClassHistorySeeder::class,

            // Budget and Panjar data
            BudgetYearSeeder::class,
            BudgetSeeder::class,
            PanjarSeeder::class,
            PanjarItemHistorySeeder::class,
            PanjarRealizationItemSeeder::class,

            // Permissions
            PanjarRequestModelPermissionSeeder::class,
        ]);
    }
}
