import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../../components/layout/Header/Header'
import Footer from '../../../components/layout/Footer/Footer'
import EditReservationModal from './EditReservationModal'
import api from '../../../services/api'

export default function MesReservations() {
    const navigate = useNavigate()
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedReservation, setSelectedReservation] = useState(null)

    useEffect(() => {
        fetchReservations()
    }, [])

    const fetchReservations = async () => {
        try {
            const response = await api.get('/reservations')
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

    return (
        <div className="min-h-screen bg-eco-light flex flex-col">
            <Header />

            <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">

                {/* Retour */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-6 transition-all"
                >
                    <i className="bi bi-arrow-left"></i>
                    Retour
                </button>

                <div className="bg-white rounded-2xl shadow-sm p-6">

                    {/* En-tête */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 tracking-tighter">Mes réservations</h1>
                            <p className="text-gray-400 text-sm mt-1">{reservations.length} réservation(s)</p>
                        </div>
                        <button
                            onClick={() => navigate('/espaces')}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-800 text-sm font-medium transition-opacity hover:opacity-90"
                            style={{ background: 'linear-gradient(to left, #7BDFF2, #7BDFF2, #B2F7EF)' }}
                        >
                            <i className="bi bi-plus-circle"></i>
                            Réserver un espace
                        </button>
                    </div>

                    {/* Tableau */}
                    {loading ? (
                        <p className="text-center text-gray-400 py-8">Chargement...</p>
                    ) : reservations.length === 0 ? (
                        <div className="text-center py-12">
                            <i className="bi bi-calendar-x text-4xl text-gray-300 mb-3 block"></i>
                            <p className="text-gray-400 mb-4">Aucune réservation pour le moment</p>
                            <button
                                onClick={() => navigate('/espaces')}
                                className="px-6 py-3 rounded-xl text-gray-800 text-sm font-medium bg-teal-200"
                            >
                                Découvrir les espaces
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left text-xs font-medium text-gray-400 pb-3">Espace</th>
                                        <th className="text-left text-xs font-medium text-gray-400 pb-3 hidden md:table-cell">Date début</th>
                                        <th className="text-left text-xs font-medium text-gray-400 pb-3 hidden md:table-cell">Date fin</th>
                                        <th className="text-left text-xs font-medium text-gray-400 pb-3">Prix</th>
                                        <th className="text-left text-xs font-medium text-gray-400 pb-3">Statut</th>
                                        <th className="text-right text-xs font-medium text-gray-400 pb-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservations.map((r) => (
                                        <tr key={r.id} className="border-b border-gray-50 hover:bg-eco-light transition-all">
                                            <td className="py-3 text-sm font-medium text-gray-800">
                                                {r.espace?.nom}
                                            </td>
                                            <td className="py-3 text-sm text-gray-500 hidden md:table-cell">
                                                {new Date(r.date_debut).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="py-3 text-sm text-gray-500 hidden md:table-cell">
                                                {new Date(r.date_fin).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="py-3 text-sm font-medium text-gray-800">
                                                {r.prix_total}€
                                            </td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    r.facture_acquittee
                                                        ? 'bg-eco-mint text-gray-700'
                                                        : 'bg-eco-pink text-gray-700'
                                                }`}>
                                                    <i className={`bi ${r.facture_acquittee ? 'bi-check-circle' : 'bi-clock'}`}></i>
                                                    {r.facture_acquittee ? 'Validée' : 'En attente'}
                                                </span>
                                            </td>
                                            <td className="py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedReservation(r)}
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-800 bg-eco-mint"
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
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

                {/* Modal modification - à créer */}
                {selectedReservation && (
                    <EditReservationModal
                        reservation={selectedReservation}
                        onClose={() => setSelectedReservation(null)}
                        onUpdated={(updated) => {
                            setReservations(reservations.map(r => r.id === updated.id ? updated : r))
                            setSelectedReservation(null)
                        }}
                    />
                )}
            </main>

            <Footer />
        </div>
    )
}