//---React---//
// import
import React, { useState, useRef, useEffect, forwardRef } from "react";


//---Bootstrap---//
// import
import { Button, Form, Toast } from 'react-bootstrap';



//---Page Component---//
// initialize
const ManageUserPage = (props) => {
    const initializeCurrentUser = () => {
        setCurrentUser({
            firstName: props.currentlyManagedUser.firstName,
            lastName: props.currentlyManagedUser.lastName,
            email: props.currentlyManagedUser.email,
            password: props.currentlyManagedUser.password,
            role: props.currentlyManagedUser.role,
            phoneNumber: props.currentlyManagedUser.phoneNumber,
            address: props.currentlyManagedUser.address,
            postalCode: props.currentlyManagedUser.address,
            city: props.currentlyManagedUser.city,
            bankAccNumber: props.currentlyManagedUser.bankAccNumber,
        })
    }
    const [currentUser, setCurrentUser] = useState({})







    const [modify, setmodify] = useState(false)
    const [values, setValues] = useState({

    });

    const [testArray, setTestArray] = useState([]);


    const { firstName, lastName, email, phoneNumber, password, role, address, postalCode, city, bankAccNumber, error, success } = values; //Deconstruct values so they can be used outside the hook function



    const HandleChange = (event) => {
        setmodify(false)
        setValues({ ...values, [event.target.name]: event.target.value });
        //console.log(values);
    }

    const SubmitData = event => {
        event.preventDefault();
        //console.log(values);
        Register({ firstName, lastName, role, email, phoneNumber, password, address, postalCode, city })
            .then(data => {
                if (data.error) {
                    setValues({ ...values, success: false, error: data.error })
                    setShowErrorToast(true);
                    setShowToast(false)
                }
                else {
                    setValues({
                        ...values,
                        firstName: currentUser.firstName,
                        lastName: currentUser.lastName,
                        email: currentUser.email,
                        phoneNumber: currentUser.phoneNumber,
                        password: currentUser.password,
                        role: currentUser.role,
                        address: currentUser.address,
                        postalCode: currentUser.postalCode,
                        city: currentUser.city,
                        bankAccNumber: currentUser.bankAccNumber,
                        error: false,
                        success: true
                    })
                    props.forceUpdate();
                    setShowToast(true)
                    setShowErrorToast(false)
                }
            })

    }

    const ShowError = () => (
        <Toast style={{ position: "fixed", width: "70%", marginLeft: "15%" }} onClose={() => setShowErrorToast(false)} show={showErrorToast}>
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
        <Toast style={{ position: "fixed", width: "70%", marginLeft: "15%" }} onClose={() => setShowToast(false)} show={showToast}>
            <Toast.Header>
                <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                <strong className="me-auto">User Created</strong>
            </Toast.Header>
        </Toast>
    );

    return (
        <div className="formContainer" style={{ padding: "0 5vw 5vw 5vw" }}>
            {ShowError()}
            {ShowSuccess()}
            <Form>
                {/*FIRST NAME*/}
                <Form.Group className="mb-3" controlId="formBasicFirstName" props>
                    <Form.Label style={{ color: "white" }}>First Name</Form.Label>
                    <Form.Control disabled type="text" name="firstName" placeholder="Enter first name" value={currentUser.firstName} onChange={HandleChange} />
                </Form.Group>
                {/*LAST NAME*/}
                <Form.Group className="mb-3" controlId="formBasicLastName">
                    <Form.Label style={{ color: "white" }}>Last Name</Form.Label>
                    <Form.Control disabled type="text" name="lastName" placeholder="Enter last name" value={currentUser.lastName} onChange={HandleChange} />
                </Form.Group>
                {/*EMAIL*/}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label style={{ color: "white" }}>Email</Form.Label>
                    <Form.Control disabled type="email" name="email" placeholder="Enter email" value={currentUser.email} onChange={HandleChange} />
                </Form.Group>
                {/*PHONE NUMBER*/}
                <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
                    <Form.Label style={{ color: "white" }}>Phone number</Form.Label>
                    <Form.Control disabled type="text" name="phoneNumber" placeholder="Enter phone number" value={currentUser.phoneNumber} onChange={HandleChange} />
                </Form.Group>
                {/*PASSWORD*/}
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label style={{ color: "white" }}>Password</Form.Label>
                    <Form.Control disabled type="password" name="password" placeholder="Password" value={currentUser.password} onChange={HandleChange} />
                </Form.Group>
                {/*ROLE*/}
                <Form.Group className="mb-3" controlId="formBasicRole">
                    <Form.Label style={{ color: "white" }}>Role</Form.Label>
                    <Form.Select disabled value={currentUser.role} name="role" aria-label="Default select example" onChange={HandleChange}>
                        <option value="">Select role for user</option>
                        <option value="2">Sales-person</option>
                        <option value="1">Cleaner</option>
                        <option value="0">Admin</option>
                    </Form.Select>
                </Form.Group>
                {/*ADDRESS*/}
                <Form.Group className="mb-3" controlId="formBasicAddress">
                    <Form.Label style={{ color: "white" }}>Address</Form.Label>
                    <Form.Control disabled type="text" name="address" placeholder="Address" value={currentUser.address} onChange={HandleChange} />
                </Form.Group>
                {/*POSTAL CODE*/}
                <Form.Group className="mb-3" controlId="formBasicPostalCode">
                    <Form.Label style={{ color: "white" }}>Postal code</Form.Label>
                    <Form.Control disabled type="text" name="postalCode" placeholder="Postal code" value={currentUser.postalCode} onChange={HandleChange} />
                </Form.Group>
                {/*CITY*/}
                <Form.Group className="mb-3" controlId="formBasicCity">
                    <Form.Label style={{ color: "white" }}>City</Form.Label>
                    <Form.Control disabled type="text" name="city" placeholder="City" value={currentUser.city} onChange={HandleChange} />
                </Form.Group>
                {/*BANK ACCOUNT NUMBER*/}
                <Form.Group className="mb-3" controlId="formBasicBankAccNumber">
                    <Form.Label style={{ color: "white" }}>Bank account number</Form.Label>
                    <Form.Control disabled type="text" name="bankAccNumber" placeholder="Bank account number" value={currentUser.bankAccNumber} onChange={HandleChange} />
                </Form.Group>

                <Button onClick={SubmitData} variant="primary" type="submit">
                    Submit
                </Button>
            </Form>

        </div>
    )
}


//---Page Component---//
// export to App.js
export default ManageUserPage;