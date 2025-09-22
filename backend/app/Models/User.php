<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relasi: User sebagai kepala unit (one-to-many)
    public function unitsHeaded()
    {
        return $this->hasMany(Unit::class, 'head_id');
    }

    // Relasi: User memiliki data employee (one-to-one)
    public function employee()
    {
        return $this->hasOne(Employee::class);
    }

    // Relasi: User memiliki data student (one-to-one)
    public function student()
    {
        return $this->hasOne(Student::class);
    }

    // Helper method: Mendapatkan posisi melalui employee
    public function currentPosition()
    {
        return $this->employee ? $this->employee->position : null;
    }

    // Helper method: Mendapatkan unit melalui employee
    public function unit()
    {
        return $this->employee ? $this->employee->unit : null;
    }

    // Helper method: Mendapatkan atasan langsung
    public function directSuperior()
    {
        if ($this->employee) {
            $superiorEmployee = $this->employee->directSuperior();
            return $superiorEmployee ? $superiorEmployee->user : null;
        }
        return null;
    }

    // Helper method: Mendapatkan semua bawahan
    public function allSubordinates()
    {
        if ($this->employee) {
            $subordinateEmployees = $this->employee->allSubordinates();
            return $subordinateEmployees->pluck('user');
        }
        return collect();
    }

    public function panjarRequests()
    {
        return $this->hasMany(PanjarRequest::class, 'created_by');
    }

    public function verifications()
    {
        return $this->hasMany(PanjarRequest::class, 'verified_by');
    }

    public function approvals()
    {
        return $this->hasMany(PanjarRequest::class, 'approved_by');
    }

    public function panjarItemHistories()
    {
        return $this->hasMany(PanjarItemHistory::class, 'reviewed_by');
    }
}

