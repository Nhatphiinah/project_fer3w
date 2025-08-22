/*
 * Assignment create by Group 2
 */
import { useState, useContext } from "react";
import { Card, Col, Row, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Comments = ({ commentList, storyId, setCommentCount }) => {
  const [comments, setComments] = useState(commentList || []);
  const [newComment, setNewComment] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { user } = useContext(AuthContext);

  // Xử lý khi người dùng nhấp vào nút "Comment"
  const handleCommentClick = () => {
    if (!user) {
      setAlertMessage(
        <span>
          Please{" "}
          <Link to="/login" className="text-danger text-decoration-none">
            Login
          </Link>{" "}
          to comment!
        </span>
      );
      setShowCommentForm(false);
    } else {
      setAlertMessage("");
      setShowCommentForm(true);
    }
  };

  // Xử lý khi người dùng gửi bình luận
  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      alert("Vui lòng nhập nội dung bình luận!");
      return;
    }

    // Tạo bình luận mới
    const newCommentObj = {
      id: comments.length > 0 ? Math.max(...comments.map((c) => c.id)) + 1 : 1,
      storyId: storyId,
      username: user.username,
      content: newComment,
      date: new Date().toISOString().split("T")[0],
    };

    // Lấy toàn bộ danh sách bình luận từ localStorage
    const storedComments = localStorage.getItem("comments");
    const allComments = storedComments ? JSON.parse(storedComments) : [];

    // Thêm bình luận mới vào danh sách tất cả bình luận
    const updatedAllComments = [...allComments, newCommentObj];

    // Lưu toàn bộ danh sách bình luận vào localStorage
    localStorage.setItem("comments", JSON.stringify(updatedAllComments));

    // Kết hợp lại danh sách bình luận từ commentList và localStorage
    const combinedComments = [...(commentList || []), ...updatedAllComments];

    // Loại bỏ trùng lặp dựa trên id
    const uniqueComments = Array.from(
      new Map(combinedComments.map((comment) => [comment.id, comment])).values()
    );

    // Lọc bình luận theo storyId và sắp xếp theo ngày (mới nhất trước)
    const updatedComments = uniqueComments
      .filter((comment) => comment.storyId === storyId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Cập nhật state để re-render danh sách bình luận
    setComments(updatedComments);

    // Cập nhật commentCount
    const storedCounts = localStorage.getItem("storyCounts");
    const storyCounts = storedCounts ? JSON.parse(storedCounts) : {};
    const currentCommentCount = storyCounts[storyId]?.commentCount || 0;
    const updatedCommentCount = currentCommentCount + 1;

    // Cập nhật storyCounts trong localStorage
    const updatedStoryCounts = {
      ...storyCounts,
      [storyId]: {
        viewCount: storyCounts[storyId]?.viewCount || 0,
        commentCount: updatedCommentCount,
      },
    };
    localStorage.setItem("storyCounts", JSON.stringify(updatedStoryCounts));

    // Cập nhật commentCount trong StoryDetail
    setCommentCount(updatedCommentCount);

    // Reset form và đóng ô nhập
    setNewComment("");
    setShowCommentForm(false);
  };

  // Xử lý khi người dùng hủy nhập bình luận
  const handleCancelComment = () => {
    setNewComment("");
    setShowCommentForm(false);
  };

  // Kiểm tra nếu không có bình luận
  if (!comments || comments.length === 0) {
    return (
      <>
        <Row className="mb-3">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="text-muted">Comments</h5>
              <Button
                variant="outline-primary"
                className="read-now-btn"
                onClick={handleCommentClick}
              >
                Comment
              </Button>
            </div>
          </Col>
        </Row>
        {alertMessage && (
          <Row className="mb-3">
            <Col>
              <Alert variant="warning" className="text-center">
                {alertMessage}
              </Alert>
            </Col>
          </Row>
        )}
        {showCommentForm && (
          <Row className="mb-3">
            <Col>
              <Form onSubmit={handleSubmitComment}>
                <Form.Group controlId="newComment">
                  <Form.Label className="text-muted">
                    <strong>Your comment:</strong>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your comment here..."
                    className="shadow-sm"
                  />
                </Form.Group>
                <div className="d-flex justify-content-end mt-2">
                  <Button
                    variant="outline-secondary"
                    className="me-2"
                    onClick={handleCancelComment}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outline-primary"
                    type="submit"
                    className="read-now-btn"
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        )}
        <Row>
          <Col>
            <p className="text-muted text-center">No comments available.</p>
          </Col>
        </Row>
      </>
    );
  }

  return (
    <>
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="text-muted">Comments</h5>
            <Button
              variant="outline-primary"
              className="read-now-btn"
              onClick={handleCommentClick}
            >
              Comment
            </Button>
          </div>
        </Col>
      </Row>
      {alertMessage && (
        <Row className="mb-3">
          <Col>
            <Alert variant="warning" className="text-center">
              {alertMessage}
            </Alert>
          </Col>
        </Row>
      )}
      {showCommentForm && (
        <Row className="mb-3">
          <Col>
            <Form onSubmit={handleSubmitComment}>
              <Form.Group controlId="newComment">
                <Form.Label className="text-muted">
                  <strong>Your comment:</strong>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your comment here..."
                  className="shadow-sm"
                />
              </Form.Group>
              <div className="d-flex justify-content-end mt-2">
                <Button
                  variant="outline-secondary"
                  className="me-2"
                  onClick={handleCancelComment}
                >
                  Cancel
                </Button>
                <Button
                  variant="outline-primary"
                  type="submit"
                  className="read-now-btn"
                >
                  Submit
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      )}
      {comments.map((comment) => (
        <Row key={comment.id}>
          <Col>
            <Card className="mt-3 bg-secondary bg-opacity-25">
              <Card.Body>
                <Row>
                  <Col className="text-start">
                    <Card.Text className="text-danger title-text">
                      <h5>{comment.username}</h5>
                    </Card.Text>
                    <Card.Text>{comment.content}</Card.Text>
                  </Col>
                  <Col className="text-end text-muted">
                    <Card.Text>{comment.date}</Card.Text>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ))}
    </>
  );
};

export default Comments;
