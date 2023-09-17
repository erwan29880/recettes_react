import { useState, useEffect } from "react"
import LoginForm from "./LoginForm"
import Ingredients from "./Ingredients"
import Recettes from "./Recettes"
import { ErrorBoundary } from "./erreurs/Erreurs"


/**
 * menu, page selectionnée
 * @param {*} param gestion des différentes pages de l'application 
 * @returns le menu et la page selectionnée
 */
function NavBar () {

    // erreur -> non connecté, user, admin 1, 2, 3
    // state -> la page à afficher
    const [erreur, setErreur] = useState(0)
    const [state, setState] = useState(<LoginForm erreur={erreur} setErreur={setErreur} />)
 
    // page de déconnexion
    const handleDeconnexion = () => {
        setErreur(0)
        setState(() => {
            return (
                <div className="alert alert-success">Vous avez été déconnecté !</div>
            )
        })
    }

    // changement de page
    const dispatch = (type) => {
        switch(type) {
            case "recettes":
               setState(<Recettes erreur={erreur} />)
               break;
            case "ingredients":
                setState(<Ingredients erreur={erreur} />)
                break;
            case "connexion":
                setErreur(0)
                setState(<LoginForm erreur={erreur} setErreur={setErreur} />)
                break
            default:
                setState(<LoginForm erreur={erreur} setErreur={setErreur} />)
        }
    }

    const resetConnexion = () => {
        setErreur(0)
        dispatch("connexion")
    }

    // changement d'affichage si connecté ou non
    return erreur >= 2 ? (
        <>
        <ErrorBoundary>
            <nav className="navbar navbar-expand-sm navbar-dark bg-primary mb-3">

                <a className="navbar-brand" href="https://erwan-diato.com/ml/index.php">recettes</a>

                <ul className="navbar-nav mr-auto">
                    <li className="nav-link" onClick={handleDeconnexion} role="button"><a href="#"></a>Deconnexion</li>  
                    <li className="nav-link" onClick={() => dispatch("ingredients")} role="button"><a href="#"></a>ingredients</li>
                    <li className="nav-link" onClick={() => dispatch("recettes")} role="button"><a href="#"></a>recettes</li>
                </ul>
            </nav>
                {state}
        </ErrorBoundary>
        </>
    ) :
    <>
    <ErrorBoundary>
        <nav className="navbar navbar-expand-sm navbar-dark bg-primary mb-3">

            <a className="navbar-brand" href="#">recettes</a>

            <ul className="navbar-nav mr-auto">
                <li className="nav-link" onClick={() => resetConnexion()} role="button"><a href="#"></a>Connexion</li> 
            </ul>
        </nav>
            {state}
    </ErrorBoundary>
    </>
}


export default NavBar