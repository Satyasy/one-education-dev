<?php

namespace App\Repositories;

use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;

class AuthRepository
{
    public function login(array $data){
        $credentials = [
            'email' => $data['email'],
            'password' => $data['password'],
        ];
        if(!Auth::attempt($credentials)){
            return response()->json([
                'message' => 'The provided credentials do not match our records.',
            ], 401);
        }
        request()->session()->regenerate();
        return response()->json([
            'message' => 'Login successful',
            'user' => new UserResource(Auth::user()->load('roles')),
        ], 200);
    }

    public function tokenLogin(array $data){
        if (!Auth::attempt([
            'email' => $data['email'],
            'password' => $data['password'],
        ])) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }
        $user = Auth::user();
        $token = $user->createToken('API Token')->plainTextToken;
        return response()->json([
            'message' => 'Login successful',
            'user' => new UserResource($user->load('roles')),
            'token' => $token,
        ]);
    }
}