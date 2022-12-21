//---React--//
// import
import React from 'react';
import { useParams } from 'react-router-dom';

//---CSS---//
// import
import styles from "../css/adminCabinsPage.module.css";

//---Bootsrap--//
// import
import { Col, Container, Row, Button, Form, Modal, Toast, ToastContainer } from 'react-bootstrap';

//---MUI--//
// import
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

//---Functions---//
// import
import { GetCabinsById, GetCabinById, CreateCabin, DeleteCabin, UpdateCabinStatus, UpdateCabin } from "../../controllers/cabinController"
import { GetFilteredUsers } from "../../controllers/usersController"

//---Components---//
// import
import Images from "../../components/imageComponent"
import { DrawerButton } from "../../components/drawerButtonComponent"
import { Title } from "../../components/textComponents"
import { UserAssignComponent } from "../../components/userAssignComponent"



//---Page---//
// initialize
function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class Cabins extends React.Component {

  // Initialize this.state variables
  state = {
    isLoading: true,
    cabins: [
      [
        {
          title: "All",
          id: 0
        }
      ],
      [
        {
          title: "Free",
          id: 1
        },
        []
      ],
      [
        {
          title: "Booked",
          id: 2
        },
        []
      ],
      [
        {
          title: "Dirty",
          id: 3
        },
        []
      ],
      [
        {
          title: "Clean",
          id: 4
        },
        []
      ]
    ],
    status: [
      { id: 1, name: "Free" },
      { id: 2, name: "Booked" },
      { id: 3, name: "Dirty" },
      { id: 4, name: "Clean" }
    ],
    newCabinData: {
      listId: "",
      name: "",
      startDate: "",
      endDate: "",
      occupant: "",
      status: 1,
      slots: [
        {
          userName: "",
          slotId: 0,
          userId: null,
          locked: false
        }
      ],
    },
    storedStartDate: "",
    storedEndDate: "",
    search: "",
    category: 0,
    drawerOpen: false,
    updateBool: false,

    /* Form variables */
    formBool: {
      name: true,
      date: true,
      slots: true,
    },
    formError: "",
    alertMessage: "",
    alert: false,
    userCollection: [],

    /* Delete variables */
    deleteCabinId: null,
    deleteListId: null,
    deleteState: false,
    deletePopup: false
  }

  userSelect = (newValue, index) => {
    const newArray = this.state.newCabinData.slots.map(user => {
      if (user.slotId === index) {
        return { ...user, userName: newValue };
      }
      return user;
    })
    if (this.state.userCollection.find((user) => user.fullName === newValue)) {
      newArray[index].locked = true;
    }
    else {
      newArray[index].locked = false;
    }
    this.setState({
      newCabinData: {
        ...this.state.newCabinData,
        slots: newArray
      }
    })
    //console.log(newArray);
  };


  //---Page Load---//
  /* ---------------------------------------- */
  /* ---------------------------------------- */

  componentDidMount() {
    this.fetchCabins(this.props.params);
    this.fetchUsers();
  }

  // Fetch cabins when page loads
  fetchCabins = (cabinList) => {
    GetCabinsById(cabinList.listId).then(response => {

      // Initialize empty arrays
      const newArray = [[{ title: "All", id: 0 }], [{ title: "Free", id: 1 }, []], [{ title: "Booked", id: 2 }, []], [{ title: "Dirty", id: 3 }, []], [{ title: "Clean", id: 4 }, []]];
      const expiredArray = [];

      // Seperate each cabin by their status
      for (let i = 0; i < response.length; i++) {
        if (response[i].status !== 2) {
          newArray[response[i].status][1].push(response[i]);
        }
        else {
          // Initialize current date
          const currentDate = new Date();

          // Initialize endDate and convert to UTC+2
          var bookDate = new Date(response[i].endDate);
          bookDate = new Date(bookDate.getTime() + bookDate.getTimezoneOffset() * (2 * (+30 * 1000)));

          //console.log("CurrentDate  " + currentDate);
          //console.log("BookDate  " + bookDate);

          // Compared booked cabin endDate to current date
          // and move them to Dirty category and them to expired array
          if (currentDate > bookDate) {
            //console.log("OLD  " + response[i]);

            response[i].status = 3;
            newArray[3][1].push(response[i]);
            expiredArray.push(response[i]);
          }
          else {
            newArray[2][1].push(response[i]);
          }
        }
      }

      // Post expired cabins to MongoDB
      if (expiredArray.length > 0) {
        UpdateCabinStatus(expiredArray);
      }

      // Set cabin data
      this.setState({ cabins: newArray });

      // Show cabin cards after isLoading is set to false
      this.setState({ isLoading: false });
    })
  };

  // Fetch users when page loads
  fetchUsers = () => {
    GetFilteredUsers().then(response => {

      // Initialize empty arrays
      const newArray = [];

      // Remove other users except cleaners
      for (let index = 0; index < response.length; index++) {
        if (Number(response[index].role) === Number(1)) {
          newArray.push(response[index]);
        }
      }
      // Set user data
      this.setState({ userCollection: newArray });
    })
  }


  render() {



    //---Card Components---//
    /* ---------------------------------------- */
    /* ---------------------------------------- */

    // Cards parent component
    const CabinCards = () => {
      return (
        <>
          {!this.state.isLoading ?
            this.state.cabins.map((cabinData, index) => {
              return (
                Number(cabinData[0].id) === Number(this.state.category) ?
                  <Container key={{ index }}>
                    {Number(this.state.category) !== 0 ?
                      <FilteredCards />
                      :
                      <AllCards />
                    }
                  </Container>
                  :
                  null
              )
            })
            :
            null
          }
        </>
      )
    }

    // Filtered Cabins shows cabins that filtered by category
    const FilteredCards = () => {
      return (
        // Map every cabin which category id matches filtered category id
        this.state.cabins.filter(cabin => Number(cabin[0].id) === Number(this.state.category)).map((cabinData, index) => {
          return (
            <Col key={index}>
              <p className="text-center" style={{ color: 'grey', fontSize: "18px", alignSelf: "flex-end", paddingTop: "3vh", paddingBottom: "3vh" }}>{cabinData[0].title}</p>
              {/* Display cabin cards */}
              <Card cabinData={cabinData} />
            </Col>
          )
        })
      )
    }

    // All Cabins shows all cabins if category is set to All
    const AllCards = () => {
      return (
        // Map every cabin that has category assigned to them, that is something else than 0
        this.state.cabins.filter(cabin => cabin[0].id !== 0).map((cabinData, index) => {
          return (
            <Col key={index}>
              <p className="text-center" style={{ color: 'whitesmoke', fontSize: "18px", alignSelf: "flex-end", paddingTop: "3vh", paddingBottom: "3vh" }}>{cabinData[0].title}</p>
              {/* Display cabin cards */}
              <Card cabinData={cabinData} />
            </Col>
          )
        })
      )
    }

    // Manages Cabin Card details, what is shown
    const Card = ({ cabinData }) => {
      return (
        Object.keys(cabinData[1]).filter(cabin => cabinData[1][cabin].name.toLowerCase().startsWith(this.state.search.toLowerCase())).map(cabin => {
          return (
            <Col className={`cabin-card ${cabinData[0].title}`} key={cabinData[1][cabin]._id} style={{ marginTop: "1vh", marginBottom: "1vh", borderRadius: "10px" }}>
              <Row style={{ height: "40%", width: "100%", margin: "0", padding: "0" }}>
                {/* Cabin Name */}
                <Col className=" col-2 align-text-bottom mt-2" style={{ color: "#D9D9D9", fontSize: "14px", textTransform: "uppercase" }}>{cabinData[1][cabin].name}</Col>
                {/* Cabin Dates */}
                {cabinData[1][cabin].status === 2 ?
                  <Col className=" col-8 m-auto" style={{ color: "#D9D9D9", fontSize: "14px" }} > {`${new Date(cabinData[1][cabin].endDate).toLocaleDateString()}  ${new Date(cabinData[1][cabin].endDate).toLocaleTimeString([], { timeStyle: 'short' })}`}</Col>
                  :
                  <Col className=" col-8 m-auto" style={{ color: "#D9D9D9", fontSize: "14px" }} />
                }
                <Col className="col-2" style={{}}>
                  {!this.state.deleteState ?
                    // Edit Button
                    <Button data-id={cabinData[1][cabin]._id} onClick={CardDrawer(cabinData[1])} style={{ backgroundColor: "transparent", border: "none", color: "black" }}>
                      <img src={Images.arrowDown} alt={Images.errorIcon} />
                    </Button>
                    :
                    // Remove Button
                    <Button style={{ backgroundColor: "transparent", border: "none", color: "black" }}
                      onClick={() => {
                        this.setState({ deleteCabinId: cabinData[1][cabin]._id })
                        this.setState({ deleteListId: cabinData[1][cabin].listId })
                        this.setState({ deletePopup: true });
                      }}
                    >
                      <RemoveCircleOutlineIcon sx={{ color: "white" }}></RemoveCircleOutlineIcon>
                    </Button>
                  }
                </Col>
              </Row >
              {/* Cabin Card Drawer */}
              {cabinData[1][cabin].isToggle && !this.state.deleteState ?
                <Row style={{ height: "60%", width: "100%", margin: "0", paddingTop: "1vh", paddingBottom: "1vh" }}>
                  {/* Cabin Name */}
                  <Col className="col-2" style={{ margin: "0", paddingLeft: "2%", paddingRight: "2%" }}>
                    <Col className={`cabin-name ${cabinData[0].title}`} style={{ width: "100%", height: "5.5vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <p className="text-center" style={{ color: "#D9D9D9", margin: "0", fontSize: "14px", textTransform: "uppercase" }}>{cabinData[1][cabin].name}</p>
                    </Col>
                  </Col>
                  <Col className=" col-2 m-0 pb-0 " style={{ color: "#D9D9D9", fontSize: "14px" }} >{cabinData[0].title}:</Col>
                  {/* Edit Button */}
                  <Col className=" col- 2 text-center my-auto">
                    <Button style={{ paddingLeft: "30%", paddingRight: "30%", backgroundColor: "#D9D9D9", border: "none", color: "black" }}
                      onClick={() => FetchCabin(cabinData[1][cabin]._id)}
                    > Edit
                    </Button>
                  </Col>
                  {/* Coccupant Details */}
                  <Col className="col-12" style={{ paddingRight: "2%", paddingLeft: "2%" }}>
                    <span className="align-text-bottom" style={{ color: "#D9D9D9", fontSize: "14px" }}>occupant: {cabinData[1][cabin].occupant}</span>
                  </Col>
                  {/* Cleaners Details */}
                  {cabinData[1][cabin].slots[0].userName === "" ?
                    <Col style={{ color: "#D9D9D9", fontSize: "14px" }}>cleaner:</Col>
                    :
                    <Col style={{ color: "#D9D9D9", fontSize: "14px", paddingRight: "2%", paddingLeft: "2%" }}>cleaner:
                      {
                        cabinData[1][cabin].slots.filter(cleaner => cleaner.userName !== "").map(cleaner => {
                          return (
                            <p key={cleaner._id} style={{ margin: "0", display: "inline-block" }}> &nbsp; {cleaner.userName} </p>
                          )
                        })}
                    </Col>
                  }
                </Row>
                :
                null
              }
            </Col >
          );
        })
      )
    }

    // Manages dropdown bool for each cabin card drawer
    const CardDrawer = (cabinList) => (event) => {
      //console.log(cabinList);
      const index = cabinList.findIndex(cabin => cabin._id === event.currentTarget.dataset.id);
      const list = [...cabinList];
      list[index].isToggle = !list[index].isToggle;
      this.setState({ list });
    }

    // Manages Cabin Card deletion
    const DeleteCard = () => {
      DeleteCabin({ _id: this.state.deleteCabinId, listId: this.state.deleteListId }).then(response => {
        if (response.error) {
          //console.log(response.error);
        }
        else {
          //console.log(response);
          this.fetchCabins(this.props.params);
          this.setState({ deletePopup: false });
        }
      })
    }



    //---Cabin Components---//
    /* ---------------------------------------- */
    /* ---------------------------------------- */

    // Opens cabin drawer window
    const OpenDrawer = (update, data) => {
      if (update) {
        if (data !== undefined) {
          this.setState(prevState => ({
            newCabinData: {
              ...prevState.newCabinData,
              _id: data._id,
              listId: this.props.params.listId,
              name: data.name,
              status: data.status,
              startDate: data.startDate.slice(0, 16),
              endDate: data.endDate.slice(0, 16),
              occupant: data.occupant,
              slots: data.slots
            }
          }));
        }
        this.setState({ drawerOpen: true });
      }
      else {

        var newDate = new Date();
        newDate = new Date(newDate.getTime() + newDate.getTimezoneOffset() * (-60 * 1000));
        newDate = newDate.toISOString();

        this.setState(prevState => ({
          newCabinData: {
            ...prevState.newCabinData,
            _id: undefined,
            listId: this.props.params.listId,
            name: "",
            startDate: newDate.slice(0, 16),
            endDate: newDate.slice(0, 16),
            occupant: "",
            status: 1,
            slots: [
              {
                userName: "",
                slotId: 0,
                userId: null,
                locked: false
              }
            ]
          }
        }));
        this.setState({ drawerOpen: true });
      }
    }

    // Closes cabin drawer window
    const CloseDrawer = () => {
      this.setState({ isLoading: true });
      this.fetchCabins(this.props.params);
      this.setState({ drawerOpen: false });
      if (this.state.updateBool) {
        this.setState({ updateBool: false });
      }
    }

    // Fetches cabin data if user is updating existing cabin
    // to be previewed in the cabin drawer window
    const FetchCabin = (cabinId) => {
      this.setState({ updateBool: true })
      GetCabinById({ _id: cabinId }).then(response => {
        if (response.error) {
          //console.log(response.error);
        }
        else {
          console.log(response);
          OpenDrawer(true, response);
        }
      })
    }

    // Assigns selected status to cabin
    const StatusGroup = () => this.state.status.map(status => {
      // Checked boolen, sets status to clicked checkbox instead of default status
      let checked = Number(this.state.newCabinData.status) === status.id;
      return (
        <Col key={status.id} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Form.Label style={{ color: "whitesmoke", textAlign: "center", display: "block" }}>
            <Form.Check
              onChange={(event) => SetState(Number(event.target.value), "status")}
              type="checkbox"
              value={status.id}
              className={checked ? status.name : ""}
              checked={checked}
            />
            {status.name}
          </Form.Label>
        </Col>
      );
    })

    // Contains buttons to add and remove user slots
    const SlotButtons = () => {
      return (
        <Container className="mb-5">
          <Col className="mx-auto text-center mt-5" style={{ backgroundColor: "whitesmoke", width: "´80vw", height: "0.2vh" }} />
          <Col className="mx-auto text-center mt-4 mb-4" style={{ color: "whitesmoke", paddingTop: "2vh" }}>SLOTS</Col>
          <Row>
            <Col className="col-2" />
            <Col className="col-3" style={{ display: "flex", justifyContent: "right", alignItems: "center" }}>
              <Button
                style={{ width: "50%" }}
                variant="success"
                // Calls SlotCount function which increments slots amount by the bool parameter
                onClick={this.state.newCabinData.slots.length >= 2 ? () => SlotCount(false) : () => { return }}
              >
                -
              </Button >
            </Col>
            <Col className="col-2 text-center" style={{ display: "flex", justifyContent: "center", alignItems: "center", color: "whitesmoke" }}>
              <h3 className="m-auto text-center">{this.state.newCabinData.slots.length}</h3>
            </Col>
            <Col className="col-3" style={{ display: "flex", justifyContent: "left", alignItems: "center" }}>
              <Button
                style={{ width: "50%" }}
                variant="success"
                // Calls SlotCount function which increments slots amount by the bool parameter
                onClick={() => SlotCount(true)}
              >
                +
              </Button >
            </Col>
          </Row>
        </Container>
      )
    }

    // Iterates user slot count when buttons pressed
    const SlotCount = (bool) => {
      // Create a copy of the userSlots
      const newArray = [...this.state.newCabinData.slots];

      if (bool) {
        // Add slot to newArray
        newArray.push({ userName: "", slotId: ((newArray.length - 1) + 1), userId: null, locked: false });
      }
      else {
        // Remove slot from newArray
        newArray.splice(-1)
      }

      // Set userSlots array to newArray
      this.setState({
        newCabinData: {
          ...this.state.newCabinData,
          slots: newArray
        }
      });
    }

    // Used to assign users to slots
    const AssignUserComponent = this.state.newCabinData.slots.map((user, index) =>
      <UserAssignComponent
        key={index}
        index={index}
        value={user.userName}
        locked={user.locked}
        error={this.state.formError}
        userCollection={this.state.userCollection}
        userSelect={this.userSelect}
      />
    );



    //---Submit Components---//
    /* ---------------------------------------- */
    /* ---------------------------------------- */

    // Runs Cabin Submit loop, confirms cabin data and submits
    async function SubmitLoop() {
      if (await ConfirmCabinData()) {
        await TimezoneOffset();
        await CabinSubmit();
      }
    }

    // Check cabin data
    const ConfirmCabinData = async () => {
      let newCheck = this.state.formBool;
      this.setState({ alert: false });
      this.setState({ alertMessage: "" });

      // Check cabin name
      if (this.state.newCabinData.name !== "") {
        //console.log("pass");
        newCheck.name = true;
      }
      else {
        //console.log("fail");
        newCheck.name = false;
      }

      // Compare booking dates
      if (this.state.newCabinData.startDate < this.state.newCabinData.endDate) {
        //console.log("pass");
        newCheck.date = true;
      }
      else if (this.state.newCabinData.startDate > this.state.newCabinData.endDate) {
        //console.log("fail");
        newCheck.date = false;
      }

      // Check if userSlots are not empty and if they are locked
      console.log(this.state.newCabinData.slots.length);
      console.log(this.state.newCabinData.slots[0]);
      console.log(newCheck.slots);

      if (this.state.newCabinData.slots.length <= 1) {

        if (this.state.newCabinData.slots[0].userName !== "") {
          if (this.state.newCabinData.slots[0].locked) {
            newCheck.slots = true;
          }
          else {
            newCheck.slots = false;
          }
        }
        else {
          if (!newCheck.slots) {
            newCheck.slots = true;
          }
        }
      }
      else {
        for (let index = 0; index < this.state.newCabinData.slots.length; index++) {
          if (this.state.newCabinData.slots[index].userName !== "") {
            if (this.state.newCabinData.slots[index].locked) {
              newCheck.slots = true;
            }
            else {
              newCheck.slots = false;
            }
          }
        }
      }


      if (Object.values(newCheck).includes(false)) {
        this.setState({ alert: true });
        this.setState({ formError: `${styles.error}` })
        setTimeout(() => this.setState({ formError: "" }), 300);

        this.setState({ formBool: newCheck })
        return false;
      }
      else {
        return true;
      }
    }

    // Apply Timezone offset UTC+2
    const TimezoneOffset = async () => {
      // Store current dates in the variables, for use in Submit if it fails
      this.setState({ storedStartDate: this.state.newCabinData.startDate })
      this.setState({ storedEndDate: this.state.newCabinData.endDate })

      // Dates which are run through in the for loop
      const dates = [[this.state.newCabinData.startDate, "startDate"], [this.state.newCabinData.endDate, "endDate"]];

      // Set Timezone offset to canbin data
      for (let index = 0; index < dates.length; index++) {
        var newDate = new Date(dates[index][0]);
        newDate = new Date(newDate.getTime() + newDate.getTimezoneOffset() * (2 * (-30 * 1000)));
        newDate = newDate.toISOString();
        SetPrevState(newDate, dates[index][1]);
      }
    }

    // Submit Cabin data to MongoDB
    const CabinSubmit = async () => {
      if (!this.state.updateBool) {
        CreateCabin(this.state.newCabinData).then(response => {
          if (response.success)
            CloseDrawer();
          else {
            SetPrevState(this.state.storedStartDate, "startDate")
            SetPrevState(this.state.storedEndDate, "endDate")
            BackEndError(response.error);
          }
        });
      }
      // Update already existing cabin
      if (this.state.updateBool) {
        UpdateCabin(this.state.newCabinData).then(response => {
          if (response)
            CloseDrawer();
          else {
            SetPrevState(this.state.storedStartDate, "startDate")
            SetPrevState(this.state.storedEndDate, "endDate")
            BackEndError(response.error);
          }
        });
      }
    }

    // Displays back end errors in alert messages
    const BackEndError = (error) => {
      this.setState({ alert: true });
      this.setState({ alertMessage: error });
    }



    //---Set Data Components---//
    /* ---------------------------------------- */
    /* ---------------------------------------- */

    const SetPrevState = (value, parameter) => {
      this.setState(prevState => ({
        newCabinData: {
          ...prevState.newCabinData,
          [parameter]: value
        }
      }));
    }

    const SetState = (value, parameter) => {
      this.setState({
        newCabinData: {
          ...this.state.newCabinData,
          [parameter]: value
        }
      });
    }


    //---Page---//
    // return
    return (
      <Container fluid className={styles.containerBackground} >
        {/* Remove Cabin Popup */}
        <Modal style={{ marginTop: "30vh" }} show={this.state.deletePopup} onHide={() => this.setState({ deletePopup: !this.state.deletePopup })}>
          <Modal.Header closeButton>
            <Modal.Title>Warning</Modal.Title>
          </Modal.Header>
          <Modal.Body>You are about to delete cabin are you sure you want to continue ?</Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.setState({ deletePopup: !this.state.deletePopup })} variant="danger">
              Cancel
            </Button>
            <Button onClick={() => DeleteCard()} variant="success">
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
        <Col className={styles.headerBackground2} />
        <Col className={styles.header2} >
          <Title topText={"List 01"} bottomText={"--------"} />
        </Col>
        <Row style={{ padding: "0", margin: "0", height: "20.5vh", width: "100%" }}>
          <DrawerButton handleClick={() => OpenDrawer(false, undefined)} image={Images.plusSign} text={"ADD CABIN"} paddingTop={"60px"} />
          <DrawerButton handleClick={() => { this.setState({ deleteState: !this.state.deleteState }) }} image={Images.minusSign} text={"REMOVE CABIN"} paddingTop={"60px"} />
        </Row>
        <Container className='p-3'>
          <Row>
            <Col className='col-12 mx-auto mb-5' style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
              <Form.Control style={{ width: "95%", backgroundColor: "white", borderRadius: "10px" }} type="text" name="searchBar" placeholder="Search cabin"
                value={this.state.search}
                onChange={(event) => this.setState({ search: event.target.value })} />
            </Col>
            <Col className='col-5 mx-auto' style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
              <Form.Select
                value={this.state.category}
                onChange={(event) => this.setState({ category: event.target.value })}
              >
                {!this.state.isLoading ?
                  <>
                    {this.state.cabins.map((cabinData, index) => {
                      return (
                        <option key={index} value={index}>{cabinData[0].title}</option>
                      )
                    })}
                  </>
                  : null
                }
              </Form.Select>
            </Col>
          </Row>
        </Container>
        <CabinCards />
        <Col className={this.state.drawerOpen ? `${styles.wrapperOpen} ${styles.wrapper} ` : `${styles.wrapper} `}>
          <Col>
            <Container>
              <ToastContainer style={{ left: "50%", top: "50%", transform: "translate(-50%, 0px)", position: "fixed" }}>
                <Toast
                  autohide="true"
                  show={this.state.alert}
                  className={this.state.formError}
                  style={{ backgroundColor: "red" }}
                  onClose={() => { this.setState({ alert: false }) }}
                >
                  <Toast.Header>
                    <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                    <strong className="me-auto">Error</strong>
                  </Toast.Header>
                  {this.state.alertMessage !== "" ?
                    <Toast.Body >- {this.state.alertMessage}</Toast.Body>
                    : null
                  }
                  {!this.state.formBool.name ?
                    <Toast.Body >- Cabin name is missing</Toast.Body>
                    : null
                  }
                  {!this.state.formBool.date ?
                    <Toast.Body >- Date set incorrectly</Toast.Body>
                    : null
                  }
                  {!this.state.formBool.slots ?
                    <Toast.Body >- User with given name not found</Toast.Body>
                    : null
                  }
                </Toast>
              </ToastContainer>
              <Col style={{ marginTop: "70px" }}>
                <DrawerButton style={{ marginTop: "70px" }}
                  image={Images.arrowDown} text={""}
                  handleClick={() => CloseDrawer()}
                />
              </Col>
              <Form.Label className="text-center" style={{ color: "whitesmoke", justifyContent: "center", alignItems: "center", display: "flex", paddingTop: "4vh" }}>CABIN</Form.Label>
              <Form.Label style={{ color: "whitesmoke", paddingTop: "2vh" }}>Name:</Form.Label>
              <Form.Control
                type="name"
                isInvalid={!this.state.formBool.name}
                placeholder="Cabin name"
                value={this.state.newCabinData.name}
                onChange={(event) => SetPrevState(event.target.value.toUpperCase(), "name")}
              />
              <Form.Control.Feedback type="invalid">
                Name is required
              </Form.Control.Feedback>
              <Col className="mx-auto text-center mt-5" style={{ backgroundColor: "whitesmoke", width: "´80vw", height: "0.2vh" }} />
              <Col className="mx-auto text-center mt-4 mb-4" style={{ color: "whitesmoke", paddingTop: "2vh" }}>STATUS</Col>
              <Form.Label style={{ color: "whitesmoke", width: "100%", marginTop: "2vh", marginBottom: "8vh" }}
                className={
                  Number(this.state.newCabinData.status) === 1 ? "Free" : "" ||
                    Number(this.state.newCabinData.status) === 2 ? "Booked" : "" ||
                      Number(this.state.newCabinData.status) === 3 ? "Dirty" : "" ||
                        Number(this.state.newCabinData.status) === 4 ? "Clean" : ""
                }
              >Status: {
                  Number(this.state.newCabinData.status) === 1 ? "Free" : "" ||
                    Number(this.state.newCabinData.status) === 2 ? "Booked" : "" ||
                      Number(this.state.newCabinData.status) === 3 ? "Dirty" : "" ||
                        Number(this.state.newCabinData.status) === 4 ? "Clean" : ""
                }
              </Form.Label>
              <Row>
                <Col className="col-1" />
                <StatusGroup />
                <Col className="col-1" />
              </Row>
              <Col className="mx-auto text-center mt-5" style={{ backgroundColor: "whitesmoke", width: "´80vw", height: "0.2vh" }} />
              <Col className="col-12" style={{ padding: "auto", margin: "auto" }}>
                <Form.Label style={{ color: "whitesmoke", paddingTop: "4vh" }}>Arrival Date:</Form.Label>
                <Form.Control style={{ color: "black" }}
                  value={this.state.newCabinData.startDate.slice(0, 16)}
                  type="datetime-local"
                  isInvalid={!this.state.formBool.date}
                  onChange={(event) => SetPrevState(event.target.value, "startDate")}
                />
                <Form.Control.Feedback type="invalid">
                  Wrong date
                </Form.Control.Feedback>
              </Col>
              <Col className="col-12" style={{ padding: "auto", margin: "auto" }}>
                <Form.Label style={{ color: "whitesmoke", paddingTop: "4vh" }}>Departure Date:</Form.Label>
                <Form.Control style={{ color: "black" }}
                  value={this.state.newCabinData.endDate.slice(0, 16)}
                  type="datetime-local"
                  isInvalid={!this.state.formBool.date}
                  onChange={(event) => SetPrevState(event.target.value, "endDate")}
                />
              </Col>
              <Form.Label style={{ color: "whitesmoke", paddingTop: "8vh" }}>Occupant:</Form.Label>
              <Form.Control value={this.state.newCabinData.occupant} type="name" placeholder="Occupant" onChange={(event) => SetPrevState(event.target.value, "occupant")} />
            </Container>
            <SlotButtons />
            {AssignUserComponent}
            <Row className='mx-auto' style={{ marginTop: "10vh", marginBottom: "5vh" }}>
              <Col className="col-1" />
              <Col className="col-5" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Button className="text-center" variant="danger" type="submit"
                  onClick={() => CloseDrawer()} >
                  Cancel
                </Button>
              </Col>
              <Col className="col-5" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Button className="text-center" variant="success" type="submit"
                  onClick={() => SubmitLoop()}
                >
                  Submit
                </Button>
              </Col>
              <Col className="col-1" />
            </Row>
          </Col>
        </Col>
      </Container >
    );
  }
}


//---Page---//
// export
export default withParams(Cabins);
