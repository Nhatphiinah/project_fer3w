/*
 * Assignment create by Group 2
 */
import { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { getStories, updateStories } from "../../utils/storyService.js";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stories, setStories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStoryId, setCurrentStoryId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    coverImage: "",
    pdfUrl: "",
    viewCount: 0,
    commentCount: 0,
  });

  useEffect(() => {
    const storiesFromLocal = getStories();
    setStories(storiesFromLocal);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle PDF file selection
  const handlePdfFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const fileName = file.name;
      const pdfUrl = `/pdf/${fileName}`;
      setFormData({ ...formData, pdfUrl });
    } else {
      alert("Please select a PDF file!");
    }
  };

  // Handle cover image file selection
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const fileName = file.name;
      const coverImage = `/assets/img/${fileName}`;
      setFormData({ ...formData, coverImage });
    } else {
      alert("Please select an image file (jpg, png, etc.)!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newStory = {
      ...formData,
      id: isEditing
        ? currentStoryId
        : stories.length > 0
        ? Math.max(...stories.map((s) => s.id)) + 1
        : 1,
      viewCount: isEditing ? formData.viewCount : 0,
      commentCount: isEditing ? formData.commentCount : 0,
    };

    let updatedStories;
    if (isEditing) {
      updatedStories = stories.map((story) =>
        story.id === currentStoryId ? newStory : story
      );
    } else {
      updatedStories = [...stories, newStory];
    }

    setStories(updatedStories);
    updateStories(updatedStories);

    setShowModal(false);
    setIsEditing(false);
    setCurrentStoryId(null);
    setFormData({
      title: "",
      author: "",
      genre: "",
      coverImage: "",
      pdfUrl: "",
      viewCount: 0,
      commentCount: 0,
    });
  };

  const handleEdit = (story) => {
    setIsEditing(true);
    setCurrentStoryId(story.id);
    setFormData({
      title: story.title,
      author: story.author,
      genre: story.genre,
      coverImage: story.coverImage || "",
      pdfUrl: story.pdfUrl || "",
      viewCount: story.viewCount,
      commentCount: story.commentCount,
    });
    setShowModal(true);
  };

  const handleDelete = (storyId) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      const updatedStories = stories.filter((story) => story.id !== storyId);
      setStories(updatedStories);
      updateStories(updatedStories);
    }
  };

  if (!user) {
    return (
      <Container className="my-5 text-center">
        <h3 className="text-danger opacity-75">
          Please login to access this page!
        </h3>
        <Button
          onClick={() => navigate("/login")}
          variant="primary"
          className="read-now-btn text-white"
        >
          Login
        </Button>
      </Container>
    );
  }

  if (user.role === "user") {
    return (
      <Container className="my-5 text-center">
        <h3 className="text-danger opacity-75">
          You do not have permission to manage stories!
        </h3>
        <Button
          onClick={() => navigate("/")}
          variant="primary"
          className="read-now-btn text-white"
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid className="my-5">
      <Row className="justify-content-center pt-3 mb-3">
        <Col>
          <h2 className="text-danger opacity-75 text-center">
            Dashboard - Manage Stories
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={10}>
          <div className="d-flex justify-content-end mb-3">
            <Button
              variant="primary"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  title: "",
                  author: "",
                  genre: "",
                  coverImage: "",
                  pdfUrl: "",
                  viewCount: 0,
                  commentCount: 0,
                });
                setShowModal(true);
              }}
              className="read-now-btn text-white"
            >
              Add Story
            </Button>
          </div>

          {stories.length === 0 ? (
            <p className="text-center text-muted">No stories available.</p>
          ) : (
            <Table striped bordered hover responsive className="shadow-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stories.map((story) => (
                  <tr key={story.id}>
                    <td>{story.id}</td>
                    <td>{story.title}</td>
                    <td>{story.author}</td>
                    <td>{story.genre}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEdit(story)}
                        className="me-2"
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(story.id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton className="border-0">
              <Modal.Title className="text-danger opacity-75">
                {isEditing ? "Edit Story" : "Add Story"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formAuthor">
                  <Form.Label>Author</Form.Label>
                  <Form.Control
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGenre">
                  <Form.Label>Genre</Form.Label>
                  <Form.Control
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formCoverImageFile">
                  <Form.Label>Select Cover Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    required={!isEditing || !formData.coverImage}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formCoverImage">
                  <Form.Label>Cover Image URL (Auto-generated)</Form.Label>
                  <Form.Control
                    type="text"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleInputChange}
                    placeholder="Cover image URL will be auto-generated (e.g., /assets/cover.jpg)"
                    readOnly
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPdfFile">
                  <Form.Label>Select PDF File</Form.Label>
                  <Form.Control
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfFileChange}
                    required={!isEditing || !formData.pdfUrl}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPdfUrl">
                  <Form.Label>PDF URL (Auto-generated)</Form.Label>
                  <Form.Control
                    type="text"
                    name="pdfUrl"
                    value={formData.pdfUrl}
                    onChange={handleInputChange}
                    placeholder="PDF URL will be auto-generated (e.g., /assets/abc.pdf)"
                    readOnly
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="read-now-btn text-white"
                >
                  {isEditing ? "Update" : "Add"}
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
