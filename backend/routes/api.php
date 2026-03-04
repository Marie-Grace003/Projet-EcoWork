<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EspaceController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\EquipementController;
use App\Http\Controllers\Api\UserController;


// ===========================
// ROUTES PUBLIQUES
// ===========================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Consultation des espaces (public)
Route::get('/espaces',      [EspaceController::class, 'index']);
Route::get('/espaces/{id}', [EspaceController::class, 'show']);
Route::get('/equipements', [EquipementController::class, 'index']);


// ===========================
// ROUTES PROTÉGÉES (connecté)
// ===========================
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Profil utilisateur
    Route::put('/users/{id}',    [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // Réservations (utilisateur)
    Route::get('/reservations',         [ReservationController::class, 'index']);
    Route::post('/reservations',        [ReservationController::class, 'store']);
    Route::put('/reservations/{id}',    [ReservationController::class, 'userUpdate']);
    Route::delete('/reservations/{id}', [ReservationController::class, 'destroy']);


    // ===========================
    // ROUTES ADMIN SEULEMENT
    // ===========================
    Route::middleware('admin')->group(function () {

        // Gestion des espaces
        Route::post('/admin/espaces',        [EspaceController::class, 'store']);
        Route::put('/admin/espaces/{id}',    [EspaceController::class, 'update']);
        Route::delete('/admin/espaces/{id}', [EspaceController::class, 'destroy']);
        Route::delete('/admin/espaces/photos/{id}', [EspaceController::class, 'destroyPhoto']);

        // Gestion des réservations
        Route::get('/admin/reservations',      [ReservationController::class, 'adminIndex']);
        Route::put('/admin/reservations/{id}', [ReservationController::class, 'update']);

       // Gestion des équipements
        Route::post('/admin/equipements',        [EquipementController::class, 'store']);
        Route::put('/admin/equipements/{id}',    [EquipementController::class, 'update']);
        Route::delete('/admin/equipements/{id}', [EquipementController::class, 'destroy']);

        // Gestion des utilisateurs
        Route::get('/admin/users',         [UserController::class, 'index']);
        Route::post('/admin/users',        [UserController::class, 'createAdmin']);
        Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);
    });
});
