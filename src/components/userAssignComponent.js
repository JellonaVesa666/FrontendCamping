//---React--//
// import
import React, { createRef, useState, useEffect } from "react";

//---Bootsrap--//
// import
import { Dropdown, Container, Col, Form, Row, ButtonGroup } from 'react-bootstrap';

//---CSS---//
// import
import styles from "../pages/css/adminCabinsPage.module.css";



//---Component---//
// Initialize
export const UserAssignComponent = React.memo((props) => {

  //---Hooks---//
  // initialize
  const [showDropdown, setShowDropdown] = useState(false);

  //---References---//
  // initialize
  const formRef = createRef();
  const dropdownRef = createRef();

  useEffect(() => {
    if (showDropdown) {
      dropdownRef.current.classList.add(`${styles.dropdownRotate}`)
    }
    else {
      dropdownRef.current.classList.remove(`${styles.dropdownRotate}`)
    }
  });

  //---Dropdown---//
  // functions
  const HideDropdown = (event) => {
    event.preventDefault();
    if (event.relatedTarget === null && showDropdown) {
      setShowDropdown(false);
    }
  }

  const ShowDropdown = (userCollection) => {
    // Fetches users with role of a cleaner and creates array from them
    if (!showDropdown) {

      setShowDropdown(true);

      // Returns focus on inputfield
      formRef.current.focus();
    }
    else {
      // Disables focus on inputfield
      formRef.current.blur();
      setShowDropdown(false);
    }
  }

  //---Dropdown---//
  // return
  const UserDropdown = () => {
    return (
      props.userCollection.filter(user => user.fullName.toLowerCase().startsWith(props.value.toLowerCase())).map(user => {
        //console.log(user);
        return (
          <Dropdown.Item
            className="py-0"
            tabIndex="0"
            style={{ color: "black" }}
            key={user._id}
            onBlur={(event) => HideDropdown(event)}
            onClick={() => { props.userSelect(user.fullName, props.index); setShowDropdown(false) }}
          >
            {user.fullName}
          </Dropdown.Item>
        )
      })
    )
  }

  //---Component---//
  // return
  return (
    <Container>
      <Row className="my-4">
        <Col style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
          <ButtonGroup>
            <Dropdown.Toggle
              style={{ width: "20%" }}
              ref={dropdownRef}
              className="rounded"
              onClick={() => ShowDropdown(props.userCollection)}
              split variant="success"
              id="dropdown-split-basic"
            />
            <Dropdown.Menu style={{ marginTop: "16%" }} show={showDropdown} >
              {showDropdown ? <>
                {UserDropdown()}
              </> : ""}
            </Dropdown.Menu>
            <Form.Control
              ref={formRef}
              className={props.value !== "" && !props.locked ? props.error : ""}
              style={{ borderRadius: "0px 4px 4px 0px" }}
              value={props.value}
              onBlur={(event) => HideDropdown(event)}
              onClick={() => ShowDropdown(props.userCollection)}
              onChange={(event) => props.userSelect(event.target.value, props.index)}
              type="text"
              placeholder="Search User"
            />
          </ButtonGroup>
        </Col>
      </Row>
    </Container>
  )
});