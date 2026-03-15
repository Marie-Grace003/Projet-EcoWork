import { useState } from 'react'
import api from '../../../services/api'

export default function EditReservationModal({ reservation, onClose, onUpdated }) {
    const today = new Date().toISOString().split('T')[0]
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        date_debut: reservation.date_debut?.split('T')[0] || '',
        date_fin: reservation.date_fin?.split('T')[0] || '',
    })

    const nbJours = formData.date_debut && formData.date_fin
        ? Math.max(0, Math.round(
            (new Date(formData.date_fin) - new Date(formData.date_debut)) / (1000 * 60 * 60 * 24)
        ) + 1)
        : 0

    const prixTotal = nbJours * reservation.espace?.tarif_journalier

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const response = await api.put(`/reservations/${reservation.id}`, formData)
            onUpdated(response.data)
            onClose()
        } catch (err) {
            if (err.response?.data?.message) {
                setError(err.response.data.message)
            } else {
                setError('Erreur lors de la modification')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 tracking-tighter">Modifier la réservation</h2>
                        <p className="text-gray-400 text-sm">{reservation.espace?.nom}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                        <i className="bi bi-exclamation-circle"></i>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Date de début</label>
                        <input
                            type="date"
                            min={today}
                            value={formData.date_debut}
                            onChange={(e) => setFormData({ ...formData, date_debut: e.target.value, date_fin: '' })}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-eco-blue bg-eco-light"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Date de fin</label>
                        <input
                            type="date"
                            min={formData.date_debut || today}
                            value={formData.date_fin}
                            onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-eco-blue bg-eco-light"
                            required
                        />
                    </div>

                    {nbJours > 0 && (
                        <div className="bg-eco-light rounded-xl p-4 space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>{reservation.espace?.tarif_journalier}€ × {nbJours} jour{nbJours > 1 ? 's' : ''}</span>
                                <span>{prixTotal}€</span>
                            </div>
                            <hr className="border-gray-200" />
                            <div className="flex justify-between font-bold text-gray-800">
                                <span>Nouveau total</span>
                                <span className="text-eco-blue">{prixTotal}€</span>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-lg text-sm font-medium text-gray-600 border hover:text-zinc-50 border-gray-200 hover:bg-neutral-300 transition-all"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading || nbJours === 0}
                            className="flex-1 py-3 rounded-lg text-sm font-medium text-gray-800"
                            style={{ background: 'linear-gradient(to right, #B2F7EF, #7BDFF2, #B2F7EF)' }}
                        >
                            {loading ? 'Modification...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}