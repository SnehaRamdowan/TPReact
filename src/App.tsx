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

function App() {
  const [recherche, setRecherche] = useState('');
  const [triCroissant, setTriCroissant] = useState(true);

  const technologiesFiltrees = technologies.filter((tech) =>
      tech.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  const technologiesTriees = [...technologiesFiltrees].sort((a, b) =>
      triCroissant
          ? a.nom.localeCompare(b.nom)
          : b.nom.localeCompare(a.nom)
  );

  const nbCartes = technologiesTriees.length;

  return (
      <main>
        <Header
            titre="TechTrends — Galerie des tendances"
            phrase="Les technologies qui font le cours 420-TT4"
        />

        <Recherche valeur={recherche} onChange={setRecherche} />

        <button onClick={() => setTriCroissant(!triCroissant)}>
          Trier ({triCroissant ? 'A → Z' : 'Z → A'})
        </button>

        <p>{nbCartes} technologie(s) affichée(s)</p>

        <section>
          {technologiesTriees.map((tech) => (
              <CarteTechnologie key={tech.id} tech={tech} />
          ))}
        </section>

        <Video
            video={{
              id: 1,
              titre: 'Introduction à React',
              dureeEnSecondes: 210
            }}
        />

        <Video
            video={{
              id: 2,
              titre: 'Comprendre les props',
              dureeEnSecondes: 125
            }}
        />

        <section>
          <h2>Derniers articles</h2>
          <ListePosts />
        </section>

        <section>
          <h2>Liste des tâches</h2>
          <ListeTaches />
        </section>

        <section>
          <h2>Produits de mon API</h2>
          <ListeProduits />
        </section>

        <section>
          <h2>Ajouter une technologie</h2>
          <AjouterTechnologie />
        </section>
      </main>
  );
}

export default App;