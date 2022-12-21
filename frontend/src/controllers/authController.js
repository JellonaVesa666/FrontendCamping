//---API URL---//
// import
import { API } from "../config"


//---Functions---//
// export
export const Register = (user) => {
  return fetch(`${API}/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(res => {
      return res.json()
    })
    .catch(error => {
      return error.json()
    })
}

export const Login = (user) => {
  return fetch(`${API}/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  
  })
    .then(res => {
      console.log(`Login: ${res}`);
      return res.json()
    })
    .catch(error => {
      console.log(`Error: ${error}`);
      return error.json()
    })
}

export const Authenticate = (data, next) => {
  if (typeof window !== "undefined") {  // Check if browser window is avaible since localStorage is property of browser window
    localStorage.setItem("jwt", JSON.stringify(data))    // Saves data passed by function data parameter to localStorage
    next();    // Proceed to next() defined by function parameters
  }
}

export const Logout = (next) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt")    // Removes jwt token from localStorage
    next();    // Proceeds to next function passed in parameters
    return fetch(`${API}/logout`, {    // Calls backend logout function
      method: "GET"
    })
      .then(res => {
        console.log(`Logout: ${res}`);
        return res.json()
      })
      .catch(error => {
        console.log(`Error: ${error}`);
        return error.json()
      })
  }
}

export const IsAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"))
  } else {
    return false;
  }
}