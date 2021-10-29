import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile, FacebookAuthProvider } from "firebase/auth";
import { useState } from "react";
import './App.css';
import InitializeAuthentication from "./Firebase/firebase.initialize";

InitializeAuthentication()
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [error, setError] = useState('');
  const [isLoggedIn, setLoggedIn] = useState(false)

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
  const handleFacebookSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, facebookProvider)
      .then((result) => {
        const user = result.user;
        console.log(user)
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = FacebookAuthProvider.credentialFromError(error);
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
    isLoggedIn ? processLogin(email, password) : createNewUser(email, password)
  }

  const processLogin = (email, password) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user)
        setError('')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }
  const createNewUser = (email, password) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user)
        setError('')
        verifyEmail()
        setUserName();
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
  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  const toggleLogIn = (e) => {
    setLoggedIn(e.target.checked)
  }
  const verifyEmail = () => {
    const auth = getAuth();
    sendEmailVerification(auth.currentUser)
      .then((result) => {
        console.log(result)
      });
  }
  const setUserName = () => {
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName: name,
    }).then(() => {
      // Profile updated!
      // ...
    }).catch((error) => {
      // An error occurred
      // ...
    });
  }

  const handleResetPassword = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert('Reset Email Sent. Check your email')
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
        // ..
      });

  }
  return (
    <div className=" container">

      <form onSubmit={handleRegistration} className=" my-5">
        <h3 className="text-primary">Please {isLoggedIn ? 'Log in' : 'Register'}</h3>

        {!isLoggedIn && <div className="row mb-3">
          <label htmlFor="inputName" className="col-sm-2 col-form-label">Name: </label>
          <div className="col-sm-10">
            <input onBlur={handleNameChange} type="text" class="form-control" id="inputName" placeholder="Your Name" />
          </div>
        </div>}



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
          <div class="row mb-3">
            <div class="col-sm-10 offset-sm-2">
              <div class="form-check">
                <input onChange={toggleLogIn} class="form-check-input" type="checkbox" id="gridCheck1" />
                <label class="form-check-label" for="gridCheck1">
                  Already Registered?
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="text-danger">
          {error}
        </div>
        <button type="submit" className="btn btn-primary">
          {isLoggedIn ? 'Login' : 'Register'}
        </button>
        <br />
        <button onClick={handleResetPassword} type="button" class="btn btn-primary btn-sm mt-2">Reset Password</button>
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
      <button class="btn btn-success" onClick={handleGoogleSignIn}>Google SignIn</button>
      <button onClick={handleFacebookSignIn} class="btn btn-danger mx-1">Facebook SignIn</button>
    </div>
  );
}

export default App;
