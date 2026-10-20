const articles = [
    {
        id: 1,
        categorie: 'Ordinateurs portables',
        titre: 'Bien choisir son ordinateur portable',
        description:
            'Un guide pour réfléchir à vos besoins avant de choisir votre prochain ordinateur.',
        source: 'Intel',
        url: 'https://www.intel.fr/content/www/fr/fr/education/intel4education/astuces-pour-choisir-le-bon-appareil.html'
    },
    {
        id: 2,
        categorie: 'Souris',
        titre: 'Trouver une souris adaptée à votre main',
        description:
            'Découvrez les conseils de Logitech pour choisir une souris adaptée à la taille de votre main.',
        source: 'Logitech',
        url: 'https://secure.logitech.com/fr-ca/discover/a/mouse-hand-size'
    },
    {
        id: 3,
        categorie: 'Espace de travail',
        titre: 'Aménager un bureau plus confortable',
        description:
            'Des conseils pour organiser votre espace de travail et positionner votre équipement.',
        source: 'Logitech',
        url: 'https://www.logitech.com/fr-ca/discover/a/ergonomic-workplace-setup'
    }
];

function ListePosts() {
    return (
        <div className="mt-6 space-y-5">
            {articles.map(article => (
                <article
                    key={article.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-cyan-500"
                >
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-cyan-700">
                        {article.categorie}
                    </p>

                    <h3 className="text-lg font-bold text-slate-900">
                        {article.titre}
                    </h3>

                    <p className="mt-2 text-sm text-slate-600">
                        {article.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs font-medium text-slate-500">
                            Source : {article.source}
                        </span>

                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
                            aria-label={`Lire le guide : ${article.titre} — nouvel onglet`}
                        >
                            Lire le guide ↗
                        </a>
                    </div>
                </article>
            ))}
        </div>
    );
}

export default ListePosts;