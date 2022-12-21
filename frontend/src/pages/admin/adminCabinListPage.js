import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


//---CSS--//
// import
import '../css/adminCabinListPage.css';


//---Bootsrap--//
// import
import { Col, Container, ListGroup, Row } from 'react-bootstrap';


//---Functions---//
// import
import { GetCabinList } from "../../controllers/cabinListController"


//---Components---//
// import
import Images from "../../components/imageComponent"
import { ActionButton } from "../../components/buttonComponents"


//---Page---//
// initialize
const AdminCabinListPage = () => {

  const [cabinLists, setCabinLists] = useState([]);
  const navigate = useNavigate();

  // Used to fetch all CabinLists when page is loaded
  useEffect(() => {
    GetCabinList().then(response => {
      if (response.error) {
        console.log(response.error);
      }
      setCabinLists(response);
    })
  }, [])


  // Navigates to AdminCabinsPage if clicked list exists and is not empty
  const Navigate = (props) => {
    //console.log(props._id);
    GetCabinList(props).then(response => {
      if (response.error) {
        console.log(response.error);
      }
      navigate(`/admin/cabinslist/cabins/${props}`);
    })
  };


  // CabinList Component, maps all items from cabinLists
  const CabinList = (props) => {
    //console.log(props.cabinList)
    return props.cabinList.map(item => (
      <div key={item._id}>
        <ListGroup.Item className="text-center" onClick={() => Navigate(item._id)}>{item.name}</ListGroup.Item>
      </div>
    ));
  }

  return (
    <Container fluid className="container-background">
      <Col className="header-background" />
      <Col className="list-background">
        <ListGroup>
          <CabinList cabinList={cabinLists} /> {/* passes cabinLists variable to component*/}
        </ListGroup>
      </Col>
      <Row className="buttons-background">
        <ActionButton image={Images.plusSign} text={"ADD LIST"} />
        <ActionButton image={Images.editIcon} text={"RENAME LIST"} />
        <ActionButton image={Images.minusSign} text={"REMOVE LIST"} />
      </Row>
    </Container>
  )
}


//---Page---//
// export
export default AdminCabinListPage;