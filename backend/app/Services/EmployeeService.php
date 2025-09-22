<?php

namespace App\Services;

use App\Models\Employee;
use App\Repositories\EmployeeRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpFoundation\Response;

class EmployeeService
{
    protected EmployeeRepository $employeeRepository;

    public function __construct(EmployeeRepository $employeeRepository)
    {
        $this->employeeRepository = $employeeRepository;
    }

    public function getAll(?int $perPage = null, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->employeeRepository->getAll($perPage, $filters);
    }

    public function getById(int $id): Employee
    {
        $employee = $this->employeeRepository->getById($id);

        if (! $employee) {
            throw new \Exception('Employee not found', Response::HTTP_NOT_FOUND);
        }

        return $employee;
    }

    public function create(array $data): Employee
    {
        // Validate unique constraints
        if ($this->employeeRepository->nipExists($data['nip'])) {
            throw new \Exception('NIP already exists', Response::HTTP_CONFLICT);
        }

        if ($this->employeeRepository->userIdExists($data['user_id'])) {
            throw new \Exception('User already has an employee record', Response::HTTP_CONFLICT);
        }

        return $this->employeeRepository->create($data);
    }

    public function update(int $id, array $data): Employee
    {
        $employee = $this->getById($id);

        // Validate unique constraints
        if (isset($data['nip']) && $this->employeeRepository->nipExists($data['nip'], $id)) {
            throw new \Exception('NIP already exists', Response::HTTP_CONFLICT);
        }

        if (isset($data['user_id']) && $this->employeeRepository->userIdExists($data['user_id'], $id)) {
            throw new \Exception('User already has an employee record', Response::HTTP_CONFLICT);
        }

        return $this->employeeRepository->update($employee, $data);
    }

    public function delete(int $id): bool
    {
        $employee = $this->getById($id);

        return $this->employeeRepository->delete($employee);
    }

    public function getByUserId(int $userId): ?Employee
    {
        return $this->employeeRepository->getByUserId($userId);
    }

    public function getByNip(string $nip): ?Employee
    {
        return $this->employeeRepository->getByNip($nip);
    }

    public function getByUnitId(int $unitId): Collection
    {
        return $this->employeeRepository->getByUnitId($unitId);
    }

    public function getByPositionId(int $positionId): Collection
    {
        return $this->employeeRepository->getByPositionId($positionId);
    }

    public function getEmployeeStatistics(): array
    {
        return $this->employeeRepository->getEmployeeStatistics();
    }

    public function exists(int $id): bool
    {
        return $this->employeeRepository->exists($id);
    }
}
