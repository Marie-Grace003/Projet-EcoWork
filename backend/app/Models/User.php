<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'mot_de_passe',
        'type',
        'telephone',
        'adresse',
    ];

    protected $hidden = [
        'mot_de_passe',
        'remember_token',
    ];

    // Dis à Laravel que le mot de passe s'appelle mot_de_passe
    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }

    // Un utilisateur a plusieurs réservations
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'user_id');
    }

    // Vérifie si l'utilisateur est admin
    public function isAdmin()
    {
        return $this->type === 'admin';
    }
}
