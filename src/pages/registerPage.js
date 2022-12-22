//---React---//
// import
import React, { useEffect, useState } from "react";


//---Bootstrap---//
// import
import { Button, Col, Row, Form, Toast } from 'react-bootstrap';


//---Functions---//
// import
import { Register } from "../controllers/authController"


//---Page Component---//
// initialize
const RegisterPage = (props) => {

  const [values, setValues] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "",
    address: "",
    postalCode: "",
    city: "",
    bankAccNumber: "",

  });

  //Has to be let so that fullName formatting to first character to uppercase can be done.
  let { fullName, email, phoneNumber, password, confirmPassword, role, address, postalCode, city, bankAccNumber, error } = values; //Deconstruct values so they can be used outside the hook function

  const handleCancel = () => {
    setValues({
      ...values,
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      address: "",
      postalCode: "",
      city: "",
      bankAccNumber: "",
      phoneNumber: "",
      error: false,
      success: true

    }),
      props.handleCancel();
  }

  const HandleChange = event => {
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  const SubmitData = event => {
    event.preventDefault();
    //If given passwords match and role have been chosen to user, try to create new user using data given in form inputs.
    if (passwordsMatch && role !== "" && fullName !== "" && phoneNumber !== "") {

      //Formatting fullName first letter to uppercase before creating user

      const containsWhitespace = /\s/.test(fullName) // Tests if fullName contains whitespaces.
      const regexPattern = /\s+/g;
      if (containsWhitespace) {
        fullName = fullName.replace(regexPattern, ' '); //Replaces possible extra whitespaces with only one whitespace.
        let namesSplitted = fullName.split(' '); //Splits fullName to array by whitespace.
        let formattedNames = [];

        namesSplitted.map(item => {
          let nameSplitted = item.split(''); //Split array item to new array by letter.
          if (nameSplitted[0] !== undefined) {
            nameSplitted[0] = nameSplitted[0].toUpperCase();  //Replace array item first letter with Uppercase letter
          }
          nameSplitted = nameSplitted.join(''); //Join array of letters to string
          formattedNames.push(nameSplitted); //Push formatted item to formattedNames array.
        });
        fullName = formattedNames.join(' '); // Join names to one string with whitespaces.
      }
      else {
        let nameSplitted = fullName.split('');
        nameSplitted[0] = nameSplitted[0].toUpperCase();
        fullName = nameSplitted.join('');
      }

      Register({ fullName, role, email, phoneNumber, password, address, postalCode, city, bankAccNumber })
        .then(data => {
          if (data.error) {
            setValues({ ...values, success: false, error: data.error })
            setShowErrorToast(true);
            setShowToast(false)
          }
          else {
            setValues({
              ...values,
              fullName: "",
              email: "",
              password: "",
              confirmPassword: "",
              role: "",
              address: "",
              postalCode: "",
              city: "",
              bankAccNumber: "",
              phoneNumber: "",
              error: false,
              success: true
            })
            props.forceUpdate();
            setShowToast(true)
            setShowErrorToast(false)
          }
        })
    }
    //ERROR HANDLING
    else if (!passwordsMatch) {
      setValues({ ...values, success: false, error: "Given passwords do not match!" })
      setShowErrorToast(true);
      setShowToast(false)
    }
    else if (role === "") {
      setValues({ ...values, success: false, error: "You must select a role for user!" })
      setShowErrorToast(true);
      setShowToast(false)
    }
    else if (fullName === "") {
      setValues({ ...values, success: false, error: "You must fill the name field!" })
      setShowErrorToast(true);
      setShowToast(false)
    }
    else if (phoneNumber === "") {
      setValues({ ...values, success: false, error: "You must fill the phone number field!" })
      setShowErrorToast(true); 
      setShowToast(false)
    }
  }

  const ShowError = () => (
    <Toast style={{ zIndex: "5", position: "fixed", width: "70%", marginLeft: "15%" }} onClose={() => setShowErrorToast(false)} show={showErrorToast}>
      <Toast.Header>
        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
        <strong className="me-auto">{error}</strong>
        <small>{error}</small>
      </Toast.Header>
      <Toast.Body>{error}</Toast.Body>
    </Toast>
  );

  const [showToast, setShowToast] = useState(false)

  const [showErrorToast, setShowErrorToast] = useState(false)

  const ShowSuccess = () => (
    <Toast style={{ zIndex: "5", position: "fixed", width: "70%", marginLeft: "15%" }} onClose={() => setShowToast(false)} show={showToast}>
      <Toast.Header>
        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
        <strong className="me-auto">User Created</strong>
      </Toast.Header>
    </Toast>
  );

  //CONFIRMING PASSWORD MATCH

  const [passwordsMatch, setPasswordsMatch] = useState(true); // if false, error message will be shown under confirm password input.

  //Checks if password and confirmPassword match everytime either of the values update. Then sets passwordsMatch value accordingly.
  //Without useEffect values would update with delay and confirmPassword would be 1 letter short of what it should actually be.
  useEffect(() => {
    password == confirmPassword ? setPasswordsMatch(true) : setPasswordsMatch(false)
  }, [confirmPassword, password])


  return (
    <div className="formContainer" style={{ padding: "5vw" }}>
      {ShowError()}
      {ShowSuccess()}
      <Form>
        {/*FULL NAME*/}
        <Form.Group className="mb-3" controlId="formBasicName" props>
          <Form.Label style={{ color: "white" }}>Name</Form.Label>
          <Form.Control type="text" name="fullName" placeholder="Enter your name" value={fullName} onChange={HandleChange} />
        </Form.Group>
        {/*EMAIL*/}
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label style={{ color: "white" }}>Email</Form.Label>
          <Form.Control type="email" name="email" placeholder="Enter email" value={email} onChange={HandleChange} />
        </Form.Group>
        {/*PHONE NUMBER*/}
        <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
          <Form.Label style={{ color: "white" }}>Phone number</Form.Label>
          <Form.Control type="text" name="phoneNumber" placeholder="Enter phone number" value={phoneNumber} onChange={HandleChange} />
        </Form.Group>
        {/*PASSWORD*/}
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label style={{ color: "white" }}>Password</Form.Label>
          <Form.Control type="password" name="password" placeholder="Password" value={password} onChange={HandleChange} />
        </Form.Group>
        {/*CONFIRM PASSWORD*/}
        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
          <Form.Label style={{ color: "white" }}>Confirm password</Form.Label>
          <Form.Control type="password" name="confirmPassword" placeholder="Password again" value={confirmPassword} onChange={HandleChange} />
        </Form.Group>
        <p style={{ color: "red" }}>{passwordsMatch ? "" : "Given passwords do not match"}</p>
        {/*ROLE*/}
        <Form.Group className="mb-3" controlId="formBasicRole">
          <Form.Label style={{ color: "white" }}>Role</Form.Label>
          <Form.Select value={role} name="role" aria-label="Default select example" onChange={HandleChange}>
            <option value="">Select role for user</option>
            <option value="2">Sales-person</option>
            <option value="1">Cleaner</option>
            <option value="0">Admin</option>
          </Form.Select>
        </Form.Group>
        {/*ADDRESS*/}
        <Form.Group className="mb-3" controlId="formBasicAddress">
          <Form.Label style={{ color: "white" }}>Address</Form.Label>
          <Form.Control type="text" name="address" placeholder="Address" value={address} onChange={HandleChange} />
        </Form.Group>
        {/*POSTAL CODE*/}
        <Form.Group className="mb-3" controlId="formBasicPostalCode">
          <Form.Label style={{ color: "white" }}>Postal code</Form.Label>
          <Form.Control type="text" name="postalCode" placeholder="Postal code" value={postalCode} onChange={HandleChange} />
        </Form.Group>
        {/*CITY*/}
        <Form.Group className="mb-3" controlId="formBasicCity">
          <Form.Label style={{ color: "white" }}>City</Form.Label>
          <Form.Control type="text" name="city" placeholder="City" value={city} onChange={HandleChange} />
        </Form.Group>
        {/*BANK ACCOUNT NUMBER*/}
        <Form.Group className="mb-3" controlId="formBasicBankAccNumber">
          <Form.Label style={{ color: "white" }}>Bank account number</Form.Label>
          <Form.Control type="text" name="bankAccNumber" placeholder="Bank account number" value={bankAccNumber} onChange={HandleChange} />
        </Form.Group>
        <Row className='mx-auto' style={{ marginTop: "10vh", marginBottom: "5vh" }}>
          <Col className="col-1" />
          <Col className="col-5" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button onClick={handleCancel} className="text-center" variant="danger" type="button">
              Cancel
            </Button>
          </Col>
          <Col className="col-5" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button className="text-center" variant="success" type="submit" onClick={SubmitData}>
              Submit
            </Button>
          </Col>
          <Col className="col-1" />
        </Row>

      </Form>

    </div>
  )
}


//---Page Component---//
// export to App.js
export default RegisterPage;