import React, { useState, useEffect, useReducer, useRef } from 'react';
import { GetAllUsers, DeleteUser, UpdateUser } from "../../controllers/usersController";
import { Col, Dropdown, Container, ListGroup, Row, Button, Form, Modal, Toast } from 'react-bootstrap';
import styles from '../css/adminUserPage.module.css';

//Import MUI stuff

import TextField from '@mui/material/TextField';
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from '@mui/material/IconButton';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import Images from "../../components/imageComponent"
import { ActionButton, SearchButton, LockButton, ClearButton } from "../../components/buttonComponents"
import { DrawerButton } from "../../components/drawerButtonComponent"
import RegisterPage from "../../pages/registerPage";
import { style } from '@mui/system';






// document.addEventListener("click", function(){
//   if()
// })
const AdminUserPage = () => {
  //UPDATE USERDATA
  const [reducerValue, forceUpdate] = useReducer(x => x + 1, 0);

  const [users, setUsers] = useState([]);
  useEffect(() => {
    GetAllUsers().then(data => {
      if (data.error) {
        console.log(data.error);
      }
      else {
        setUsers(data);
        // console.log(data)
      }
      
    })
  }, [reducerValue]);

  if (users !== [])
    users.map((item) => {
      switch (item.role) {
        case 0:
          item.roleWritten = "Admin"
          break;
        case 1:
          item.roleWritten = "Cleaner"
          break;
        case 2:
          item.roleWritten = "Sales person"
      }
    })




  const UserList = (properties) => {

    return properties.userlist.filter((item => {
      // Filters shown by user role given to Userlist props + searchbar value. Handles searchbar filtering in-case-sensetive.
      return search.toLowerCase() === "" ? item.role === properties.roleFilter : item.role === properties.roleFilter && item.fullName.toLowerCase().includes(search.toLowerCase())
    }))
      .map((item, index) => (

        <Container key={index} style={{ paddingTop: "1vh", paddingBottom: "1vh" }}>
          <Col className={properties.readyToRemove ? `${styles.readyToRemove}` : `${styles.notReadyToRemove}`}>
            <Row style={{ height: "40%", width: "100%", margin: "0", padding: "0", /* backgroundColor: "red" */ }}>
              <Col style={{ width: "50%", margin: "2%", padding: "0%", /* backgroundColor: "violet" */ }}>
                <span className="align-text-bottom" style={{ color: "#D9D9D9", fontSize: "14px" }}>{item.fullName}</span>
              </Col>
              <Col style={{ width: "50%", margin: "0", padding: "0", display: "flex", /* backgroundColor: "orange" */ }}>
                <IconButton onClick={() => properties.readyToRemove ? handleRemove(item._id) : getCurrentlyManagedUser(item)} data-id={item._id} style={{ marginLeft: "auto", backgroundColor: "transparent", border: "none", color: "black" }}>
                  {properties.readyToRemove ? <RemoveCircleOutlineIcon sx={{ color: "white" }}></RemoveCircleOutlineIcon> : <ManageAccountsIcon sx={{ color: "white" }}></ManageAccountsIcon>}
                </IconButton>
              </Col>
            </Row>
          </Col>
        </Container>
      ));
  }

  //CONFIRMATION MODAL STUFF

  const [warningMessage, setWarningMessage] = useState("");

  //Affects which function confirm button triggers in confirmation modal
  const [modalFunction, setModalFunction] = useState("")

  const handleConfirmationMessage = (warningMsg, modalFunction) => {
    setWarningMessage(warningMsg);
    setModalFunction(modalFunction); // IF this is set to "delete", modal confirmation button triggers removeAndClose function. Otherwise it triggers confirmUpdateUser function
  }

  //SEARCH STUFF

  const [search, setSearch] = useState("");

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const handleSearchClear = () => {
    setSearch("");
  }

  const [show, setShow] = useState(false); //Toggle visibility of search bar

  //WRAPPER STUFF

  const wrapperRef = React.createRef();

  const handleClick = () => {
    // 👇️ take parameter passed from Child component
    const wrapper = wrapperRef.current;
    wrapper.classList.toggle(`${styles.wrapperOpen}`)
  };

  //MANAGE USER

  const handleUpdateUser = event => {
    event.preventDefault()

    //Check if given new passwords match
    if (passwordsMatch && currentlyManagedUser.fullName !== "" && currentlyManagedUser.phoneNumber !== "") {
      //Check if any changes have been made to user after opening the form
      if (checkUserChange != currentlyManagedUser) {
        //Sets confirmation message for confirmation modal and string to indicate which function should modal confirmation button trigger.
        handleConfirmationMessage("Are you sure you want to update user info?", "update")
        handleShowModal();
      }
      else {
        setCurrentError("You didn't make any changes to this user!");
        setShowErrorToast(true)
      }
    }
    else if (!passwordsMatch) {
      setCurrentError("Given passwords do not match!");
      setShowErrorToast(true);
      setShowToast(false);
    }
    else if (currentlyManagedUser.fullName === "") {
      setCurrentError("You must fill the name field!");
      setShowErrorToast(true);
      setShowToast(false);
    }
    else if (currentlyManagedUser.phoneNumber === "") {
      setCurrentError("You must fill the phone number field!");
      setShowErrorToast(true);
      setShowToast(false);
    }
  }

  const confirmUpdateUser = async () => {
    //Formatting fullName first letter to uppercase before updating

    const containsWhitespace = /\s/.test(currentlyManagedUser.fullName) // Tests if fullName contains whitespaces.
    const regexPattern = /\s+/g;
    if (containsWhitespace) {
      currentlyManagedUser.fullName = currentlyManagedUser.fullName.replace(regexPattern, ' '); //Replaces possible extra whitespaces with only one whitespace.
      let namesSplitted = currentlyManagedUser.fullName.split(' '); //Splits fullName to array by whitespace.
      let formattedNames = [];

      namesSplitted.map(item => {
        let nameSplitted = item.split(''); //Split array item to new array by letter.
        if (nameSplitted[0] !== undefined){
          nameSplitted[0] = nameSplitted[0].toUpperCase();//Replace array item first letter with Uppercase letter
        }  
        nameSplitted = nameSplitted.join(''); //Join array of letters to string
        formattedNames.push(nameSplitted); //Push formatted item to formattedNames array.
      });
      currentlyManagedUser.fullName = formattedNames.join(' '); // Join names to one string with whitespaces.
    }
    else {
      let nameSplitted = currentlyManagedUser.fullName.split('');
      nameSplitted[0] = nameSplitted[0].toUpperCase();
      currentlyManagedUser.fullName = nameSplitted.join('');
    }

    await UpdateUser(currentlyManagedUser)
      .then(data => {
        if (data.error) {
          setShowErrorToast(true);
          setShowToast(false);
        }
        else {
          setShowErrorToast(false);
          setShowToast(true);
          forceUpdate();
          setCheckUserChange(currentlyManagedUser);
          handleCloseModal();
          setCurrentlyManagedUser({ ...currentlyManagedUser, password: "" });
          setConfirmPassword("");
        }
      })

  }



  const [currentError, setCurrentError] = useState("");

  const handleChange = (event) => {
    setCurrentlyManagedUser({ ...currentlyManagedUser, [event.target.name]: event.target.value });
  }

  const [currentlyManagedUser, setCurrentlyManagedUser] = useState({});

  const [checkUserChange, setCheckUserChange] = useState({});

  const wrapperRef2 = React.createRef();

  const handleManageClick = () => {
    setShowErrorToast(false);
    setShowToast(false);
    setConfirmPassword("");
    const wrapper = wrapperRef2.current;
    wrapper.classList.toggle(`${styles.wrapperOpen}`) //Brings manage-user form to interface.

  }

  const getCurrentlyManagedUser = (user) => {
    //Sets currently managed user, so manage-user form uses right data to autofill form inputs. Updates when form inputs are modified.
    setCurrentlyManagedUser(user)

    //Sets currently managed user to another variable, that will be used to check if any changes to user data has been made when submitting manage-user form.
    //unlike currentlyManagedUser, this doesn't change when form inputs are modified).
    setCheckUserChange(user);

    handleManageClick()
  }


  //SUCCESS AND ERROR TOASTS STUFF

  const ShowSuccess = () => (
    <Toast style={{ zIndex: "5", position: "fixed", width: "70%", marginLeft: "15%" }} onClose={() => setShowToast(false)} show={showToast}>
      <Toast.Header>
        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
        <strong className="me-auto">Well done!</strong>
      </Toast.Header>
      <Toast.Body>User information has been updated</Toast.Body>
    </Toast>
  );

  const ShowError = (error) => (
    <Toast style={{ zIndex: "5", position: "fixed", width: "70%", marginLeft: "15%" }} onClose={() => setShowErrorToast(false)} show={showErrorToast}>
      <Toast.Header>
        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
        <strong className="me-auto">error</strong>

      </Toast.Header>
      <Toast.Body>{currentError}</Toast.Body>
    </Toast>
  );

  const [showToast, setShowToast] = useState(false)

  const [showErrorToast, setShowErrorToast] = useState(false)



  //REMOVE USER STUFF

  const [readyToRemove, setReadyToRemove] = useState(false);

  //Stores Id of the user that admin wants to delete, so modal confirmation button that triggers removeAndClose function knows which user to delete.
  const [id, setId] = useState("");

  const handleRemoveBtn = (props) => {
    setReadyToRemove(!readyToRemove)
  }

  const handleRemove = (_id) => {
    handleConfirmationMessage("Are you sure you want to delete this user?", "delete")
    handleShowModal();
    setId(_id)
  }

  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const removeAndClose = async () => {
    await DeleteUser(id)
    handleCloseModal()
    forceUpdate()
  }

  //FILTER USERS GROUPS DROPDOWN

  const [filterGroup, setFilterGroup] = useState("3");

  const handleSetFilterGroup = (event) => {
    setFilterGroup(event.target.value)
  }

  //Returns UserList Components with appropriate role filter properties. UserList components then returns "user blocks" depending on role filter and searchbar filter.
  const RenderFilterGroup = () => {
    switch (filterGroup) {
      case "3":
        return (
          <ListGroup>
            <h6 style={{ color: "white", alignSelf: "center" }}>Admins</h6>
            <UserList roleFilter={0} readyToRemove={readyToRemove} userlist={users} />

            <h6 style={{ color: "white", alignSelf: "center" }}>Cleaners</h6>
            <UserList roleFilter={1} readyToRemove={readyToRemove} userlist={users} />

            <h6 style={{ color: "white", alignSelf: "center" }}>Sales-persons</h6>
            <UserList roleFilter={2} readyToRemove={readyToRemove} userlist={users} />
          </ListGroup>
        )
      case "0":
        return (
          <ListGroup>
            <h6 style={{ color: "white", alignSelf: "center" }}>Admins</h6>
            <UserList roleFilter={0} readyToRemove={readyToRemove} userlist={users} />
          </ListGroup>
        )
      case "1":
        return (
          <ListGroup>
            <h6 style={{ color: "white", alignSelf: "center" }}>Cleaners</h6>
            <UserList roleFilter={1} readyToRemove={readyToRemove} userlist={users} />
          </ListGroup>
        )
      case "2":
        return (
          <ListGroup>
            <h6 style={{ color: "white", alignSelf: "center" }}>Sales-persons</h6>
            <UserList roleFilter={2} readyToRemove={readyToRemove} userlist={users} />
          </ListGroup>
        )
    }

  }

  //HANDLING CONFIRMPASSWORD INPUT

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSetConfirmPassword = event => {
    setConfirmPassword(event.target.value);
  }

  //CHECKING IF NEW PASSWORDS MATCH

  const [passwordsMatch, setPasswordsMatch] = useState(true); // if false, error message will be shown under confirm password input.

  //Checks if password and confirmPassword match everytime either of the values update. Then sets passwordsMatch value accordingly.
  //Without useEffect values would update with delay and confirmPassword would be 1 letter short of what it should actually be.
  useEffect(() => {
    currentlyManagedUser.password == confirmPassword ? setPasswordsMatch(true) : setPasswordsMatch(false)
  }, [confirmPassword, currentlyManagedUser.password])



  return (
    <Container fluid className={styles.containerBackground}>
      <Modal style={{ marginTop: "30vh" }} show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Heads up!</Modal.Title>
        </Modal.Header>
        <Modal.Body>{warningMessage}</Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseModal} variant="secondary">
            Cancel
          </Button>
          <Button onClick={modalFunction === "delete" ? removeAndClose : confirmUpdateUser} variant="primary">
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      <div className={styles.stickyTopContainer}>
        <Col className={styles.topContainer} />
        <Row className={styles.buttonsBackground}>
          <DrawerButton handleClick={handleClick} image={Images.plusSign} text={"ADD USER"} />
          <ActionButton readyToRemove={readyToRemove} handleRemove={handleRemoveBtn} image={Images.minusSign} text={"REMOVE USER"} />
        </Row>
        {/* SEARCH BAR */}
        <Form.Group /* className={show ? `mb-3 mt-3 ${styles.active}` : `${styles.inactive}`} */ controlId="placeholderi">
          <TextField size="small" InputProps={{ endAdornment: (<IconButton onClick={handleSearchClear}><ClearIcon></ClearIcon></IconButton>) }} style={{ width: "95%", marginLeft: "2.5%", backgroundColor: "white", borderRadius: "10px" }} type="text" placeholder='Search by employee name' name="searchBar" value={search} onChange={handleSearchChange} />
        </Form.Group>
        <Container className='p-3 d-flex justify-content-center'>
        <Form.Group className="mb-3" controlId="formBasicRole">
          <Form.Select value={filterGroup} name="role" aria-label="Default select example" onChange={handleSetFilterGroup}>
            <option value="3">All</option>
            <option value="2">Sales-person</option>
            <option value="1">Cleaner</option>
            <option value="0">Admin</option>
          </Form.Select>
        </Form.Group>
      </Container>
      </div>

      <div className={styles.listBackground} >
      <RenderFilterGroup/> {/*Renders "user blocks" to screen*/}
      </div>

      {/*DRAWER ADD USER*/}
      <div ref={wrapperRef} className={styles.wrapper2}>
        <Row>
          <Col style={{ marginTop: "70px" }}>
            <DrawerButton handleClick={handleClick} image={Images.arrowDown} text={""} />
          </Col>
        </Row>
        <Row>
          <RegisterPage handleCancel={handleClick}  forceUpdate={forceUpdate}></RegisterPage>
        </Row>
      </div>
      {/*DRAWER EDIT USER*/}
      <div ref={wrapperRef2} className={styles.wrapper2}>
        <Row>
          <Col style={{ marginTop: "70px" }}>
            <DrawerButton handleClick={handleManageClick} image={Images.arrowDown} text={""} />
          </Col>
        </Row>
        <Row>
          {/* <div>
            <img style={{width: "6%", marginLeft: "80%"}} src = {Images.lockIcon}></img>
          </div> */}
        </Row>
        <Row>
          {/* UPDATE USER FORM */}
          <div className="formContainer" style={{ padding: "0 5vw 5vw 5vw" }}>
            {ShowError()}
            {ShowSuccess()}
            <Form>
              {/*FULL NAME*/}
              <Form.Group className="mb-3" controlId="formFullName">
                <Form.Label style={{ color: "white" }}>Name*</Form.Label>
                <Form.Control value={currentlyManagedUser.fullName} onChange={handleChange} type="text" name="fullName" placeholder="Enter your name" />
              </Form.Group>
              {/*EMAIL*/}
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label style={{ color: "white" }}>Email*</Form.Label>
                <Form.Control value={currentlyManagedUser.email} onChange={handleChange} type="email" name="email" placeholder="Enter email" />
              </Form.Group>
              {/*PHONE NUMBER*/}
              <Form.Group className="mb-3" controlId="formPhoneNumber">
                <Form.Label style={{ color: "white" }}>Phone number*</Form.Label>
                <Form.Control value={currentlyManagedUser.phoneNumber} onChange={handleChange} type="text" name="phoneNumber" placeholder="Enter phone number" />
              </Form.Group>
              {/*PASSWORD*/}
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label style={{ color: "white" }}>Password*</Form.Label>
                <Form.Control value={currentlyManagedUser.password} onChange={handleChange} type="password" name="password" placeholder="Set new password" />
              </Form.Group>
              {/*CONFIRM PASSWORD*/}
              <Form.Group className="mb-3" controlId="formConfirmPassword">
                <Form.Label style={{ color: "white" }}>Confirm Password*</Form.Label>
                <Form.Control value={confirmPassword} onChange={handleSetConfirmPassword} type="password" name="confirmPassword" placeholder="Confirm new password" />
              </Form.Group>
              <p style={{ color: "red" }}>{passwordsMatch ? "" : "Given passwords do not match"}</p>
              {/*ROLE*/}
              <Form.Group className="mb-3" controlId="formRole">
                <Form.Label style={{ color: "white" }}>Role*</Form.Label>
                <Form.Select value={currentlyManagedUser.role} onChange={handleChange} name="role" aria-label="Default select example">
                  <option value="2">Sales-person</option>
                  <option value="1">Cleaner</option>
                  <option value="0">Admin</option>
                </Form.Select>
              </Form.Group>
              {/*ADDRESS*/}
              <Form.Group className="mb-3" controlId="formAddress">
                <Form.Label style={{ color: "white" }}>Address</Form.Label>
                <Form.Control value={currentlyManagedUser.address} onChange={handleChange} type="text" name="address" placeholder="Address" />
              </Form.Group>
              {/*POSTAL CODE*/}
              <Form.Group className="mb-3" controlId="formPostalCode">
                <Form.Label style={{ color: "white" }}>Postal code</Form.Label>
                <Form.Control value={currentlyManagedUser.postalCode} onChange={handleChange} type="text" name="postalCode" placeholder="Postal code" />
              </Form.Group>
              {/*CITY*/}
              <Form.Group className="mb-3" controlId="formCity">
                <Form.Label style={{ color: "white" }}>City</Form.Label>
                <Form.Control value={currentlyManagedUser.city} onChange={handleChange} type="text" name="city" placeholder="City" />
              </Form.Group>
              {/*BANK ACCOUNT NUMBER*/}
              <Form.Group className="mb-3" controlId="formBankAccNumber">
                <Form.Label style={{ color: "white" }}>Bank account number</Form.Label>
                <Form.Control value={currentlyManagedUser.bankAccNumber} onChange={handleChange} type="text" name="bankAccNumber" placeholder="Bank account number" />
              </Form.Group>
              <Row className='mx-auto' style={{ marginTop: "10vh", marginBottom: "5vh" }}>
                <Col className="col-1" />
                <Col className="col-5" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Button onClick={handleManageClick} className="text-center" variant="danger" type="button">
                    Cancel
                  </Button>
                </Col>
                <Col className="col-5" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Button className="text-center" variant="success" type="submit" onClick={handleUpdateUser}>
                    Submit
                  </Button>
                </Col>
                <Col className="col-1" />
              </Row>
            </Form>

          </div>
        </Row>
      </div>


    </Container>
  )

}

export default AdminUserPage;
//Dropdowniin Etunimi, sukunimi, puhnro, osoitetiedot, rooli.