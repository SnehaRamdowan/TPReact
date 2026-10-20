import { useState } from 'react';

const etapes = [
    {
        id: 1,
        texte: 'Définir mon budget pour mon équipement.'
    },
    {
        id: 2,
        texte: 'Choisir un ordinateur adapté à mes besoins.'
    },
    {
        id: 3,
        texte: 'Choisir une souris confortable.'
    },
    {
        id: 4,
        texte: 'Vérifier la compatibilité du clavier et de la souris.'
    },
    {
        id: 5,
        texte: 'Consulter les prix et les stocks disponibles.'
    },
    {
        id: 6,
        texte: 'Choisir la quantité et passer ma commande.'
    }
];

function ListeTaches() {
    const [terminees, setTerminees] = useState<number[]>([]);

    function basculerEtape(id: number) {
        setTerminees(anciennes =>
            anciennes.includes(id)
                ? anciennes.filter(etapeId => etapeId !== id)
                : [...anciennes, id]
        );
    }

    return (
        <div className="mt-5">
            <p className="text-sm text-slate-600">
                Préparez votre achat avec cette checklist personnelle.
            </p>

            <p
                role="status"
                className="my-4 text-sm font-semibold text-cyan-700"
            >
                {terminees.length} / {etapes.length} étapes complétées
            </p>

            <ul className="space-y-3">
                {etapes.map(etape => {
                    const terminee = terminees.includes(etape.id);

                    return (
                        <li
                            key={etape.id}
                            className={
                                'rounded-xl border p-4 ' +
                                (terminee
                                    ? 'border-emerald-200 bg-emerald-50'
                                    : 'border-slate-200 bg-slate-50')
                            }
                        >
                            <label className="!mb-0 flex cursor-pointer items-start gap-3">
                                <input
                                    type="checkbox"
                                    checked={terminee}
                                    onChange={() => basculerEtape(etape.id)}
                                    className="mt-1 h-5 w-5 shrink-0"
                                />

                                <span
                                    className={
                                        terminee
                                            ? 'text-slate-500 line-through'
                                            : 'text-slate-800'
                                    }
                                >
                                    {etape.texte}
                                </span>
                            </label>
                        </li>
                    );
                })}
            </ul>

            <p className="mt-4 text-xs text-slate-500">
                Cette checklist se réinitialise au rechargement de la page.
                Cocher une étape ne passe aucune commande.
            </p>
        </div>
    );
}

export default ListeTaches;