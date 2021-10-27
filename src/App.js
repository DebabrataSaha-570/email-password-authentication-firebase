import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import './App.css';
import InitializeAuthentication from "./Firebase/firebase.initialize";

InitializeAuthentication()
const googleProvider = new GoogleAuthProvider();

function App() {
  const handleGoogleSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(user)
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }
  const handleRegistration = (event) => {
    console.log('registration will be added')

    //form er default refresh behaiviour bondhor korar ninja techinic. 
    event.preventDefault()
  }
  return (
    <div className="App">
      <form onSubmit={handleRegistration}>
        <h3>Please Register</h3>
        <label htmlFor="email">Email: </label>
        <input type="text" name="email" />
        <br />
        <label htmlFor="password">Password: </label>
        <input type="text" name="password" />
        <br />
        <input type="submit" value="Register" />
      </form>
      <br /><br /><br />
      <br /><br /><br />
      <div>-----------------------</div>
      <button onClick={handleGoogleSignIn}>Google SignIn</button>
    </div>
  );
}

export default App;
