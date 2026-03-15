import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../../components/layout/Header/Header'
import Footer from '../../../components/layout/Footer/Footer'
import api from '../../../services/api'

export default function CreateEspace() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [equipements, setEquipements] = useState([])
    const [selectedEquipements, setSelectedEquipements] = useState([])
    const [photos, setPhotos] = useState([])

    const [formData, setFormData] = useState({
        nom: '',
        surface: '',
        type: '',
        tarif_journalier: '',
    })

    useEffect(() => {
        api.get('/equipements').then(r => setEquipements(r.data))
    }, [])

    const toggleEquipement = (id) => {
        setSelectedEquipements(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        )
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
            selectedEquipements.forEach((id, i) => {
                data.append(`equipements[${i}]`, id)
            })
            photos.forEach((photo, i) => {
                data.append(`photos[${i}]`, photo)
            })
            await api.post('/admin/espaces', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            navigate('/admin/espaces')
        } catch {
            setError("Erreur lors de la création de l'espace")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-eco-light flex flex-col">
            <Header />

            <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">

                <button
                    onClick={() => navigate('/admin/espaces')}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-6 transition-all"
                >
                    <i className="bi bi-arrow-left"></i>
                    Retour
                </button>

                <div className="bg-white rounded-2xl shadow-sm p-6 max-w-2xl mx-auto">
                    <h1 className="text-xl font-bold text-gray-800 mb-1 tracking-tighter">Créer un espace</h1>
                    <p className="text-gray-400 text-sm mb-6">Ajoutez un nouvel espace de coworking</p>

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
                                    <option value="">Choisir un type</option>
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

                        {/* Photos */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Photos</label>
                            <div
                                className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-eco-blue transition-all cursor-pointer"
                                onClick={() => document.getElementById('photos-input').click()}
                            >
                                <i className="bi bi-cloud-upload text-2xl text-gray-300 mb-2 block"></i>
                                <p className="text-sm text-gray-400">Cliquez pour ajouter des photos</p>
                                <p className="text-xs text-gray-300 mt-1">WebP, AVIF, JPG, PNG — max 2MB</p>
                                <input
                                    id="photos-input"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setPhotos(Array.from(e.target.files))}
                                />
                            </div>
                            {/* Preview photos */}
                            {photos.length > 0 && (
                                <div className="flex gap-2 mt-3 flex-wrap">
                                    {photos.map((photo, i) => (
                                        <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden">
                                            <img
                                                src={URL.createObjectURL(photo)}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                                                className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-bl-lg"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Boutons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/espaces')}
                                className="flex-1 py-3 rounded-lg text-sm font-medium text-gray-600 border hover:text-zinc-50 border-gray-200 hover:bg-neutral-300 transition-all"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 rounded-lg text-sm font-medium text-gray-800 transition-opacity hover:opacity-90 disabled:opacity-50 bg-eco-blue"
                            >
                                {loading ? 'Création...' : "Créer l'espace"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    )
}