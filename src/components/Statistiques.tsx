import { useEffect, useState } from 'react';
import { API_URL } from '../config';

interface Stats {
    visites: number | null;
    commandesRedis: number | null;
    commandesSQL: number;
}

function Statistiques() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [erreur, setErreur] = useState('');

    useEffect(() => {
        let annule = false;
        let minuterie: ReturnType<typeof setTimeout>;
        const controleur = new AbortController();

        async function charger() {
            try {
                const reponse = await fetch(`${API_URL}/api/stats`, {
                    signal: controleur.signal
                });

                if (!reponse.ok) {
                    throw new Error('Statistiques indisponibles');
                }

                const donnees: Stats = await reponse.json();

                if (!annule) {
                    setStats(donnees);
                    setErreur('');
                }
            } catch {
                if (!annule) {
                    setErreur('Impossible de charger les statistiques.');
                }
            } finally {
                if (!annule) {
                    minuterie = setTimeout(charger, 3000);
                }
            }
        }

        void charger();

        return () => {
            annule = true;
            controleur.abort();
            clearTimeout(minuterie);
        };
    }, []);

    return (
        <section>
            <h2>Compteurs de commandes</h2>

            {erreur && <p role="alert">{erreur}</p>}

            {!stats && !erreur && <p>Chargement…</p>}

            {stats && !erreur && (
                <>
                    <p>
                        Redis : <strong>
                        {stats.commandesRedis ?? 'Indisponible'}
                    </strong>
                    </p>
                    <p>
                        PostgreSQL : <strong>{stats.commandesSQL}</strong>
                    </p>
                </>
            )}
        </section>
    );
}

export default Statistiques;