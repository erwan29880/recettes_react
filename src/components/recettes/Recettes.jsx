import { useState, useEffect } from "react"
import { Delete } from "./icons/Icons"
import { ErrorBoundary } from "./erreurs/Erreurs"
import {URL} from './Urls.jsx'

/**
 * problèmes des caractères html échappés du textarea
 * @param {String} str 
 * @returns String
 */
function specialsChars (str) {
    str = str.replace(/(&#39;)/g,"'")
    str = str.replace(/(&quot;)/g,'"')
    str = str.replace(/(&gt;)/g,">")
    return str.replace(/(&lt;)/g,"<")
}

/**
 * Les ingrédients proviennent de la bdd en une chaîne de caractères
 * avec sauts de lignes \n
 * @param {*} params les ingrédients de la recette, l'id pour la key   
 * @returns une liste avec les ingredients, qantité et unité mises en forme
 */
function ListeIngredients ({allIng, id}) {

    return (
        <ul key={`ul${id}`} className="list-group list-group-flush mt-3">
            
            {allIng.split("\n").map((ligne, increment) => {
                return (
                    <li className="list-group-item" key={`sousligne${id}-${increment}`}>
                        <b>{ligne.split(":")[0]}</b> : {ligne.split(":")[1]} 
                    </li>
                )    
            })}

        </ul>
    )
}


/**
 * les commentaires viennent de la bdd en une chaîne de caractère, avec sauts de lignes \n
 * cette chaîne est splitée se lon \n pour mise en forme
 * @param {*} params commentaire : une chaîne de caractère, l'id pour les keys 
 * @returns une div avec les commentaires mis en formes
 */
function Commentaires ({commentaire, id}) {
    return (
        <div className="row border rounded mt-2 ms-3 me-3" key={`ligne${id}-2`}>
            {commentaire.split("\n").map((e, i) => {
                return (
                    <div className="mb-1" key={`comment${id}-${i}`}>{specialsChars(e)}</div>
                )
            })}</div>

    )
}


/**
 * Le titre de la recette
 * un onclick permet de cacher/afficher la recette ; l'id de l'élement est dans la fonction Recette
 * @param {*} params le titre de la recette, l'id du map, l'id de la recette dans la bdd
 * @returns une div avec le titre
 */
function Title ({titre, idListe, id}) {

    const handleClick = (id) => {
        const el = document.querySelector("#divNone"+id.toString())
        el.className = el.className === "d-none" ? "d-block" : "d-none"
    }

    return (
        <div key={`ligne${id}0`} role="button">
            <div className="alert alert-primary h5 mb-3" key={`ligne${idListe}-0`} onClick={() => handleClick(id)}>{titre}</div>
        </div>
    )
}


/**
 * affiche les résultats de la bdd
 * supprimer une recette
 * mise en page des recettes
 * @returns les Recettes
 */
function Recettes ({erreur}) {
    const [recettes, setRecettes] = useState([])

    // récupérer les données en ajax
    const fetchData = async () => {
        await fetch(URL + "mysqlGetRecettes")
          .then(response => response.json())
          .then(data => {
            setRecettes(data)
        })
    }

    // récupérer les données initiales
    useEffect(() => {
        fetchData()
    }, [])


    // supprimer une recette
    const supprEntry = async (id) => {
        await fetch(URL + "mysqlSupprRecettes/"+id, {
            method : "DELETE"
            }).then(() => fetchData())
    }

    
    return (
        <div className="mt-5">
            <ErrorBoundary>
                {recettes.map((el, id) => {
                    return (
                        <div className="mb-5" key={`div${id}`}>

                            <Title titre={el.titre} idListe={id} id={el.id} />
                            
                            <div id={"divNone" + el.id}  key={`${id}1`} className="d-none">

                                <ListeIngredients allIng={el.ingredients} id={id}/>
                                
                                <Commentaires commentaire={el.commentaire} id={id} />
                                
                                {/* supprimer uniquement si l'utilisateur est admin */}
                                {erreur === 3 ? (
                                <button key={`button${id}`} onClick={() => supprEntry(el.id)} disabled className="btn btn-danger mt-2 ms-3"><Delete /></button>) :
                                (<button key={`button${id}`} onClick={() => supprEntry(el.id)} className="btn btn-danger mt-2 ms-3"><Delete /></button>)
                                }
                            </div>

                        </div>
                    )       
                })}
            </ErrorBoundary>
        </div>
    )
}

export default Recettes