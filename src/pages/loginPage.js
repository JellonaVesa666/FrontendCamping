//---React---//
// import
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';


//---Bootstrap---//
// import
import { Button, Col, Form, Toast } from 'react-bootstrap';


//---Functions---//
// import
import { Login, Authenticate } from "../controllers/authController"


//---Page Component---//
// initialize
const LoginPage = () => {

  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false
  })

  const { email, password, error, loading } = values; // Deconstructs values Object from the hook

  const HandleChange = (event) => { // Receives event data from onChange={HandleChange}
    setValues({ ...values, error: false, [event.target.name]: event.target.value });
    //console.log(values);
  }

  const SubmitData = event => {
    
    event.preventDefault();
    

    // Enables ShowLoading()
    setValues({ ...values, error: false, loading: true })
    
    // Calls Login function from authController
    Login({ email, password })
      .then(data => {
        console.log(data)
        if (data.error) {
          console.log(data.error)
          setValues({ ...values, error: data.error, loading: false })   // Enables ShowError()
        } else {
          console.log(data.user)
          Authenticate(data, () => {  // Calls Authenticate function from authController
            RedirectUser()
          })
        }
      })
  }

  // Shows error message
  const ShowError = () => {
    if (error) {
      //console.log(`Error: ${error}`)
      return (
        <Toast>
          <Toast.Header>
            <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
            <strong className="me-auto">{error}</strong>
            <small>{error}</small>
          </Toast.Header>
          <Toast.Body>{error}</Toast.Body>
        </Toast>
      )
    }
  }

  // Shows loading message
  const ShowLoading = () => {
    if (loading) {
      //console.log(`Loading: ${loading}`)
      return (
        <Toast>
          <Toast.Header>
            <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
            <strong className="me-auto">Loading</strong>
            <small>Loading</small>
          </Toast.Header>
          <Toast.Body>Loading</Toast.Body>
        </Toast>
      )
    }
  }

  // Redirect user to home page
  const RedirectUser = () => {
    //console.log("Login successful")
    navigate("/adminhome");
  }

  return (
    <Form>
      <div style={{ marginTop: "40px", padding: "8px 0px 8px 0px" }}></div>
      {ShowError()}
      {ShowLoading()}
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        {/* Sents event data to HandleChange, name = event.target.name and onChange = event.target.value*/}
        <Form.Control type="email" name="email" placeholder="Enter email" value={email || ""} onChange={HandleChange} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        {/* Sents event data to HandleChange, name = event.target.name and onChange = event.target.value*/}
        <Form.Control type="password" name="password" placeholder="Password" value={password || ""} onChange={HandleChange} />
      </Form.Group>
      <Col style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Button className="text-center" variant="success" type="submit" onClick={SubmitData}>
          Submit
        </Button>
      </Col>
    </Form>
  )
}


//---Page Component---//
// export to App.js
export default LoginPage;