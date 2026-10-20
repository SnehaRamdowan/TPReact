import { useEffect, useState } from 'react';
import { API_URL } from '../config';

interface EtatArchitecture {
    api: 'ok' | 'indisponible';
    postgres: 'ok' | 'indisponible';
    redis: 'ok' | 'indisponible';
    cacheTTL: number;
}

function Architecture() {
    const [etat, setEtat] = useState<EtatArchitecture | null>(null);
    const [erreur, setErreur] = useState('');
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        let annule = false;
        let minuterie: ReturnType<typeof setTimeout> | undefined;
        const controleur = new AbortController();

        async function verifier() {
            try {
                const reponse = await fetch(`${API_URL}/api/arch`, {
                    signal: controleur.signal,
                    cache: 'no-store'
                });

                if (!reponse.ok) {
                    throw new Error(
                        'Vérification impossible : ' + reponse.status
                    );
                }

                const donnees: EtatArchitecture = await reponse.json();

                if (!annule) {
                    setEtat(donnees);
                    setErreur('');
                }
            } catch (e) {
                if (!annule) {
                    setEtat(null);
                    setErreur(
                        e instanceof Error
                            ? e.message
                            : 'Vérification impossible'
                    );
                }
            } finally {
                if (!annule) {
                    setChargement(false);
                    minuterie = setTimeout(() => {
                        void verifier();
                    }, 5000);
                }
            }
        }

        void verifier();

        return () => {
            annule = true;
            controleur.abort();
            clearTimeout(minuterie);
        };
    }, []);

    function afficherStatut(
        statut: 'ok' | 'indisponible' | undefined
    ) {
        if (!statut) {
            return (
                <p>
                    État : {chargement ? 'Vérification…' : 'Inconnu'}
                </p>
            );
        }

        return (
            <p>
                État :{' '}
                <strong
                    style={{
                        color: statut === 'ok' ? '#86efac' : '#fca5a5'
                    }}
                >
                    {statut === 'ok' ? 'Disponible' : 'Indisponible'}
                </strong>
            </p>
        );
    }

    return (
        <section>
            <h2>Comment fonctionne notre application ?</h2>

            <p>
                État des services vérifié toutes les 5 secondes.
            </p>

            {erreur && (
                <p role="alert" style={{ color: '#c62828' }}>
                    Impossible de joindre ou de vérifier l’API.
                    Les états de PostgreSQL et Redis sont inconnus.
                    {' '}{erreur}
                </p>
            )}

            <div className="architecture">
                <div className="architecture-bloc">
                    <h3>React</h3>
                    <p>Affiche la page et envoie les demandes.</p>
                    <p>
                        État : <strong>Page affichée</strong>
                    </p>
                </div>

                <div className="architecture-fleche">↕</div>

                <div className="architecture-bloc">
                    <h3>Express</h3>
                    <p>Reçoit les demandes et renvoie les réponses.</p>
                    {afficherStatut(etat?.api)}
                </div>

                <div className="architecture-donnees">
                    <div>
                        <div className="architecture-fleche">↕</div>

                        <div className="architecture-bloc">
                            <h3>PostgreSQL</h3>
                            <p>
                                Stocke les produits, les stocks
                                et les commandes.
                            </p>
                            {afficherStatut(etat?.postgres)}
                        </div>
                    </div>

                    <div>
                        <div className="architecture-fleche">↕</div>

                        <div className="architecture-bloc">
                            <h3>Redis</h3>
                            <p>
                                Cache les produits et compte
                                les visites et les commandes.
                            </p>
                            {afficherStatut(etat?.redis)}

                            {etat && (
                                <p>
                                    Durée du cache : {etat.cacheTTL} secondes.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Architecture;