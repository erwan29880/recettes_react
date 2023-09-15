import { useState, useEffect } from "react"
import { Delete, Ok } from "./icons/Icons"
import { GetError, ErrorBoundary } from "./erreurs/Erreurs"
import {CreerRecette} from "./CreerRecette"


/**
 * Affichage des ingrédients selectionnés
 * @param {*} param states et setStates parent -> Ingredients
 * @returns une div avec les aliments pour la recette, avec quantités et unités
 */
function IngredientsSelectionnes ({ing, setIng, recette, setRecette}) {

    const handleRecette = () => {
        if (recette) setRecette(false)
    }

    const handleRemoveItem = (item) => {
        setIng(ing.filter(el => el.ingredient !== item))
    }


    return ing.length > 0 ? (
        <div>
            <h3>Ingrédients sélectionnés : </h3>
            
            {ing.map(el => {
                return ( 
                    <div key={`div-flex-sel-${el.ingredient}-${el.id}`} className="d-flex p-2 mb-3">
                        <div key={`ing-sel-${el.ingredient}-${el.id}`}>{el.ingredient} : {el.quantite} {el.unite}</div>
                        <button className="btn btn-danger ms-3" key={`btn-sel-${el.ingredient}-${el.id}`} onClick={() => handleRemoveItem(el.ingredient)}><Delete /></button>
                    </div>
                )
            })}
            <button className="btn btn-primary" onClick={handleRecette}>Créer la recette</button>
        </div>
    ) :
    <div></div>
}


/**
 * Ajouter un aliment non enregistré en bdd pour la création de recette
 * n'enregistre pas l'aliment dans la bdd ; il sera présent uniquement dans la recette
 * @param {*} param states et setStates parent -> Ingredients 
 * @returns un formulaire
 */
function AjouterIngredient ({ingred, ing, qte, setIngred, setIng, setQte}) {
    
    const ajouterIngredient = (e) => {
        e.preventDefault()
        const ingredient = e.target[0].value 
        const quantite = e.target[1].value
        const unite = e.target[2].value
        
        if (ingredient !== "" && quantite !== "" && unite !== "") {
            const id = ingred.length + 1
            const dic = {...qte}
            const arr = [...ingred]
            const arr2 = [...ing]

            dic[id] = quantite
            arr.push({
                id: id, 
                ingredient: ingredient,
                unite: unite
            })
            arr2.push({
                ingredient: ingredient,
                quantite: quantite,
                unite: unite,
                id: id
            })
            setIngred(arr)
            setQte(dic)
            setIng(arr2)

        }
        e.target[0].value = ""
        e.target[1].value = ""
        e.target[2].value = ""
    }

    return (
        <form onSubmit={ajouterIngredient} className="d-flex p-2 mb-3">
            <input type="text" className="col-3 rounded" placeholder="ajouter un ingrédient" />
            <input type="text" className="col-2 text-center ms-2 rounded" name="qte" placeholder="quantité"/>
            <input type="text" className="col-1 text-center ms-2 rounded" placeholder="unité" />
            <button type="submit" className="btn btn-primary ms-3"><Ok /></button>
        </form>
    )
}


/**
 * Liste les ingrédients de la bdd
 * permet de rentrer une quantité
 * permet d'ajouter un des éléments bdd à la recette
 * @param {*} param  states et setStates parent -> Ingredients 
 * @returns des divs avec les ingrédients de la bdd
 */
function ListeIngredients ({qte, ingred, ing, setQte, setIng}) {

    const handleSubmit = (id, ingredient, unite) => {
        if (qte[id] === undefined){
            return;
        }
        const arr = [...ing]
        arr.push({
            ingredient: ingredient,
            quantite: qte[id],
            unite: unite, 
            id: id
        })
        setIng(arr)   
    }

    const handleQte = (e, id) => {
        e.preventDefault()
        const dic = {...qte}
        dic[id] = e.target.value
        setQte(dic)
    }

    return (
        ingred.map((el, inc) => {
            return (
                    <div className="d-flex p-2 mb-3" key={`div-${el.id}-${inc}`}>
                        <input type="text" className="col-3 rounded" defaultValue={el.ingredient} />
                        <input type="text" className="col-2 text-center ms-2 rounded" name="qte" onChange={(e) => handleQte(e, el.id)} value={qte.hasOwnProperty(el.id) ? qte[el.id] : ""} placeholder="quantité"/>
                        <input type="text" className="col-1 text-center ms-2 rounded" defaultValue={el.unite} />
                        <button onClick={() => handleSubmit(el.id, el.ingredient, el.unite)} type="submit" className="btn btn-primary ms-3"><Ok /></button>
                    </div>
            )
    })
    )
}


/**
 * importe les données initiales en bdd
 * enregistre un recette en bdd
 * @returns une page avec la liste des ingrédients ou la création de la recette
 */
function Ingredients () {
    
    const [ingred, setIngred] = useState([])
    const [qte, setQte] = useState({})
    const [ing, setIng] = useState([])
    const [recette, setRecette] = useState(true)
    const [err, setErr] = useState(0)
    
    // ajax
    const fetchData = async () => {
        await fetch("http://localhost:3001/mysqlGetIngredients")
          .then(response => response.json())
          .then(data => {
            setIngred(data)
        })
    }

    // import intial des données
    useEffect(() => {
        fetchData()
    }, [])

    // changer de vue : liste des ingrédients / création de la recette (false)
    const handleRecette = (e) => {
        setRecette(true)
    }

 
    return recette ? (
        <div>
            <ErrorBoundary>
                <h1>Composez votre recette !</h1>
                <AjouterIngredient ingred={ingred} ing={ing} qte={qte} setIngred={setIngred} setIng={setIng} setQte={setQte} />
                <ListeIngredients qte={qte} ingred={ingred} ing={ing} setQte={setQte} setIng={setIng} />
                <IngredientsSelectionnes ing={ing} setIng={setIng} recette={recette} setRecette={setRecette} />
            </ErrorBoundary>
        </div>
    ) :
    <div>
            <CreerRecette ingred={ingred} ing={ing} setIng={setIng} setRecette={setRecette} err={err} setErr={setErr} setQte={setQte} />
    </div>
}

export default Ingredients