import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import Header from '../../../components/layout/Header/Header'
import Footer from '../../../components/layout/Footer/Footer'
import api from '../../../services/api'

export default function Profil() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [formData, setFormData] = useState({
        nom: user?.nom || '',
        prenom: user?.prenom || '',
        email: user?.email || '',
        telephone: user?.telephone || '',
        adresse: user?.adresse || '',
        nouveau_mot_de_passe: '',
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')
        try {
            await api.put(`/users/${user.id}`, {
                nom: formData.nom,
                prenom: formData.prenom,
                email: formData.email,
                telephone: formData.telephone,
                adresse: formData.adresse,
            })

            if (formData.nouveau_mot_de_passe) {
                await api.put(`/users/${user.id}/password`, {
                    nouveau_mot_de_passe: formData.nouveau_mot_de_passe,
                    confirmation_mot_de_passe: formData.nouveau_mot_de_passe,
                })
            }

            setSuccess('Profil mis à jour avec succès')
            setEditing(false)
        } catch {
            setError('Erreur lors de la modification')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) return
        try {
            await api.delete(`/users/${user.id}`)
            await logout()
            navigate('/login')
        } catch {
            setError('Erreur lors de la suppression')
        }
    }

    const inputClass = `w-full border rounded-lg px-4 py-2 text-sm focus:outline-none ${editing
            ? 'border-gray-200 bg-eco-light focus:border-eco-blue'
            : 'border-transparent bg-eco-light text-gray-600'
        }`

    return (
        <div className="min-h-screen bg-eco-light flex flex-col">
            <Header />

            <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">

                {/* Retour */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-6 transition-all"
                >
                    <i className="bi bi-arrow-left"></i>
                    Retour
                </button>

                <div className="bg-white rounded-2xl shadow-sm p-6 max-w-lg mx-auto">

                    {/* En-tête */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 tracking-tighter">Mon profil</h1>
                            <p className="text-gray-400 text-sm">Gérez vos informations personnelles</p>
                        </div>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">{success}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Prénom</label>
                                <input
                                    type="text"
                                    value={formData.prenom}
                                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                    className={inputClass}
                                    readOnly={!editing}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Nom</label>
                                <input
                                    type="text"
                                    value={formData.nom}
                                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                    className={inputClass}
                                    readOnly={!editing}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={inputClass}
                                readOnly={!editing}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Téléphone</label>
                            <input
                                type="tel"
                                value={formData.telephone}
                                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                className={inputClass}
                                readOnly={!editing}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Adresse</label>
                            <input
                                type="text"
                                value={formData.adresse}
                                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                                className={inputClass}
                                readOnly={!editing}
                                required
                            />
                        </div>

                        {/* Mot de passe uniquement en mode édition */}
                        {editing && (
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Nouveau mot de passe <span className="text-gray-400">(optionnel)</span>
                                </label>
                                <input
                                    type="password"
                                    value={formData.nouveau_mot_de_passe}
                                    onChange={(e) => setFormData({ ...formData, nouveau_mot_de_passe: e.target.value })}
                                    placeholder="Laisser vide pour ne pas changer"
                                    className="w-full border border-gray-200 bg-eco-light rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-eco-blue"
                                />
                            </div>
                        )}

                        {/* Boutons */}
                        <div className="flex gap-3 pt-2">
                            {editing ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => { setEditing(false); setError(''); setSuccess('') }}
                                        className="flex-1 py-3 rounded-lg text-sm font-medium text-gray-600 hover:text-zinc-50 border border-gray-200 hover:bg-neutral-300 transition-all"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-3 rounded-lg text-sm font-medium text-gray-800 transition-opacity hover:opacity-90 disabled:opacity-50"
                                        style={{ background: 'linear-gradient(to right, #B2F7EF, #7BDFF2, #B2F7EF)' }}
                                    >
                                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setEditing(true)}
                                        className="flex-1 py-3 rounded-lg text-sm font-medium text-gray-800 transition-opacity hover:opacity-90 bg-eco-pink"
                                    >
                                        <i className="bi bi-pencil me-2"></i>
                                        Modifier
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="flex-1 py-3 rounded-lg text-sm font-medium text-white bg-red-500"
                                    >
                                        <i className="bi bi-trash me-2"></i>
                                        Supprimer
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    )
}