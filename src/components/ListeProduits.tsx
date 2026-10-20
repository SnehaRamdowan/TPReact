import { useEffect, useState } from 'react';
import { API_URL } from '../config';

interface Produit {
    id: number;
    nom: string;
    prix: number;
    stock: number;
    categorie: string;
}

function ListeProduits() {
    const [produits, setProduits] = useState<Produit[]>([]);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState('');
    const [sourceCache, setSourceCache] = useState('');
    const [prenom, setPrenom] = useState('');
    const [quantites, setQuantites] = useState<Record<number, number>>({});
    const [message, setMessage] = useState('');
    const [erreurCommande, setErreurCommande] = useState('');
    const [enCours, setEnCours] = useState<number | null>(null);

    useEffect(() => {
        const controleur = new AbortController();

        async function charger() {
            try {
                const reponse = await fetch(`${API_URL}/api/produits`, {
                    signal: controleur.signal
                });

                if (!reponse.ok) {
                    throw new Error(
                        'Réponse du serveur incorrecte : ' + reponse.status
                    );
                }

                const donnees: Produit[] = await reponse.json();

                if (!controleur.signal.aborted) {
                    setProduits(donnees);
                    setSourceCache(
                        reponse.headers.get('X-Cache')?.toLowerCase() ?? ''
                    );
                }
            } catch (e) {
                if (!controleur.signal.aborted) {
                    setErreur(
                        e instanceof Error ? e.message : 'Erreur inconnue'
                    );
                }
            } finally {
                if (!controleur.signal.aborted) {
                    setChargement(false);
                }
            }
        }

        void charger();

        return () => controleur.abort();
    }, []);

    async function commander(produit: Produit) {
        const quantite = quantites[produit.id] ?? 1;

        setMessage('');
        setErreurCommande('');

        if (!prenom.trim() || prenom.trim().length > 100) {
            setErreurCommande('Entrez un prénom de 1 à 100 caractères.');
            return;
        }

        if (
            !Number.isInteger(quantite) ||
            quantite <= 0 ||
            quantite > produit.stock
        ) {
            setErreurCommande('Choisissez une quantité disponible.');
            return;
        }

        setEnCours(produit.id);

        try {
            const reponse = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prenom: prenom.trim(),
                    produitId: produit.id,
                    quantite
                })
            });

            const donnees = await reponse.json();

            if (!reponse.ok) {
                throw new Error(
                    donnees.erreur ?? 'Impossible de passer la commande'
                );
            }

            setProduits(anciens =>
                anciens.map(p =>
                    p.id === produit.id
                        ? { ...p, stock: donnees.commande.stockRestant }
                        : p
                )
            );

            setMessage(
                `Merci ${donnees.commande.prenom} ! ` +
                `Commande n°${donnees.commande.id} confirmée : ` +
                `${quantite} × ${produit.nom}.`
            );

            setQuantites(anciennes => ({
                ...anciennes,
                [produit.id]: 1
            }));
        } catch (e) {
            setErreurCommande(
                e instanceof Error ? e.message : 'Erreur inconnue'
            );
        } finally {
            setEnCours(null);
        }
    }

    if (chargement) {
        return <p>Chargement des produits…</p>;
    }

    if (erreur) {
        return (
            <p role="alert" style={{ color: '#c62828' }}>
                Erreur : {erreur}
            </p>
        );
    }

    return (
        <div>
            <p>
                Source du dernier chargement du catalogue :{' '}
                <strong>
                    {sourceCache === 'hit'
                        ? 'Redis — HIT'
                        : sourceCache === 'miss'
                            ? 'PostgreSQL — MISS'
                            : sourceCache === 'bypass'
                                ? 'PostgreSQL — cache contourné'
                                : 'Non précisée'}
                </strong>
            </p>

            <label htmlFor="prenom-client">Votre prénom : </label>
            <input
                id="prenom-client"
                value={prenom}
                onChange={e => setPrenom(e.target.value)}
                maxLength={100}
                autoComplete="given-name"
                required
            />

            {message && <p role="status">{message}</p>}

            {erreurCommande && (
                <p role="alert" style={{ color: '#c62828' }}>
                    {erreurCommande}
                </p>
            )}

            <ul>
                {produits.map(produit => (
                    <li key={produit.id}>
                        <strong>{produit.nom}</strong>
                        <p>Prix : {produit.prix.toFixed(2)} $</p>
                        <p>Stock : {produit.stock}</p>
                        <p>Catégorie : {produit.categorie}</p>

                        {produit.stock > 0 ? (
                            <form
                                onSubmit={e => {
                                    e.preventDefault();
                                    void commander(produit);
                                }}
                            >
                                <label htmlFor={`quantite-${produit.id}`}>
                                    Quantité :{' '}
                                </label>

                                <input
                                    id={`quantite-${produit.id}`}
                                    type="number"
                                    min={1}
                                    max={produit.stock}
                                    step={1}
                                    required
                                    value={quantites[produit.id] ?? 1}
                                    onChange={e =>
                                        setQuantites(anciennes => ({
                                            ...anciennes,
                                            [produit.id]:
                                            e.target.valueAsNumber
                                        }))
                                    }
                                />

                                <button
                                    type="submit"
                                    disabled={enCours !== null}
                                >
                                    {enCours === produit.id
                                        ? 'Commande en cours…'
                                        : 'Commander'}
                                </button>
                            </form>
                        ) : (
                            <p>Rupture de stock</p>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListeProduits;