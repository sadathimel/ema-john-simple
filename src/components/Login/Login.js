import React, { useReducer, useState } from "react";

import { UserContext } from "../../App";
import { useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { createUserWithEmailAndPassword, handleFbSignIn, handleGoogleSignIn, handleSigOut, initializeLoginFramework, resetPassword, signInWithEmailAndPassword } from "./LoginManager";

function Login() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignIn: false,
    name: "",
    email: "",
    password: "",
    photo: "",
  });

  initializeLoginFramework();
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  const googleSignIn = () => {
    handleGoogleSignIn()
    .then(res => {
      handleResponse(res, true)
    })
  }

  const signOut = () => {
    handleSigOut()
    .then(res=>{
      handleResponse(res, false)
    })
  }

  const fbSignIn = () => {
    handleFbSignIn()
    .then(res => {
      handleResponse(res, true)
    })
  }

  const handleResponse = (res, redirect)=>{
    setUser(res);
    setLoggedInUser(res);
    if(redirect){
      history.replace(from);
    }
  }
  const handleBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === "email") {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === "password") {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  };

  const handleSubmit = (e) => {
    // console.log(user.email, user.password)
    if (newUser && user.email && user.password) {
      createUserWithEmailAndPassword(user.name, user.email, user.password)
      .then (res => {
        handleResponse(res, true)
      })
    }

    if (!newUser && user.email && user.password) {
      signInWithEmailAndPassword(user.email, user.password)
      .then(res=>{
        handleResponse(res, true)
      })
    }

    e.preventDefault();
  };

  return (
    <div style={{ textAlign: "center" }}>
      {user.isSignIn ? (
        <button onClick={signOut}>Sign Out</button>
      ) : (
        <button onClick={googleSignIn}>Sign in</button>
      )}
      <br />
      {<button onClick={fbSignIn}>Sign in using Facebook</button>}

      {user.isSignIn && (
        <div>
          <p>Welcome, {user.name}</p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      )}

      <h1>Our own Authentication</h1>
      <input
        type="checkbox"
        onChange={() => setNewUser(!newUser)}
        name=""
        id=""
      />
      <label htmlFor="newUser">New User Sign up</label>
      <form onSubmit={handleSubmit}>
        {newUser && (
          <input
            type="text"
            name="name"
            id=""
            onBlur={handleBlur}
            placeholder="Your name"
          />
        )}
        <br />
        <input
          type="text"
          onBlur={handleBlur}
          name="email"
          id=""
          placeholder="Your email address"
          required
        />
        <br />
        <input
          type="password"
          onBlur={handleBlur}
          name="password"
          id=""
          placeholder="Your password"
          required
        />
        <br />
        <input type="submit" value={newUser ? "Sign up" : "Sign in"} />
      </form>
      <button onClick={()=>resetPassword(user.email)}>Forget or Reset Password</button>
      <p style={{ color: "red" }}>{user.error}</p>
      {user.success && (
        <p style={{ color: "green" }}>
          User {newUser ? "created" : "Logged in"} successfully
        </p>
      )}
    </div>
  );
}

export default Login;
