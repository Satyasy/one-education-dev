<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Student data
        $students = [
            // TKJ Students
            ['name' => 'Ahmad Rizki', 'email' => 'ahmad.rizki@student.smktelkom-sda.sch.id', 'study_program_id' => 1, 'cohort_id' => 3, 'gender' => 'L'],
            ['name' => 'Siti Nurhaliza', 'email' => 'siti.nurhaliza@student.smktelkom-sda.sch.id', 'study_program_id' => 1, 'cohort_id' => 3, 'gender' => 'P'],
            ['name' => 'Budi Santoso', 'email' => 'budi.santoso@student.smktelkom-sda.sch.id', 'study_program_id' => 1, 'cohort_id' => 3, 'gender' => 'L'],
            ['name' => 'Dewi Sartika', 'email' => 'dewi.sartika@student.smktelkom-sda.sch.id', 'study_program_id' => 1, 'cohort_id' => 3, 'gender' => 'P'],
            ['name' => 'Andi Wijaya', 'email' => 'andi.wijaya@student.smktelkom-sda.sch.id', 'study_program_id' => 1, 'cohort_id' => 2, 'gender' => 'L'],
            ['name' => 'Rini Susanti', 'email' => 'rini.susanti@student.smktelkom-sda.sch.id', 'study_program_id' => 1, 'cohort_id' => 2, 'gender' => 'P'],
            
            // RPL Students
            ['name' => 'Joko Widodo', 'email' => 'joko.widodo@student.smktelkom-sda.sch.id', 'study_program_id' => 2, 'cohort_id' => 3, 'gender' => 'L'],
            ['name' => 'Maya Sari', 'email' => 'maya.sari@student.smktelkom-sda.sch.id', 'study_program_id' => 2, 'cohort_id' => 3, 'gender' => 'P'],
            ['name' => 'Dian Permata', 'email' => 'dian.permata@student.smktelkom-sda.sch.id', 'study_program_id' => 2, 'cohort_id' => 3, 'gender' => 'P'],
            ['name' => 'Rizal Fauzi', 'email' => 'rizal.fauzi@student.smktelkom-sda.sch.id', 'study_program_id' => 2, 'cohort_id' => 2, 'gender' => 'L'],
            ['name' => 'Indah Sari', 'email' => 'indah.sari@student.smktelkom-sda.sch.id', 'study_program_id' => 2, 'cohort_id' => 2, 'gender' => 'P'],
            ['name' => 'Bayu Pratama', 'email' => 'bayu.pratama@student.smktelkom-sda.sch.id', 'study_program_id' => 2, 'cohort_id' => 1, 'gender' => 'L'],
            
            // MM Students
            ['name' => 'Lina Marlina', 'email' => 'lina.marlina@student.smktelkom-sda.sch.id', 'study_program_id' => 3, 'cohort_id' => 3, 'gender' => 'P'],
            ['name' => 'Tono Susilo', 'email' => 'tono.susilo@student.smktelkom-sda.sch.id', 'study_program_id' => 3, 'cohort_id' => 3, 'gender' => 'L'],
            ['name' => 'Fitri Handayani', 'email' => 'fitri.handayani@student.smktelkom-sda.sch.id', 'study_program_id' => 3, 'cohort_id' => 2, 'gender' => 'P'],
            ['name' => 'Eko Prasetyo', 'email' => 'eko.prasetyo@student.smktelkom-sda.sch.id', 'study_program_id' => 3, 'cohort_id' => 2, 'gender' => 'L'],
        ];
        
        foreach ($students as $studentData) {
            // Create user
            $user = User::create([
                'name' => $studentData['name'],
                'email' => $studentData['email'],
                'password' => Hash::make('password123'),
            ]);
            
            // Assign siswa role
            $user->assignRole('siswa');
            
            // Create student record
            DB::table('students')->insert([
                'user_id' => $user->id,
                'study_program_id' => $studentData['study_program_id'],
                'cohort_id' => $studentData['cohort_id'],
                'parent_number' => '08' . rand(1000000000, 9999999999),
                'parent_name' => 'Orang Tua ' . $studentData['name'],
                'gender' => $studentData['gender'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
} 