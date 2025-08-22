/*
 * Assignment create by Group 2
 */
import { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa"; // Thêm biểu tượng xóa và sửa
import { AuthContext } from "../context/AuthContext";
import storyList from "../data/stories.json";

const Profile = () => {
  const { user } = useContext(AuthContext); // Lấy thông tin người dùng từ AuthContext
  const [favorites, setFavorites] = useState([]); // Danh sách truyện yêu thích

  // Lấy danh sách truyện yêu thích từ localStorage khi trang được tải
  useEffect(() => {
    if (user) {
      const storedFavorites = localStorage.getItem("favorites");
      const favoritesData = storedFavorites ? JSON.parse(storedFavorites) : {};
      const userFavorites = favoritesData[user.username] || [];
      setFavorites(userFavorites);
    }
  }, [user]);

  // Xử lý xóa truyện khỏi danh sách yêu thích
  const handleRemoveFavorite = (storyId) => {
    const storedFavorites = localStorage.getItem("favorites");
    const favoritesData = storedFavorites ? JSON.parse(storedFavorites) : {};

    // Lọc bỏ truyện có storyId khỏi danh sách yêu thích
    const updatedUserFavorites = favorites.filter((id) => id !== storyId);
    favoritesData[user.username] = updatedUserFavorites;

    // Lưu lại vào localStorage
    localStorage.setItem("favorites", JSON.stringify(favoritesData));

    // Cập nhật state để re-render
    setFavorites(updatedUserFavorites);
  };

  // Lấy thông tin truyện từ storyList dựa trên storyId
  const getStoryById = (storyId) => {
    return storyList.stories.find((story) => story.id === storyId);
  };

  if (!user) {
    return (
      <Container className="my-5 text-center">
        <h3>PLease Login to view your profile</h3>
        <Button as={Link} to="/login" variant="primary">
          Đăng nhập
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-center mb-4">
                <h2>Profile</h2>
              </Card.Title>
              <Row className="mb-4">
                <Col>
                  <h5>
                    <strong className="text-danger opacity-50">
                      Username:
                    </strong>{" "}
                    {user.username}
                  </h5>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h5>Favorites</h5>
                  {favorites.length === 0 ? (
                    <p className="text-muted text-center">
                      You have no favorite stories
                    </p>
                  ) : (
                    <ListGroup variant="flush">
                      {favorites.map((storyId) => {
                        const story = getStoryById(storyId);
                        if (!story) return null;

                        return (
                          <ListGroup.Item
                            key={storyId}
                            className="d-flex justify-content-between 
                            align-items-center border border-danger 
                            rounded-2 border-opacity-50 shadow-sm mb-2"
                          >
                            <div>
                              <Link
                                to={`/stories/${storyId}`}
                                className="text-decoration-none text-danger opacity-75 text-start"
                              >
                                <h6 className="mb-0">{story.title}</h6>
                              </Link>
                              <small className="text-muted ">
                                <strong>Author: </strong>
                                {story.author}
                              </small>
                            </div>
                            <div>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleRemoveFavorite(storyId)}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </ListGroup.Item>
                        );
                      })}
                    </ListGroup>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
