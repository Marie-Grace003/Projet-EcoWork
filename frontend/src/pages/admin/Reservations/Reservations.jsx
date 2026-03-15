import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../../components/layout/Header/Header'
import Footer from '../../../components/layout/Footer/Footer'
import api from '../../../services/api'

export default function AdminReservations() {
    const navigate = useNavigate()
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterDate, setFilterDate] = useState('')

    useEffect(() => {
        fetchReservations()
    }, [])

    const fetchReservations = async () => {
        try {
            const response = await api.get('/admin/reservations')
            setReservations(response.data)
        } catch {
            console.error('Erreur chargement réservations')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette réservation ?')) return
        try {
            await api.delete(`/reservations/${id}`)
            setReservations(reservations.filter(r => r.id !== id))
        } catch {
            console.error('Erreur suppression')
        }
    }

    const handleToggleStatut = async (reservation) => {
        try {
            const response = await api.put(`/admin/reservations/${reservation.id}`, {
                facture_acquittee: !reservation.facture_acquittee
            })
            setReservations(reservations.map(r =>
                r.id === reservation.id ? response.data : r
            ))
        } catch {
            console.error('Erreur mise à jour statut')
        }
    }

    const filtered = filterDate
        ? reservations.filter(r => r.date_debut <= filterDate && r.date_fin >= filterDate)
        : reservations

    return (
        <div className="min-h-screen bg-eco-light flex flex-col">
            <Header />

            <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">

                {/* Retour */}
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-6 transition-all"
                >
                    <i className="bi bi-arrow-left"></i>
                    Retour au tableau de bord
                </button>

                {/* Card principale */}
                <div className="bg-white rounded-2xl shadow-sm p-6">

                    {/* En-tête */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <i className="bi bi-calendar3 text-eco-blue text-xl"></i>
                            <h1 className="text-2xl font-bold text-gray-800 tracking-tighter">Gestion des réservations</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-500">Filtrer par date :</label>
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-eco-blue bg-eco-light"
                            />
                            {filterDate && (
                                <button
                                    onClick={() => setFilterDate('')}
                                    className="text-gray-400 hover:text-gray-600 text-sm"
                                >
                                    <i className="bi bi-x-circle"></i>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Tableau */}
                    {loading ? (
                        <p className="text-center text-gray-400 py-8">Chargement...</p>
                    ) : filtered.length === 0 ? (
                        <p className="text-center text-gray-400 py-8">Aucune réservation trouvée</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left text-xs font-medium text-gray-400 pb-3">Utilisateur</th>
                                        <th className="text-left text-xs font-medium text-gray-400 pb-3">Espace</th>
                                        <th className="text-left text-xs font-medium text-gray-400 pb-3 hidden md:table-cell">Date début</th>
                                        <th className="text-left text-xs font-medium text-gray-400 pb-3 hidden md:table-cell">Date fin</th>
                                        <th className="text-left text-xs font-medium text-gray-400 pb-3 hidden lg:table-cell">Prix total</th>
                                        <th className="text-left text-xs font-medium text-gray-400 pb-3">Statut</th>
                                        <th className="text-right text-xs font-medium text-gray-400 pb-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((r) => (
                                        <tr key={r.id} className="border-b border-gray-50 hover:bg-eco-light transition-all">
                                            <td className="py-3 text-sm font-medium text-gray-800">
                                                {r.user?.prenom} {r.user?.nom}
                                            </td>
                                            <td className="py-3 text-sm text-gray-600">
                                                {r.espace?.nom}
                                            </td>
                                            <td className="py-3 text-sm text-gray-500 hidden md:table-cell">
                                                {new Date(r.date_debut).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="py-3 text-sm text-gray-500 hidden md:table-cell">
                                                {new Date(r.date_fin).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="py-3 text-sm font-medium text-gray-800 hidden lg:table-cell">
                                                {r.prix_total}€
                                            </td>
                                            <td className="py-3">
                                                <button
                                                    onClick={() => handleToggleStatut(r)}
                                                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                                        r.facture_acquittee
                                                            ? 'bg-eco-mint text-gray-700'
                                                            : 'bg-eco-pink text-gray-700'
                                                    }`}
                                                >
                                                    <i className={`bi ${r.facture_acquittee ? 'bi-check-circle' : 'bi-clock'}`}></i>
                                                    {r.facture_acquittee ? 'Validée' : 'En attente'}
                                                </button>
                                            </td>
                                            <td className="py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleDelete(r.id)}
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-red-500"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}