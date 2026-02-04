import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

function Header() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Navbar
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/Home">
              Home
            </Nav.Link>
             <Nav.Link as={Link} to="/Addproduct">
              Addproduct
            </Nav.Link>

            <Nav.Link as={Link} to="/Login">
              Login
            </Nav.Link>

            <Nav.Link as={Link} to="/Update">
              Update
            </Nav.Link>
            <Nav.Link as={Link} to="/Register">
            Register
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
