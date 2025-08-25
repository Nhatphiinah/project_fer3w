/*
 * Assignment create by Group 2
 */
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "../styles/components/header.css";
import { useContext } from "react";
import { GenreContext } from "../context/GenreContext";
import { AuthContext } from "../context/AuthContext";

const genres = [
  "Romance",
  "Detective / Mystery",
  "Horror",
  "Action",
  "Comedy",
  "Science Fiction (Sci-Fi)",
];

const Header = () => {
  const { setSelectedGenre } = useContext(GenreContext);
  const { user, logout } = useContext(AuthContext); // Lấy user và logout từ AuthContext
  const navigate = useNavigate();

  // Xử lý đăng xuất
  const handleLogout = () => {
    logout(); // Gọi hàm logout từ AuthContext
    navigate("/"); // Chuyển hướng về trang chủ sau khi đăng xuất
  };

  return (
    <Navbar expand="lg" className="custom-navbar mb-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="logo">
          <h3>ReadVerse</h3>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/stories"
              className="nav-link-custom"
              onClick={() => setSelectedGenre("All")}
            >
              All Stories
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/about"
              className="nav-link-custom"
            >
              About
            </Nav.Link>
            <NavDropdown
              title="Genre"
              id="genre-dropdown"
              className="nav-dropdown-custom"
            >
              {genres.map((genre, index) => (
                <NavDropdown.Item
                  key={index}
                  onClick={() => setSelectedGenre(genre)}
                  as={Link}
                  to="/stories"
                >
                  {genre}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>

          <Nav className="ms-auto">
            {user ? (
              <NavDropdown
                title={
                  <span>
                    <FaUserCircle size={24} className="me-1" />
                    {user.username}
                  </span>
                }
                id="user-dropdown"
                className="nav-dropdown-custom"
              >
                {user.role === "admin" ? (
                  <>
                    <NavDropdown.Item as={Link} to="/dashboard">
                      Dashboard
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={handleLogout}>
                      Logout
                    </NavDropdown.Item>
                  </>
                ) : (
                  <>
                    <NavDropdown.Item as={Link} to="/profile">
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={handleLogout}>
                      Logout
                    </NavDropdown.Item>
                  </>
                )}
              </NavDropdown>
            ) : (
              <NavDropdown
                title={
                  <span>
                    <FaUserCircle size={24} className="me-1" />
                  </span>
                }
                id="user-dropdown"
                className="nav-dropdown-custom"
              >
                <NavDropdown.Item as={Link} to="/login">
                  Login
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/signup">
                  Sign up
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
