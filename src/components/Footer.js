/*
 * Assignment create by Group 2
 */
import { Col, Container, Nav, Navbar, Row } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/components/footer.css";
const Footer = () => {
  return (
    <Navbar className="d-grid justify-content-center custom-footer mt-5">
      <Container>
        <Row>
          <Col>
            <Nav className="mx-auto">
              <Nav.Link as={Link} to="/about" className="nav-link-custom">
                About Us
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" className="nav-link-custom">
                Contact
              </Nav.Link>
              <Nav.Link as={Link} to="/privacy" className="nav-link-custom">
                Privacy Policy
              </Nav.Link>
            </Nav>
          </Col>
        </Row>

        <Row>
          <Col>
            <Nav className="ms-auto social-links">
              <Nav.Link
                href="https://facebook.com"
                target="_blank"
                className="social-link"
              >
                <FaFacebook size={24} />
              </Nav.Link>
              <Nav.Link
                href="https://twitter.com"
                target="_blank"
                className="social-link"
              >
                <FaTwitter size={24} />
              </Nav.Link>
              <Nav.Link
                href="https://instagram.com"
                target="_blank"
                className="social-link"
              >
                <FaInstagram size={24} />
              </Nav.Link>
            </Nav>
          </Col>
        </Row>
      </Container>

      <Row>
        <Col>
          <div className="text-center w-100 copyright mt-3">
            <p>
              &copy; {new Date().getFullYear()} Read Verse. All Rights Reserved.
            </p>
          </div>
        </Col>
      </Row>
    </Navbar>
  );
};

export default Footer;
