import { useState } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.css'
import NavBar from './recettes/NavBar';

function App() {

  // si l'utilisateur est connecté ou non, vor LoginForm
  // cela évite les cookies, mais n'est pas une solution en prod
  // cette application est une démo
  const [erreur, setErreur] = useState(0)

  return (
    <div className="container-sm">
      <NavBar erreur={erreur}  setErreur={setErreur} />
    </div>

  )
}

export default App;
