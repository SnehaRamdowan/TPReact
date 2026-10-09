import { useState } from 'react';
import type { FormEvent } from 'react';

function AjouterTechnologie() {
    const [nom, setNom] = useState('');
    const [message, setMessage] = useState('');

    function soumettre(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setMessage('« ' + nom + ' » envoyé !');
        setNom('');
    }

    return (
        <form onSubmit={soumettre}>
            <input
                type="text"
                placeholder="Nom de la technologie"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
            />

            <button type="submit">Ajouter</button>

            <p>{message}</p>
        </form>
    );
}

export default AjouterTechnologie;