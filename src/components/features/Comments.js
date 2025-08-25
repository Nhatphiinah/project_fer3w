/*
 * Assignment create by Group 2
 */
import { useState, useContext, useEffect } from "react";
import { Card, Col, Row, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Comments = ({ commentList, storyId, setCommentCount }) => {
  const [comments, setComments] = useState(commentList || []);
  const [newComment, setNewComment] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // Cập nhật comments khi commentList thay đổi
  useEffect(() => {
    setComments(commentList || []);
  }, [commentList]);

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
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      alert("Vui lòng nhập nội dung bình luận!");
      return;
    }

    setLoading(true);

    try {
      // Tạo bình luận mới
      const newCommentObj = {
        id: Date.now(), // Sử dụng timestamp làm ID
        storyId: parseInt(storyId),
        userId: user.id || 1, // Sử dụng user ID nếu có
        username: user.username,
        content: newComment,
        rating: 5, // Rating mặc định
        createdAt: new Date().toISOString()
      };

      // Thêm comment mới vào API (POST request)
      const response = await fetch('http://localhost:5000/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCommentObj),
      });

      if (!response.ok) {
        throw new Error('Failed to create comment');
      }

      const createdComment = await response.json();

      // Thêm comment mới vào state
      const updatedComments = [...comments, createdComment];
      setComments(updatedComments);

      // Cập nhật commentCount
      setCommentCount(updatedComments.length);

      // Reset form và đóng ô nhập
      setNewComment("");
      setShowCommentForm(false);

      // Hiển thị thông báo thành công
      alert('Comment added successfully!');
    } catch (error) {
      console.error('Error creating comment:', error);
      alert('Failed to create comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi người dùng hủy nhập bình luận
  const handleCancelComment = () => {
    setNewComment("");
    setShowCommentForm(false);
  };

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
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Posting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      )}

      {comments && comments.length > 0 ? (
        comments.map((comment) => (
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
                      <Card.Text>{new Date(comment.createdAt).toLocaleDateString()}</Card.Text>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ))
      ) : (
        <Row>
          <Col>
            <p className="text-muted text-center">No comments available.</p>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Comments;
