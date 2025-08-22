/*
 * Assignment create by Group 2
 */
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Card,
} from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import usersData from "../../data/users.json";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Lấy danh sách người dùng từ localStorage (nếu có)
    const storedUsers = localStorage.getItem("users");
    const localUsers = storedUsers ? JSON.parse(storedUsers) : [];

    // Kết hợp danh sách người dùng từ users.json và localStorage
    const allUsers = [...usersData.users, ...localUsers];

    // Kiểm tra thông tin đăng nhập
    const user = allUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      // Đăng nhập thành công
      login(user);
      navigate("/");
    } else {
      // Đăng nhập thất bại
      setError("Invalid username or password !");
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="text-danger mb-4 text-center title-text">Login</h2>
              {error && (
                <Alert variant="danger" className="text-center">
                  {error}
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username" className="mb-3">
                  <Form.Label className="text-muted">
                    <strong>Username</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="shadow-sm"
                  />
                </Form.Group>

                <Form.Group controlId="password" className="mb-3">
                  <Form.Label className="text-muted">
                    <strong>Password</strong>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="shadow-sm"
                  />
                </Form.Group>

                <Button
                  variant="outline-primary"
                  type="submit"
                  className="w-100 read-now-btn"
                >
                  Sign in
                </Button>
              </Form>
              <p className="text-center mt-3 text-muted">
                Don't have an account?
                <Link to={"/signup"} className="text-danger">
                  Sign up now
                </Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
