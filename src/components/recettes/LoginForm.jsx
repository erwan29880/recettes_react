import { useState } from "react"
import { ErrorBoundary } from "./erreurs/Erreurs"

const persoAlert = {
    0: ["alert alert-warning", "veuillez-vous identifier"],
    1: ["alert alert-danger", "Echec de l'authentification"],
    2: ["alert alert-success !", "Vous êtes authentifié !"]
}


/**
 * 
 * @param {*} param gestion du formulaire de connexion
 * @returns 
 */
function LoginForm ({erreur, setErreur}) {

    const [pseudo, setPseudo] = useState("")
    const [pwd, setPwd] = useState("")
    const [info, setInfo] = useState(persoAlert[erreur])

    const tooglePseudo = (e) => setPseudo(e.target.value)
    const tooglePwd = (e) => setPwd(e.target.value)


    const handleSubmit = async () => {
        await fetch("http://localhost:3001/check", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                pseudo: pseudo,
                pwd: pwd
            })
            })
            .then(res => res.json())
            .then(res => {
                setPseudo("")
                setPwd("")
                setErreur(parseInt(res.erreur))
                setInfo(persoAlert[parseInt(res.erreur)])
        })
    }

    return (

        <div>
            <ErrorBoundary>
                <div className={info[0]} role='alert'>{info[1]}</div>
                <div className='container mt-4'>
                    <div className="form-group mb-3">
                        <input type="text" placeholder="pseudo : pseudo, pwd : pwd" className="form-control" name="pseudo" value={pseudo} onChange={tooglePseudo}/>
                    </div>
                    <div className="form-group mb-3">
                        <input type="password" placeholder="mot de passe" className="form-control" name="pwd" value={pwd} autoComplete='false' onChange={tooglePwd} />
                    </div>
                    <div>
                        <button type="submit" className='btn btn-primary' onClick={handleSubmit} >vérifier les informations</button>
                    </div>
                </div>
            </ErrorBoundary>
        </div>
    )
}



export default LoginForm