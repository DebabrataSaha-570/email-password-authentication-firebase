import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import './App.css';
import InitializeAuthentication from "./Firebase/firebase.initialize";

InitializeAuthentication()
const googleProvider = new GoogleAuthProvider();

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [error, setError] = useState('');

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
    //form er default refresh behaiviour bondhor korar ninja techinic. 
    event.preventDefault()
    console.log(email, password)
    if (password.length < 6) {
      setError('password must be at least 6 character long ')
      return;
    }
    if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      setError('password must contain two upper case')
      return;
    }
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user)
        setError('')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage)
        console.log(errorCode, errorMessage)
        // ..
      });

  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }
  return (
    <div className="text-center container">

      <form onSubmit={handleRegistration} className=" my-5">
        <h3 className="text-primary">Please Register</h3>
        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input onBlur={handleEmailChange} type="email" className="form-control" id="inputEmail3" required />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
          <div className="col-sm-10">
            <input onBlur={handlePasswordChange} type="password" className="form-control" id="inputPassword3" required />
          </div>
        </div>
        <div className="text-danger">
          {error}
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>


      {/* regular form  */}
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
