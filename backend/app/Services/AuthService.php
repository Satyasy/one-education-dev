<?php

namespace App\Services;
use App\Repositories\AuthRepository;

class AuthService
{
    protected $authRepository;

    public function __construct(AuthRepository $authRepository)
    {
        $this->authRepository = $authRepository;
    }

    public function login(array $credentials)
    {
        return $this->authRepository->login($credentials);
    }

    public function tokenLogin(array $credentials)
    {
        return $this->authRepository->tokenLogin($credentials);
    }
}