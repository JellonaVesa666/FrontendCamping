//---React---//
// import
import { useNavigate } from "react-router-dom";


//---Bootstrap---//
// import
import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";


//---Controller---//
// import
import { Logout, IsAuthenticated } from "../controllers/authController"


//---Component---//
// Initialize
const Header = () => {
  const navigate = useNavigate();

  const NavigationLinks = () => {
    if (!IsAuthenticated()) {
      return (
        <Nav>
          <LinkContainer to="/">
            <Nav.Link>Login</Nav.Link>
          </LinkContainer>
        </Nav>
      )
    } else {
      return (
        <Nav>
          <Nav.Link onClick={() => Logout(() => { navigate("/") })}>Logout</Nav.Link>
        </Nav>
      )
    }
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top">
      <Container>
        {IsAuthenticated() ?
          <LinkContainer to="/adminhome">
            <Navbar.Brand>Home</Navbar.Brand>
          </LinkContainer>
          :
          <LinkContainer to="/">
            <Navbar.Brand>Home</Navbar.Brand>
          </LinkContainer>
        }
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto" />
          {NavigationLinks()}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}


//---Component---//
// export
export default Header;