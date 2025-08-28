/*
 * Assignment create by Group 1
 */
import { useState, useEffect, useContext } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { getStories } from "../../utils/storyService.js";
import Comments from "../../components/features/Comments.js";

const StoryDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stories, setStories] = useState([]);
  const [story, setStory] = useState(null);
  const [viewCount, setViewCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [readNowLoading, setReadNowLoading] = useState(false);

  // Lấy dữ liệu truyện và bình luận từ API
  const fetchData = async () => {
    try {
      setLoading(true);
      const storiesData = await getStories();
      setStories(storiesData);

      const foundStory = storiesData.find((s) => s.id.toString() === id);
      if (foundStory) {
        setStory(foundStory);
        setViewCount(foundStory.viewCount || 0);
        // Comment count sẽ được cập nhật sau khi fetch comments
      }
    } catch (error) {
      console.error('Error fetching story data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Lấy dữ liệu ban đầu
  useEffect(() => {
    fetchData();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Kiểm tra trạng thái yêu thích
  useEffect(() => {
    if (user) {
      const storedFavorites = localStorage.getItem("favorites");
      const favorites = storedFavorites ? JSON.parse(storedFavorites) : {};
      const userFavorites = favorites[user.username] || [];
      setIsFavorite(userFavorites.includes(parseInt(id)));
    }
  }, [id, user]);

  // Fetch comments when story changes
  useEffect(() => {
    const fetchComments = async () => {
      if (!story) return;

      try {
        setCommentsLoading(true);
        const response = await fetch(`http://localhost:5000/comments?storyId=${story.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const commentsData = await response.json();
        setComments(commentsData);
        setCommentCount(commentsData.length);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setComments([]);
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [story]);

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
  const handleReadNowClick = async () => {
    if (!user) {
      alert("Please login to read this story!");
      navigate("/login");
      return;
    }

    setReadNowLoading(true);
    const sessionKey = `viewed_${id}_${user.username}`;
    const hasViewed = sessionStorage.getItem(sessionKey);

    if (!hasViewed) {
      const updatedViewCount = (viewCount || 0) + 1;
      const updatedStories = stories.map((s) =>
        s.id.toString() === id ? { ...s, viewCount: updatedViewCount } : s
      );
      setStories(updatedStories);
      setViewCount(updatedViewCount);
      setStory((prev) => prev ? { ...prev, viewCount: updatedViewCount } : prev);
      sessionStorage.setItem(sessionKey, "true");

      // Gọi API cập nhật viewCount vào DB (JSON Server) và kiểm tra response
      try {
        const response = await fetch(`http://localhost:5000/stories/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ viewCount: updatedViewCount })
        });
        if (response.ok) {
          navigate(`/stories/read/${id}`);
        } else {
          alert("Lỗi cập nhật view, hãy thử lại!");
        }
      } catch (error) {
        alert("Lỗi kết nối server, hãy thử lại!");
      } finally {
        setReadNowLoading(false);
      }
    } else {
      setReadNowLoading(false);
      navigate(`/stories/read/${id}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Container className="my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading story...</p>
        </div>
      </Container>
    );
  }

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
            <Card.Title className="text-primary mb-3 opacity-75">
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
                disabled={readNowLoading}
              >
                {readNowLoading ? "Đang cập nhật..." : "Read Now"}
              </Button>
              <Button
                variant="outline-primary"
                className="mt-2"
                onClick={handleFavoriteClick}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: "5px",
                }}
              >
                <FaHeart size={24} color={isFavorite ? "#3b82f6" : "gray"} />
              </Button>
            </div>
          </Card.Body>
        </Col>
      </Row>
      <Row>
        <Col className="mt-4">
          <h3>Comments</h3>
          {commentsLoading ? (
            <div className="text-center my-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading comments...</span>
              </div>
              <p className="mt-2">Loading comments...</p>
            </div>
          ) : (
            <Comments
              commentList={comments}
              storyId={parseInt(id)}
              setCommentCount={setCommentCount}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default StoryDetail;
