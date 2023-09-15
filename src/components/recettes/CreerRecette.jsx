import { useState } from "react"
import { GetError } from "./erreurs/Erreurs"

/**
 * composant du titre de la recette
 * @param {*} param 
 * @returns uen div avec le titre
 */
function CreerRecetteTitle ({setTitle}) {
    
    const handleTitle = (e) => {
        setTitle(e.target.value)
    }

    return (
        <div className="form-group">
            <label htmlFor="title">Titre de la recette :</label>
            <input type="text" className="form-control" onChange={handleTitle} />
        </div>
    )
}

/**
 * la liste des ingrédients mise en form
 * @param {*} param 
 * @returns des divs avec ingrédients, quantités et unités
 */
function CreerRecetteIngredients ({ing}) {

    return (
        ing.map(el => {
            return ( 
                <div key={`div2-flex-sel-${el.ingredient}-${el.id}`} className="d-flex p-2 mb-1">
                    <div key={`ing2-sel-${el.ingredient}-${el.id}`}>{el.ingredient} : {el.quantite} {el.unite}</div>
                </div>
            )
        })
    )
}


/**
 * textArea pour décrire la recette
 * @param {*} param le textarea
 * @returns un formulaire
 */
function CreerRecetteForm ({textArea, setTextArea, creerRecette}) {
    
    const handleChange = (e) => {
        setTextArea(e.target.input)
    }

    return (
        <form onSubmit={creerRecette}>
            <div className="form-group mb-3">
                <textarea className="form-control" name="txt" onChange={handleChange} rows="10"></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Enregistrer la recette</button>
        </form>
    ) 
}


export function CreerRecette ({ing, setIng, setRecette, err, setErr, setQte}) {

    const [textArea, setTextArea] = useState("")
    const [title, setTitle] = useState("")

    // ré-initialisation des states et formulaires
    // setErr(0), setIng, setQte => voir dans le fichier Ingredients.jsx, function Ingredients
    const reinit = () => {
        setErr(0)
        setTextArea("")
        setTitle("")
        setIng([])
        setQte({})
    }

    // afficher la liste des ingrédients (true) ou la création de recette
    // voir fichier Ingredient function Ingredient
    // ré-initialiser les formaulaires
    const handleRecette = (e) => {
        setRecette(true)
        reinit()
    }

    // mise en forme des ingrédients en chaine de caractère pour entrée bdd
    const mefIngredients = () => {
        let myIngredients = ""
        
        // parcourir la liste des ingrédients
        ing.forEach(el => {
            myIngredients += el.ingredient + " : " + el.quantite + " " + el.unite + "\n"
        });

        // enlever le \n de la fin de chaîne
        return myIngredients.slice(0, myIngredients.length -2 )
    }

    // ajax entrée en bdd
    const entreeBdd = async (data) => {
        await fetch("http://localhost:3001/mysqlSaveRecette", {
            method : "post",
            body : JSON.stringify(data),
            headers: {'Content-Type': 'application/json;charset=utf-8'}
        }).then(res => {
            if (res.status === 201) {
                setErr(2)
            } else {
                setErr(1)
            }
        })
    }

    // vérifications données et entrée en bdd
    const creerRecette = async (e) => {
        e.preventDefault()
        if (e.target[0].value === "") return;
        if (title === "") return;
        if (title.length > 100) setTitle(title.slice(0, 98))
        
        entreeBdd({
            titre : title,
            ingredients: mefIngredients(),
            commentaire: e.target[0].value
        })
        
    }

   
    return (
        <div>
            <GetError err={err}/>
            <button onClick={handleRecette} className="btn btn-primary mb-4">Retour à la liste des ingrédients</button>
            <CreerRecetteTitle setTitle={setTitle} />
            <CreerRecetteIngredients ing={ing}/>
            <CreerRecetteForm textArea={textArea} setTextArea={setTextArea} creerRecette={creerRecette} />
        </div>
    )
}

