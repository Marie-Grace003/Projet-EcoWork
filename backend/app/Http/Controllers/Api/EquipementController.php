<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipement;
use Illuminate\Http\Request;

class EquipementController extends Controller
{
    // GET /api/equipements — liste tous les équipements
    public function index()
    {
        return response()->json(Equipement::all());
    }

    // POST /api/admin/equipements — créer un équipement (admin)
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255|unique:equipements,nom',
        ]);

        $equipement = Equipement::create([
            'nom' => $request->nom,
        ]);

        return response()->json($equipement, 201);
    }

    // PUT /api/admin/equipements/{id} — modifier un équipement (admin)
    public function update(Request $request, $id)
    {
        $equipement = Equipement::findOrFail($id);

        $request->validate([
            'nom' => 'required|string|max:255|unique:equipements,nom,' . $id,
        ]);

        $equipement->update(['nom' => $request->nom]);

        return response()->json($equipement);
    }

    // DELETE /api/admin/equipements/{id} — supprimer un équipement (admin)
    public function destroy($id)
    {
        $equipement = Equipement::findOrFail($id);
        $equipement->delete();

        return response()->json(['message' => 'Équipement supprimé avec succès']);
    }
}
