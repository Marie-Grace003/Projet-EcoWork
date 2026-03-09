<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use App\Models\Espace;
use App\Models\EspacePhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class EspaceController extends Controller
{
    // GET /api/espaces — liste tous les espaces
    public function index(Request $request)
    {
        //ajout de cache pour la liste des espaces (1 heure)
        if (!$request->has('date_debut') && !$request->has('type')) {
        $espaces = Cache::remember('espaces', 3600, function () {
            return Espace::with(['equipements', 'photos'])->paginate(10);
        });
        return response()->json($espaces);
    }

        $query = Espace::with(['equipements', 'photos']);

        // Filtre par type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filtre par date (espaces disponibles)
        if ($request->has('date_debut') && $request->has('date_fin')) {
            $query->whereDoesntHave('reservations', function ($q) use ($request) {
                $q->where('date_debut', '<=', $request->date_fin)
                    ->where('date_fin', '>=', $request->date_debut);
            });
        }

        return response()->json($query->paginate(10)); // pagination à 10 par page
    }

    // GET /api/espaces/{id} — détail d'un espace
    public function show($id)
    {
        $espace = Espace::with(['equipements', 'photos'])->findOrFail($id);
        return response()->json($espace);
    }

    // POST /api/admin/espaces — créer un espace (admin)
    public function store(Request $request)
    {
        $request->validate([
            'nom'              => 'required|string|max:255',
            'surface'          => 'required|numeric',
            'type'             => 'required|in:bureau,salle_de_reunion,conference',
            'tarif_journalier' => 'required|numeric',
            'equipements'      => 'array',
            'photos'           => 'array',
            'photos.*'         => 'image|mimes:jpeg,png,jpg,webp,avif|max:2048',
        ]);

        $espace = Espace::create([
            'nom'              => $request->nom,
            'surface'          => $request->surface,
            'type'             => $request->type,
            'tarif_journalier' => $request->tarif_journalier,
        ]);

        // Associer les équipements
        if ($request->has('equipements')) {
            $espace->equipements()->sync($request->equipements);
        }

        // Upload des photos
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $chemin = $photo->store('espaces', 'public');
                EspacePhoto::create([
                    'espace_id' => $espace->id,
                    'chemin'    => $chemin,
                ]);
            }
        }

        return response()->json($espace->load(['equipements', 'photos']), 201);
    }

    // PUT /api/admin/espaces/{id} — modifier un espace (admin)
    public function update(Request $request, $id)
    {
        $espace = Espace::findOrFail($id);

        $request->validate([
            'nom'              => 'string|max:255',
            'surface'          => 'numeric',
            'type'             => 'in:bureau,salle_de_reunion,conference',
            'tarif_journalier' => 'numeric',
            'equipements'      => 'array',
            'photos'           => 'array',           // ✅ ajouté
            'photos.*'         => 'image|mimes:jpeg,png,jpg,webp,avif|max:2048', // ✅ ajouté
        ]);

        $espace->update($request->only([
            'nom',
            'surface',
            'type',
            'tarif_journalier'
        ]));

        // Ajout de nouvelles photos
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $chemin = $photo->store('espaces', 'public');
                EspacePhoto::create([
                    'espace_id' => $espace->id,
                    'chemin'    => $chemin,
                ]);
            }
        }

        // Mettre à jour les équipements
        if ($request->has('equipements')) {
            $espace->equipements()->sync($request->equipements);
        }

        return response()->json($espace->load(['equipements', 'photos']));
    }

    // DELETE /api/admin/espaces/{id} — supprimer un espace (admin)
    public function destroy($id)
    {
        $espace = Espace::findOrFail($id);

        // Supprimer les fichiers photos du stockage
        foreach ($espace->photos as $photo) {
            Storage::disk('public')->delete($photo->chemin);
        }

        $espace->delete();

        return response()->json(['message' => 'Espace supprimé avec succès']);
    }

    // DELETE /api/admin/espaces/photos/{id} — supprimer une photo (admin)
    public function destroyPhoto($id)
    {
        $photo = EspacePhoto::findOrFail($id);
        Storage::disk('public')->delete($photo->chemin);
        $photo->delete();

        return response()->json(['message' => 'Photo supprimée avec succès']);
    }
}
