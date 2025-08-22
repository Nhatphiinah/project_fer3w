/*
 * Assignment create by Group 2
 */
import { useState, useEffect, useContext } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { getStories, updateStories } from "../../utils/storyService.js";
import commentList from "../../data/comments.json";
import Comments from "../../components/features/Comments.js";

const StoryDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stories, setStories] = useState([]);
  const [story, setStory] = useState(null);
  const [viewCount, setViewCount] = useState(0); // Giá trị ban đầu sẽ được set từ localStorage
  const [commentCount, setCommentCount] = useState(0); // Giá trị ban đầu sẽ được set từ localStorage
  const [isFavorite, setIsFavorite] = useState(false);

  // Lấy danh sách truyện và bình luận từ localStorage
  const fetchData = () => {
    const storiesFromLocal = getStories();
    setStories(storiesFromLocal);

    const foundStory = storiesFromLocal.find((s) => s.id.toString() === id);
    if (foundStory) {
      setStory(foundStory);
      setViewCount(foundStory.viewCount || 0); // Set giá trị ban đầu cho viewCount
      setCommentCount(foundStory.commentCount || 0); // Set giá trị ban đầu cho commentCount

      // Tính tổng số bình luận (từ comments.json và localStorage)
      const storedComments = localStorage.getItem("comments");
      const localComments = storedComments ? JSON.parse(storedComments) : [];
      const combinedComments = [...commentList.comments, ...localComments];
      const uniqueComments = Array.from(
        new Map(
          combinedComments.map((comment) => [comment.id, comment])
        ).values()
      );
      const storyComments = uniqueComments.filter(
        (comment) => comment.storyId && comment.storyId.toString() === id
      );
      // Cập nhật commentCount trong localStorage nếu không khớp
      if (foundStory.commentCount !== storyComments.length) {
        const updatedStories = storiesFromLocal.map((s) =>
          s.id.toString() === id
            ? { ...s, commentCount: storyComments.length }
            : s
        );
        setCommentCount(storyComments.length);
        updateStories(updatedStories);
      }
    }
  };

  // Lấy dữ liệu ban đầu
  useEffect(() => {
    fetchData();
  }, [id]);

  // Đồng bộ dữ liệu khi localStorage thay đổi
  useEffect(() => {
    const handleStorageChange = () => {
      fetchData();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [id]);

  // Kiểm tra trạng thái yêu thích
  useEffect(() => {
    if (user) {
      const storedFavorites = localStorage.getItem("favorites");
      const favorites = storedFavorites ? JSON.parse(storedFavorites) : {};
      const userFavorites = favorites[user.username] || [];
      setIsFavorite(userFavorites.includes(parseInt(id)));
    }
  }, [id, user]);

  const handleFavoriteClick = () => {
    if (!user) {
      alert("Please login to add this story to favorites!");
      return;
    }

    const storedFavorites = localStorage.getItem("favorites");
    const favorites = storedFavorites ? JSON.parse(storedFavorites) : {};
    const userFavorites = favorites[user.username] || [];

    if (isFavorite) {
      const updatedUserFavorites = userFavorites.filter(
        (storyId) => storyId !== parseInt(id)
      );
      favorites[user.username] = updatedUserFavorites;
      setIsFavorite(false);
    } else {
      favorites[user.username] = [...userFavorites, parseInt(id)];
      setIsFavorite(true);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  // Tăng viewCount khi nhấn "Read Now" (chỉ khi user đã đăng nhập)
  const handleReadNowClick = () => {
    if (!user) {
      alert("Please login to read this story!");
      navigate("/login");
      return;
    }

    const sessionKey = `viewed_${id}_${user.username}`; // Thêm username để mỗi user chỉ tăng view 1 lần
    const hasViewed = sessionStorage.getItem(sessionKey);

    if (!hasViewed) {
      const updatedViewCount = (viewCount || 0) + 1;
      const updatedStories = stories.map((s) =>
        s.id.toString() === id ? { ...s, viewCount: updatedViewCount } : s
      );
      setStories(updatedStories);
      updateStories(updatedStories);
      setViewCount(updatedViewCount);
      sessionStorage.setItem(sessionKey, "true");
    }

    navigate(`/stories/read/${id}`);
  };

  // Lấy danh sách bình luận từ comments.json trước, sau đó gộp với localStorage
  const storedComments = localStorage.getItem("comments");
  const localComments = storedComments ? JSON.parse(storedComments) : [];
  const combinedComments = [...commentList.comments, ...localComments];
  const uniqueComments = Array.from(
    new Map(combinedComments.map((comment) => [comment.id, comment])).values()
  );
  const comments = uniqueComments
    .filter((comment) => comment.storyId && comment.storyId.toString() === id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!story) {
    return (
      <Container className="my-5 text-center">
        <h3 className="text-danger opacity-75">Story not found!</h3>
      </Container>
    );
  }

  return (
    <Container className="justify-content-center">
      <Row>
        <Col md={6}>
          <img
            src={story.coverImage}
            alt=""
            className="rounded-2 shadow-sm"
            style={{ width: "350px", height: "100%" }}
          />
        </Col>
        <Col md={4} className="mt-5 text-start">
          <Card.Body>
            <Card.Title className="text-danger mb-3 opacity-75">
              <h1>{story.title}</h1>
            </Card.Title>
            <Card.Text>
              <h6 className="text-muted">
                <strong>Genre: </strong>
                {story.genre}
              </h6>
            </Card.Text>
            <Card.Text>
              <h6 className="text-muted">
                <strong>Author: </strong>
                {story.author}
              </h6>
            </Card.Text>
            <Card.Text>
              <h6 className="text-muted">
                <strong>View: </strong>
                {viewCount}
              </h6>
            </Card.Text>
            <Card.Text>
              <h6 className="text-muted">
                <strong>Comments: </strong>
                {commentCount}
              </h6>
            </Card.Text>
            <div className="d-flex align-items-center">
              <Button
                className="mt-2 read-now-btn me-2"
                onClick={handleReadNowClick}
              >
                Read Now
              </Button>
              <Button
                variant="outline-danger"
                className="mt-2"
                onClick={handleFavoriteClick}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: "5px",
                }}
              >
                <FaHeart size={24} color={isFavorite ? "red" : "gray"} />
              </Button>
            </div>
          </Card.Body>
        </Col>
      </Row>
      <Row>
        <Col className="mt-4">
          <h3>Comment</h3>
        </Col>
      </Row>
      <Comments
        commentList={comments}
        storyId={parseInt(id)}
        setCommentCount={setCommentCount}
      />
    </Container>
  );
};

export default StoryDetail;
