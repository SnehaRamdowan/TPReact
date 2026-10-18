import { useEffect, useState } from 'react';
import { API_URL } from '../config';

function CompteurVisites() {
    const [total, setTotal] = useState<number | null>(null);
    const [erreur, setErreur] = useState('');

    useEffect(() => {
        let annule = false;

        async function charger() {
            try {
                const reponse = await fetch(`${API_URL}/api/visites`);


                if (!reponse.ok) {
                    throw new Error('Compteur indisponible');
                }

                const donnees = await reponse.json();

                if (!annule) {
                    setTotal(donnees.total);
                    setErreur('');
                }
            } catch {
                if (!annule) {
                    setErreur('Impossible de charger le compteur');
                }
            }
        }

        charger();

        const intervalle = setInterval(charger, 3000);

        return () => {
            annule = true;
            clearInterval(intervalle);
        };
    }, []);

    return (
        <section>
            <h2>Nombre de visites</h2>
            {erreur ? (
                <p role="alert">{erreur}</p>
            ) : (
                <p style={{ fontSize: '48px', fontWeight: 'bold' }}>
                    {total ?? 'Chargement…'}
                </p>
            )}
        </section>
    );
}

export default CompteurVisites;