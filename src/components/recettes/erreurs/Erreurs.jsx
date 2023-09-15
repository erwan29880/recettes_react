import { Component } from "react";


/**
 * capture d'erreur sur composants parents
 */
export class ErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    componentDidCatch(error, info) {
      this.setState({ hasError: true });
    }
  
    render() {
      if (this.state.hasError) {
        return <h1>Quelque chose s'est mal passé.</h1>;
      }
      return this.props.children;
    }
  }


/**
 * affichage utilisateur pour entrée d'une recette en bdd
 * @param {*} param int 
 * @returns une div avec un message
 */
export function GetError ({err}) {
    switch(err) {
        case 0:
            return <div></div>
        case 1:
            return <div className="alert alert-danger">Il y a eu un problème avec l'enregistrement</div>
        case 2:
            return <div className="alert alert-success">La recette est créée, vous pouvez la voir sur la page recettes !</div>
        default:
            return <div></div>
    }
}