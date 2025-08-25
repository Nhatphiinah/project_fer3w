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
  Nav,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { getStories } from "../../utils/storyService.js";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stories, setStories] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStoryId, setCurrentStoryId] = useState(null);
  const [currentContact, setCurrentContact] = useState(null);
  const [activeTab, setActiveTab] = useState("stories");
  const [storyLoading, setStoryLoading] = useState(false);
  const [deletingStoryId, setDeletingStoryId] = useState(null);
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
    const fetchData = async () => {
      try {
        const storiesData = await getStories();
        setStories(storiesData);

        // Fetch contacts
        console.log('Fetching contacts from: http://localhost:5000/contacts');
        const contactsResponse = await fetch('http://localhost:5000/contacts');
        console.log('Contacts response status:', contactsResponse.status);
        console.log('Contacts response ok:', contactsResponse.ok);

        if (contactsResponse.ok) {
          const contactsData = await contactsResponse.json();
          console.log('Contacts data:', contactsData);
          setContacts(contactsData);
        } else {
          const errorText = await contactsResponse.text();
          console.error('Failed to fetch contacts:', contactsResponse.status, contactsResponse.statusText, errorText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStoryLoading(true);

    try {
      const storyData = {
        ...formData,
        viewCount: isEditing ? formData.viewCount : 0,
        commentCount: isEditing ? formData.commentCount : 0,
      };

      // Nếu đang edit và không có file mới, giữ nguyên giá trị cũ
      if (isEditing) {
        const currentStory = stories.find(s => s.id === currentStoryId);
        if (currentStory) {
          if (!formData.coverImage || formData.coverImage === '') {
            storyData.coverImage = currentStory.coverImage;
          }
          if (!formData.pdfUrl || formData.pdfUrl === '') {
            storyData.pdfUrl = currentStory.pdfUrl;
          }
        }
      }

      let response;
      if (isEditing) {
        // Update existing story
        console.log('Updating story with ID:', currentStoryId);
        console.log('Story data to update:', storyData);
        response = await fetch(`http://localhost:5000/stories/${currentStoryId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(storyData),
        });
      } else {
        // Create new story
        console.log('Creating new story');
        console.log('Story data to create:', storyData);
        response = await fetch('http://localhost:5000/stories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(storyData),
        });
      }

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const savedStory = await response.json();
        console.log('Saved story response:', savedStory);

        if (isEditing) {
          // Update local state for editing
          const updatedStories = stories.map((story) =>
            story.id === currentStoryId ? savedStory : story
          );
          setStories(updatedStories);
        } else {
          // Add new story to local state
          setStories([...stories, savedStory]);
        }

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

        alert(isEditing ? 'Story updated successfully!' : 'Story added successfully!');
      } else {
        const errorText = await response.text();
        console.error('API Error Response:', response.status, response.statusText, errorText);
        throw new Error(`Failed to ${isEditing ? 'update' : 'add'} story: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error saving story:', error);
      alert(`Failed to ${isEditing ? 'update' : 'add'} story. Please try again.`);
    } finally {
      setStoryLoading(false);
    }
  };

  const handleEdit = (story) => {
    console.log('Editing story:', story);
    setIsEditing(true);
    setCurrentStoryId(story.id);
    const editData = {
      title: story.title,
      author: story.author,
      genre: story.genre,
      coverImage: story.coverImage || "",
      pdfUrl: story.pdfUrl || "",
      viewCount: story.viewCount,
      commentCount: story.commentCount,
    };
    console.log('Setting form data:', editData);
    setFormData(editData);
    setShowModal(true);
  };

  const handleDelete = async (storyId) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      setDeletingStoryId(storyId);
      try {
        const response = await fetch(`http://localhost:5000/stories/${storyId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const updatedStories = stories.filter((story) => story.id !== storyId);
          setStories(updatedStories);
          alert('Story deleted successfully!');
        } else {
          throw new Error('Failed to delete story');
        }
      } catch (error) {
        console.error('Error deleting story:', error);
        alert('Failed to delete story. Please try again.');
      } finally {
        setDeletingStoryId(null);
      }
    }
  };

  const handleViewContact = (contact) => {
    console.log('View contact clicked:', contact);
    setCurrentContact(contact);
    setShowContactModal(true);
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
            Dashboard - Admin Panel
          </h2>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={10}>
          <Nav variant="tabs" className="mb-4" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Nav.Item>
              <Nav.Link eventKey="stories">Stories Management</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="contacts">
                Contact Forms
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {activeTab === "stories" && (
            <>
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
                            disabled={deletingStoryId === story.id}
                          >
                            {deletingStoryId === story.id ? (
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                              <FaTrash />
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </>
          )}

          {activeTab === "contacts" && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Contact Forms ({contacts.length})</h5>
              </div>

              {contacts.length === 0 ? (
                <p className="text-center text-muted">No contact forms available.</p>
              ) : (
                <Table striped bordered hover responsive className="shadow-sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Subject</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr key={contact.id}>
                        <td>{contact.id}</td>
                        <td>{contact.name}</td>
                        <td>{contact.email}</td>
                        <td>{contact.subject}</td>
                        <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => handleViewContact(contact)}
                            title="View Contact Details"
                          >
                            <FaEye /> View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </>
          )}

          {/* Story Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
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
                  <Form.Label>Select Cover Image {isEditing && formData.coverImage && '(Optional - keep current)'}</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
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
                  <Form.Label>Select PDF File {isEditing && formData.pdfUrl && '(Optional - keep current)'}</Form.Label>
                  <Form.Control
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfFileChange}
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
                  disabled={storyLoading}
                >
                  {storyLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {isEditing ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    isEditing ? "Update" : "Add"
                  )}
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          {/* Contact Detail Modal */}
          <Modal show={showContactModal} onHide={() => setShowContactModal(false)} centered size="lg">
            <Modal.Header closeButton className="border-0">
              <Modal.Title className="text-danger opacity-75">
                Contact Details
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {currentContact && (
                <div>
                  <Row>
                    <Col md={6}>
                      <p><strong>Name:</strong> {currentContact.name}</p>
                      <p><strong>Email:</strong> {currentContact.email}</p>
                      <p><strong>Subject:</strong> {currentContact.subject}</p>
                      <p><strong>Date:</strong> {new Date(currentContact.createdAt).toLocaleString()}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Message:</strong></p>
                      <div className="border p-3 bg-light rounded">
                        {currentContact.message}
                      </div>
                    </Col>
                  </Row>
                </div>
              )}
            </Modal.Body>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;

