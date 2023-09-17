import { useState, useEffect } from "react"
import { ErrorBoundary } from "./erreurs/Erreurs"
import {URL} from './Urls'

const persoAlert = {
    0: ["alert alert-warning", "veuillez-vous identifier"],
    1: ["alert alert-danger", "Echec de l'authentification"],
    2: ["alert alert-success !", "Vous êtes authentifié en tant qu'administrateur !"],
    3: ["alert alert-success !", "Vous êtes authentifié en tant qu'utilisateur, vous ne pouvez pas créer de recettes ni en supprimer !"]
}


/**
 * 
 * @param {*} param gestion du formulaire de connexion
 * @returns 
 */
function LoginForm ({erreur, setErreur}) {

    const [info, setInfo] = useState(persoAlert[erreur])

    // validation formulaire et vérification utilisateur serveur
    const handleSubmit = async (e) => {
        e.preventDefault() 
        await fetch(URL + "check", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                pseudo: e.target[0].value,
                pwd: e.target[1].value
            })
            })
            .then(res => res.json())
            .then(res => {
                const erro = parseInt(res.erreur)
                setInfo(persoAlert[erro])
                setErreur(erro)
            })
    }

    return (
        <div>
            <ErrorBoundary>
                <div className={info[0]} role='alert'>{info[1]}</div>
                <div className='container mt-4'>
                    <p>Pour se connecter en tant qu'utilisateur, rentrez le pseudo <i>pseudo</i> et le mot de passe <i>pwd</i> .</p>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="pseudo">Pseudo : </label>
                            <input type="text" placeholder="pseudo : pseudo, pwd : pwd" className="form-control" name="pseudo" />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="pwd">Mot de passe : </label>
                            <input type="password" placeholder="mot de passe" className="form-control" name="pwd" autoComplete='false' />
                        </div>
                        <div>
                            <button type="submit" className='btn btn-primary' >vérifier les informations</button>
                        </div>
                    </form>
                </div>
            </ErrorBoundary>
        </div>
    )
}


export default LoginForm