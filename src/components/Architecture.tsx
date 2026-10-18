function Architecture() {
    return (
        <section>
            <h2>Comment fonctionne notre application ?</h2>

            <div className="architecture">
                <div className="architecture-bloc">
                    <h3>React</h3>
                    <p>Affiche la page et envoie les demandes.</p>
                </div>

                <div className="architecture-fleche">↕</div>

                <div className="architecture-bloc">
                    <h3>Express</h3>
                    <p>Reçoit les demandes et renvoie les réponses.</p>
                </div>

                <div className="architecture-donnees">
                    <div>
                        <div className="architecture-fleche">↕</div>
                        <div className="architecture-bloc">
                            <h3>PostgreSQL</h3>
                            <p>Stocke les produits.</p>
                        </div>
                    </div>

                    <div>
                        <div className="architecture-fleche">↕</div>
                        <div className="architecture-bloc">
                            <h3>Redis</h3>
                            <p>Cache les produits et compte les visites.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Architecture;