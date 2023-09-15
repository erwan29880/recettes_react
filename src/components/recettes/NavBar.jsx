import { useState, useReducer } from "react"
import LoginForm from "./LoginForm"
import Ingredients from "./Ingredients"
import Recettes from "./Recettes"
import { ErrorBoundary } from "./erreurs/Erreurs"


function reducer (state, action) {
    switch(action.type) {
        case "recettes":
            return {
                page: <Recettes />,
                erreur: state.erreur,
                setErreur: state.setErreur
            }
        case "ingredients":
            return {
                page: <Ingredients />,
                erreur: state.erreur,
                setErreur: state.setErreur
            }
        case "connexion":
            return {
                page: <LoginForm erreur={state.erreur} setErreur={state.setErreur} />,
                erreur: state.erreur,
                setErreur: state.setErreur
            }
        default:
            return {
                page: <LoginForm erreur={state.erreur} setErreur={state.setErreur} />,
                erreur: state.erreur,
                setErreur: state.setErreur
            }
    }
}


/**
 * menu, page selectionnée
 * @param {*} param gestion des différentes pages de l'application 
 * @returns le menu et la page selectionnée
 */
function NavBar ({erreur, setErreur}) {

    const [state, dispatch ] = useReducer(reducer, {
        page: <LoginForm erreur={erreur} setErreur={setErreur} />, 
        erreur: erreur, 
        setErreur: setErreur})

    const handleDeconnexion = () => {
        setErreur(0)
        dispatch({type: "connexion"})
    }

    const resetConnexion = () => {
        setErreur(0)
        dispatch({type: "connexion"})
    }

    return erreur === 2 ? (
        <>
        <ErrorBoundary>
            <nav className="navbar navbar-expand-sm navbar-dark bg-primary mb-3">

                <a className="navbar-brand" href="#">recettes</a>

                <ul className="navbar-nav mr-auto">
                    <li className="nav-link" onClick={handleDeconnexion} role="button"><a href="#"></a>Deconnexion</li>  
                    <li className="nav-link" onClick={() => dispatch({type: "ingredients"})} role="button"><a href="#"></a>ingredients</li>
                    <li className="nav-link" onClick={() => dispatch({type: "recettes"})} role="button"><a href="#"></a>recettes</li>
                </ul>
            </nav>
                {state.page}
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
            {state.page}
    </ErrorBoundary>
    </>
}




export default NavBar