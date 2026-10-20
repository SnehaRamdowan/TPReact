import { useEffect, useState } from 'react';
import { API_URL } from '../config';

function CompteurVisites() {
    const [total, setTotal] = useState<number | null>(null);
    const [erreur, setErreur] = useState('');

    useEffect(() => {
        let annule = false;
        let minuterie: ReturnType<typeof setTimeout> | undefined;
        const controleur = new AbortController();

        async function charger() {
            try {
                const reponse = await fetch(`${API_URL}/api/visites`, {
                    signal: controleur.signal,
                    cache: 'no-store'
                });

                if (!reponse.ok) {
                    throw new Error('Compteur indisponible');
                }

                const donnees = await reponse.json();

                if (
                    typeof donnees.total !== 'number' ||
                    !Number.isFinite(donnees.total)
                ) {
                    throw new Error('Réponse du compteur invalide');
                }

                if (!annule) {
                    setTotal(donnees.total);
                    setErreur('');
                }
            } catch {
                if (!annule) {
                    setTotal(null);
                    setErreur('Compteur temporairement indisponible.');
                }
            } finally {
                if (!annule) {
                    minuterie = setTimeout(() => {
                        void charger();
                    }, 3000);
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
            <h2>Nombre de visites</h2>

            <div role="status" aria-live="polite">
                {erreur ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                        <p className="font-semibold">{erreur}</p>

                        <p className="mb-0 text-sm">
                            Ce compteur dépend de Redis.
                            Nouvelle tentative automatique toutes les
                            3 secondes.
                        </p>
                    </div>
                ) : (
                    <p className="text-5xl font-bold text-cyan-700">
                        {total ?? 'Chargement…'}
                    </p>
                )}
            </div>

            <p className="mt-3 text-sm text-slate-500">
                Nombre de chargements de la page.
            </p>
        </section>
    );
}

export default CompteurVisites;