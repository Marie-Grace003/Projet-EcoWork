import { useState, useEffect } from 'react'
import api from '../../../services/api'

export default function EditEspaceModal({ espace, onClose, onUpdated }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [equipements, setEquipements] = useState([])
    const [selectedEquipements, setSelectedEquipements] = useState(
        espace.equipements?.map(e => e.id) || []
    )
    const [newPhotos, setNewPhotos] = useState([])

    const [formData, setFormData] = useState({
        nom: espace.nom,
        surface: espace.surface,
        type: espace.type,
        tarif_journalier: espace.tarif_journalier,
    })

    useEffect(() => {
        api.get('/equipements').then(r => setEquipements(r.data))
    }, [])

    const toggleEquipement = (id) => {
        setSelectedEquipements(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        )
    }

    const handleDeletePhoto = async (photoId) => {
        if (!confirm('Supprimer cette photo ?')) return
        try {
            await api.delete(`/admin/espaces/photos/${photoId}`)
            onUpdated({
                ...espace,
                photos: espace.photos.filter(p => p.id !== photoId)
            })
        } catch {
            console.error('Erreur suppression photo')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const data = new FormData()
            data.append('nom', formData.nom)
            data.append('surface', formData.surface)
            data.append('type', formData.type)
            data.append('tarif_journalier', formData.tarif_journalier)
            data.append('_method', 'PUT')
            selectedEquipements.forEach((id, i) => {
                data.append(`equipements[${i}]`, id)
            })
            newPhotos.forEach((photo, i) => {
                data.append(`photos[${i}]`, photo)
            })
            const response = await api.post(`/admin/espaces/${espace.id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            onUpdated(response.data)
            onClose()
        } catch {
            setError("Erreur lors de la modification")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-auto">

                {/* Header modal */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 tracking-tighter">Modifier l'espace</h2>
                        <p className="text-gray-400 text-sm">Modifiez les informations de l'espace</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Nom */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Nom de l'espace</label>
                            <input
                                type="text"
                                value={formData.nom}
                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-eco-blue bg-eco-light"
                                required
                            />
                        </div>

                        {/* Surface + Type */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Surface (m²)</label>
                                <input
                                    type="number"
                                    value={formData.surface}
                                    onChange={(e) => setFormData({ ...formData, surface: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-eco-blue bg-eco-light"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-eco-blue bg-eco-light"
                                    required
                                >
                                    <option value="bureau">Bureau</option>
                                    <option value="salle_de_reunion">Salle de réunion</option>
                                    <option value="conference">Conférence</option>
                                </select>
                            </div>
                        </div>

                        {/* Tarif */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Tarif journalier (€)</label>
                            <input
                                type="number"
                                value={formData.tarif_journalier}
                                onChange={(e) => setFormData({ ...formData, tarif_journalier: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-eco-blue bg-eco-light"
                                required
                            />
                        </div>

                        {/* Équipements */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Équipements</label>
                            <div className="flex flex-wrap gap-2">
                                {equipements.map((eq) => (
                                    <button
                                        key={eq.id}
                                        type="button"
                                        onClick={() => toggleEquipement(eq.id)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                            selectedEquipements.includes(eq.id)
                                                ? 'text-white'
                                                : 'bg-eco-light text-gray-600 hover:bg-eco-mint'
                                        }`}
                                        style={selectedEquipements.includes(eq.id) ? {
                                            background: 'linear-gradient(to right, #7BDFF2, #B2F7EF)'
                                        } : {}}
                                    >
                                        {selectedEquipements.includes(eq.id) && (
                                            <i className="bi bi-check me-1"></i>
                                        )}
                                        {eq.nom}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Photos existantes */}
                        {espace.photos && espace.photos.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Photos actuelles</label>
                                <div className="flex gap-2 flex-wrap">
                                    {espace.photos.map((photo) => (
                                        <div key={photo.id} className="relative w-16 h-16 rounded-lg overflow-hidden">
                                            <img
                                                src={`http://127.0.0.1:8000/storage/${photo.chemin}`}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleDeletePhoto(photo.id)}
                                                className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-bl-lg"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Nouvelles photos */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Ajouter des photos</label>
                            <div
                                className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-eco-blue transition-all cursor-pointer"
                                onClick={() => document.getElementById('edit-photos-input').click()}
                            >
                                <i className="bi bi-cloud-upload text-xl text-gray-300 mb-1 block"></i>
                                <p className="text-xs text-gray-400">Cliquez pour ajouter des photos</p>
                                <input
                                    id="edit-photos-input"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setNewPhotos(Array.from(e.target.files))}
                                />
                            </div>
                            {newPhotos.length > 0 && (
                                <div className="flex gap-2 mt-2 flex-wrap">
                                    {newPhotos.map((photo, i) => (
                                        <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden">
                                            <img
                                                src={URL.createObjectURL(photo)}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Boutons */}
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
                                disabled={loading}
                                className="flex-1 py-3 rounded-lg text-sm font-medium text-gray-800 bg-eco-blue"
                            >
                                {loading ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}