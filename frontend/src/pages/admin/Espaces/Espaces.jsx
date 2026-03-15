import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../../components/layout/Header/Header'
import Footer from '../../../components/layout/Footer/Footer'
import EditEspaceModal from './EditEspaceModal'
import api from '../../../services/api'

const typeBadge = {
    bureau: { label: 'Bureau', color: 'bg-eco-blue text-white' },
    salle_de_reunion: { label: 'Salle de réunion', color: 'bg-eco-pink text-gray-700' },
    conference: { label: 'Conférence', color: 'bg-eco-mint text-gray-700' },
}

export default function AdminEspaces() {
    const navigate = useNavigate()
    const [espaces, setEspaces] = useState([])
    const [search, setSearch] = useState('')
    const [filterType, setFilterType] = useState('')
    const [loading, setLoading] = useState(true)
    const [selectedEspace, setSelectedEspace] = useState(null)

    useEffect(() => {
        fetchEspaces()
    }, [])

    const fetchEspaces = async () => {
        try {
            const response = await api.get('/espaces')
            setEspaces(response.data.data || response.data)
        } catch {
            console.error('Erreur chargement espaces')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cet espace ?')) return
        try {
            await api.delete(`/admin/espaces/${id}`)
            setEspaces(espaces.filter(e => e.id !== id))
        } catch {
            console.error('Erreur suppression')
        }
    }

    const filtered = espaces.filter(e => {
        const matchSearch = e.nom.toLowerCase().includes(search.toLowerCase())
        const matchType = filterType ? e.type === filterType : true
        return matchSearch && matchType
    })

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

                <div className="bg-white rounded-2xl shadow-sm p-6">
                    {/* En-tête */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tighter">Gestion des espaces</h1>
                        <button
                            onClick={() => navigate('/admin/espaces/create')}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-800 text-sm font-medium transition-opacity hover:opacity-90"
                            style={{ background: 'linear-gradient(to right, #7BDFF2, #7BDFF2, #B2F7EF)' }}
                        >
                            <i className="bi bi-plus-circle"></i>
                            Créer un espace
                        </button>
                    </div>

                    {/* Filtres */}
                    <div className="flex flex-col md:flex-row gap-3 mb-6">
                        <div className="relative flex-1">
                            <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="Rechercher un espace..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-eco-blue bg-white"
                            />
                        </div>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 border border-gray-100 rounded-xl text-sm focus:outline-none bg-white text-gray-600"
                        >
                            <option value="">Tous les types</option>
                            <option value="bureau">Bureau</option>
                            <option value="salle_de_reunion">Salle de réunion</option>
                            <option value="conference">Conférence</option>
                        </select>
                    </div>

                    {/* Grille espaces */}
                    {loading ? (
                        <p className="text-center text-gray-400 py-8">Chargement...</p>
                    ) : filtered.length === 0 ? (
                        <p className="text-center text-gray-400 py-8">Aucun espace trouvé</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((espace) => (
                                <div key={espace.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">

                                    {/* Photo */}
                                    <div className="relative h-48 bg-eco-light">
                                        {espace.photos && espace.photos.length > 0 ? (
                                            <img
                                                src={`http://127.0.0.1:8000/storage/${espace.photos[0].chemin}`}
                                                alt={espace.nom}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <i className="bi bi-building text-4xl"></i>
                                            </div>
                                        )}
                                        {/* Badge type */}
                                        <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${typeBadge[espace.type]?.color}`}>
                                            {typeBadge[espace.type]?.label}
                                        </span>
                                        {/* Nom sur la photo */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                            <h3 className="text-white font-bold">{espace.nom}</h3>
                                        </div>
                                    </div>

                                    {/* Infos */}
                                    <div className="p-4">
                                        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                                            <i className="bi bi-arrows-angle-expand"></i>
                                            <span>{espace.surface} m²</span>
                                        </div>

                                        {/* Équipements */}
                                        {espace.equipements && espace.equipements.length > 0 && (
                                            <div className="mb-3">
                                                <p className="text-xs text-gray-400 mb-2">Équipements inclus</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {espace.equipements.slice(0, 3).map((eq) => (
                                                        <span key={eq.id} className="px-2 py-1 bg-eco-light text-gray-600 text-xs rounded-lg">
                                                            {eq.nom}
                                                        </span>
                                                    ))}
                                                    {espace.equipements.length > 3 && (
                                                        <span className="px-2 py-1 bg-eco-light text-gray-400 text-xs rounded-lg">
                                                            +{espace.equipements.length - 3} autres
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Tarif */}
                                        <p className="text-gray-800 font-bold mb-4">
                                            {espace.tarif_journalier}€ <span className="text-gray-400 font-normal text-sm">/jour</span>
                                        </p>

                                        {/* Boutons */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSelectedEspace(espace)}
                                                className="flex-1 py-2 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-eco-mint hover:text-gray-800 transition-all"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDelete(espace.id)}
                                                className="flex-1 py-2 rounded-xl text-sm font-medium text-white bg-red-500"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {selectedEspace && (
                    <EditEspaceModal
                        espace={selectedEspace}
                        onClose={() => setSelectedEspace(null)}
                        onUpdated={(updated) => {
                            setEspaces(espaces.map(e => e.id === updated.id ? updated : e))
                            setSelectedEspace(null)
                        }}
                    />
                )}
            </main>

            <Footer />
        </div>
    )
}