/*
 * Assignment create by Group 2
 */
import { useState } from "react";
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
import usersData from "../../data/users.json";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Kiểm tra thông tin đăng ký
    if (!username || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }
    // Lấy danh sách người dùng từ localStorage (nếu có)
    const storedUsers = localStorage.getItem("users");
    const localUsers = storedUsers ? JSON.parse(storedUsers) : [];

    // Kết hợp danh sách người dùng từ users.json và localStorage
    const allUsers = [...usersData.users, ...localUsers];

    // Kiểm tra xem username đã tồn tại chưa
    const existingUser = allUsers.find((u) => u.username === username);
    if (existingUser) {
      setError("Username already exists! Please choose another username.");
      return;
    }

    // Tạo người dùng mới
    const newUser = {
      username,
      password,
      favorites: [], // Danh sách yêu thích mặc định là rỗng
      role: "user", // Vai trò mặc định là user
    };

    // Mô phỏng lưu người dùng mới (vì không có backend)
    const updatedUsers = [...usersData.users, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Hiển thị thông báo thành công
    setSuccess("Sign up successful! Please Login.");

    // Chuyển hướng về trang đăng nhập sau 2 giây
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="text-danger mb-4 text-center title-text">
                Sign Up
              </h2>
              {error && (
                <Alert variant="danger" className="text-center">
                  {error}
                </Alert>
              )}
              {success && (
                <Alert variant="success" className="text-center">
                  {success}
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

                <Form.Group controlId="confirmPassword" className="mb-3">
                  <Form.Label className="text-muted">
                    <strong>Confirm password</strong>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="shadow-sm"
                  />
                </Form.Group>

                <Button
                  variant="outline-primary"
                  type="submit"
                  className="w-100 read-now-btn"
                >
                  Sign up
                </Button>
              </Form>
              <p className="text-center mt-3 text-muted">
                Have an Account?
                <Link to={"/login"} className="text-danger">
                  Login now
                </Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
