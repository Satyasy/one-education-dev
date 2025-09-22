<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AuthService;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    private AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(LoginRequest $request)
    {
        return $this->authService->login($request->validated());
    }

    public function tokenLogin(LoginRequest $request)
    {
        return $this->authService->tokenLogin($request->validated());
    }
    public function user(Request $request)
    {
        $user = $request->user()->load('roles');
        
        // Load different relations based on user role
        if ($user->hasRole('siswa')) {
            $user->load(['student.studyProgram', 'student.cohort']);
        } else {
            $user->load(['employee.unit', 'employee.position']);
        }
        
        return response()->json(new UserResource($user));
    }
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
