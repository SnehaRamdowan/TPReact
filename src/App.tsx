import { useState } from 'react';
import Header from './components/Header';
import CarteTechnologie from './components/CarteTechnologie';
import { technologies } from './data/technologies';
import Video from './components/video';
import Recherche from './components/Recherche';
import ListePosts from './components/ListePosts';
import ListeTaches from './components/ListeTaches';
import ListeProduits from './components/ListeProduits';
import AjouterTechnologie from './components/AjouterTechnologie';
import CompteurVisites from './components/CompteurVisites';
import Architecture from './components/Architecture';
import Statistiques from './components/Statistiques';

function App() {
    const [recherche, setRecherche] = useState('');
    const [triCroissant, setTriCroissant] = useState(true);

    const technologiesFiltrees = technologies.filter(tech =>
        tech.nom.toLowerCase().includes(recherche.toLowerCase())
    );

    const technologiesTriees = [...technologiesFiltrees].sort((a, b) =>
        triCroissant
            ? a.nom.localeCompare(b.nom)
            : b.nom.localeCompare(a.nom)
    );

    return (
        <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-slate-900 px-6 py-10 text-white shadow-lg sm:px-10">
                <p className="mb-3 text-sm font-bold uppercase tracking-widest text-cyan-300">
                    Explorer · Apprendre · Commander
                </p>

                <Header
                    titre="TechTrends — Galerie des tendances"
                    phrase="Les technologies qui font le cours 420-TT4"
                />

                <a
                    href="#boutique"
                    className="mt-6 inline-flex rounded-xl bg-cyan-300 px-5 py-3 font-bold text-slate-900 transition hover:bg-cyan-200"
                >
                    Découvrir la boutique
                </a>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="panel">
                    <CompteurVisites />
                </div>

                <div className="panel">
                    <Statistiques />
                </div>
            </div>

            <section className="panel">
                <div className="mb-6">
                    <p className="section-label">La galerie</p>
                    <h2>Explorez les technologies</h2>
                    <p className="text-slate-600">
                        Recherchez une technologie et découvrez ses caractéristiques.
                    </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0 flex-1">
                        <Recherche
                            valeur={recherche}
                            onChange={setRecherche}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => setTriCroissant(ancien => !ancien)}
                        className="shrink-0"
                    >
                        Trier ({triCroissant ? 'A → Z' : 'Z → A'})
                    </button>
                </div>

                <p className="my-5 text-sm font-medium text-slate-600">
                    {technologiesTriees.length} technologie(s) affichée(s)
                </p>

                <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {technologiesTriees.map(tech => (
                        <div
                            key={tech.id}
                            className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-5"
                        >
                            <CarteTechnologie tech={tech} />
                        </div>
                    ))}
                </div>

                {technologiesTriees.length === 0 && (
                    <p className="rounded-xl bg-slate-50 p-6 text-center text-slate-600">
                        Aucune technologie ne correspond à votre recherche.
                    </p>
                )}
            </section>

            <section id="boutique" className="panel scroll-mt-6">
                <p className="section-label">La boutique</p>
                <h2>Produits de mon API</h2>
                <p className="mb-6 text-slate-600">
                    Choisissez un produit et une quantité pour passer commande.
                </p>

                <div className="boutique">
                    <ListeProduits />
                </div>
            </section>

            <section className="panel">
                <p className="section-label">Apprendre</p>
                <h2>Les vidéos</h2>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 p-5">
                        <Video
                            video={{
                                id: 1,
                                titre: 'Introduction à React',
                                dureeEnSecondes: 210
                            }}
                        />
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-5">
                        <Video
                            video={{
                                id: 2,
                                titre: 'Comprendre les props',
                                dureeEnSecondes: 125
                            }}
                        />
                    </div>
                </div>
            </section>

            <div className="grid items-start gap-6 lg:grid-cols-2">
                <section className="panel">
                    <p className="section-label">Actualités</p>
                    <h2>Conseils et guides d’achat</h2>
                    <ListePosts />
                </section>

                <section className="panel">
                    <p className="section-label">Organisation</p>
                    <h2>Préparer mon achat</h2>
                    <ListeTaches />
                </section>
            </div>

            <section className="panel">
                <p className="section-label">Contribuer</p>
                <h2>Ajouter une technologie</h2>
                <AjouterTechnologie />
            </section>

            <div className="panel">
                <Architecture />
            </div>

            <footer className="pb-4 text-center text-sm text-slate-500">
                TechTrends · Projet React, Express, PostgreSQL et Redis
            </footer>
        </main>
    );
}

export default App;