<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Espace;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    // GET /api/reservations — liste les réservations de l'utilisateur connecté
    public function index(Request $request)
    {
        $reservations = Reservation::with(['espace'])
            ->where('user_id', $request->user()->id)
            ->get();
        return response()->json($reservations);
    }

    // GET /api/admin/reservations — liste toutes les réservations (admin)
    public function adminIndex(Request $request)
    {
        $query = Reservation::with(['user', 'espace']);
        if ($request->has('date_debut') && $request->has('date_fin')) {
            $query->where('date_debut', '>=', $request->date_debut)
                  ->where('date_fin', '<=', $request->date_fin);
        }
        return response()->json($query->get());
    }

    // POST /api/reservations — créer une réservation
    public function store(Request $request)
    {
        $request->validate([
            'espace_id'  => 'required|exists:espaces,id',
            'date_debut' => 'required|date|after_or_equal:today',
            'date_fin'   => 'required|date|after:date_debut',
        ]);

        $conflit = Reservation::where('espace_id', $request->espace_id)
            ->where('date_debut', '<=', $request->date_fin)
            ->where('date_fin', '>=', $request->date_debut)
            ->exists();

        if ($conflit) {
            return response()->json([
                'message' => 'Cet espace est déjà réservé pour ces dates'
            ], 409);
        }

        $espace = Espace::findOrFail($request->espace_id);
        $debut  = \Carbon\Carbon::parse($request->date_debut);
        $fin    = \Carbon\Carbon::parse($request->date_fin);
        $jours  = $debut->diffInDays($fin) + 1;
        $prix   = $jours * $espace->tarif_journalier;

        $reservation = Reservation::create([
            'user_id'           => $request->user()->id,
            'espace_id'         => $request->espace_id,
            'date_debut'        => $request->date_debut,
            'date_fin'          => $request->date_fin,
            'prix_total'        => $prix,
            'facture_acquittee' => false,
        ]);

        return response()->json($reservation->load(['espace']), 201);
    }

    // PUT /api/admin/reservations/{id} — modifier une réservation (admin)
    public function update(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->update($request->only([
            'date_debut', 'date_fin', 'facture_acquittee'
        ]));
        return response()->json($reservation->load(['user', 'espace']));
    }

    // PUT /api/reservations/{id} — modifier sa propre réservation (utilisateur)
    public function userUpdate(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);

        if ($reservation->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $request->validate([
            'date_debut' => 'required|date|after_or_equal:today',
            'date_fin'   => 'required|date|after:date_debut',
        ]);

        $conflit = Reservation::where('espace_id', $reservation->espace_id)
            ->where('id', '!=', $id)
            ->where('date_debut', '<=', $request->date_fin)
            ->where('date_fin', '>=', $request->date_debut)
            ->exists();

        if ($conflit) {
            return response()->json([
                'message' => 'Cet espace est déjà réservé pour ces dates'
            ], 409);
        }
     // — Calcul automatique
        $espace = Espace::findOrFail($reservation->espace_id);
        $debut  = \Carbon\Carbon::parse($request->date_debut);
        $fin    = \Carbon\Carbon::parse($request->date_fin);
        $jours  = $debut->diffInDays($fin) + 1;
        $prix   = $jours * $espace->tarif_journalier;

        $reservation->update([
            'date_debut' => $request->date_debut,
            'date_fin'   => $request->date_fin,
            'prix_total' => $prix,
            'facture_acquittee' => false,
        ]);

        return response()->json($reservation->load(['espace']));
    }

    // DELETE /api/reservations/{id} — supprimer une réservation
    public function destroy(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);

        if (!$request->user()->isAdmin() && $reservation->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $reservation->delete();
        return response()->json(['message' => 'Réservation supprimée avec succès']);
    }
}
