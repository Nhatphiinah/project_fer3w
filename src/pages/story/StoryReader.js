/*
 * Assignment create by Group 2
 */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { getStories } from "../../utils/storyService.js";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/pages/StoryReader.css";

// Thiết lập worker cho react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const StoryReader = () => {
  const { id } = useParams();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [story, setStory] = useState(null);
  const [stories, setStories] = useState([]);

  // Lấy danh sách sách từ localStorage
  useEffect(() => {
    const storiesFromLocal = getStories();
    setStories(storiesFromLocal);

    const foundStory = storiesFromLocal.find(
      (story) => story.id.toString() === id
    );
    if (foundStory) {
      setStory(foundStory);
    }
  }, [id]);

  // Kiểm tra dữ liệu stories
  if (!stories || stories.length === 0) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          <h4>Loading Data Failed</h4>
          <p>Please try again or read other!</p>
        </Alert>
      </Container>
    );
  }

  // Kiểm tra story
  if (!story) {
    return (
      <Container className="my-5">
        <Alert variant="warning" className="text-center">
          <h4>Story Not Found</h4>
          <p>No match story with ID. Please check ID!</p>
        </Alert>
      </Container>
    );
  }

  // Kiểm tra pdfUrl
  if (!story.pdfUrl) {
    return (
      <Container className="my-5">
        <Alert variant="warning" className="text-center">
          <h4>No PDF Available</h4>
          <p>Failed to load PDF file or not available. Please read other!</p>
        </Alert>
      </Container>
    );
  }

  const pdfUrl = story.pdfUrl;

  // Hàm xử lý khi PDF được tải thành công
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1); // Reset về trang 1 khi tải PDF mới
  };

  // Hàm điều hướng đến trang tùy ý
  const goToPage = (event) => {
    const newPage = parseInt(event.target.value, 10);
    if (newPage >= 1 && newPage <= numPages && numPages !== null) {
      setPageNumber(newPage);
    } else if (event.target.value !== "") {
      alert(`Please enter page number from 1 to ${numPages}`);
    }
  };

  // Điều hướng trang
  const goToPreviousPage = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) setPageNumber(pageNumber + 1);
  };

  return (
    <Container fluid className="story-reader-container">
      <Row className="justify-content-center pt-3 mb-3">
        <Col>
          <h2 className="text-danger opacity-75">
            {story.title} - {story.author}
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8} lg={10}>
          <Card className="pdf-card shadow-sm">
            <Card.Body className="p-0">
              <div className="pdf-wrapper">
                <Document
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={(error) =>
                    console.error("Error loading PDF:", error)
                  }
                >
                  <Page
                    key={`page_${pageNumber}`}
                    pageNumber={pageNumber}
                    width={700}
                  />
                </Document>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="my-4 justify-content-center">
        <Col md={6} className="text-center">
          <div className="d-flex justify-content-center align-items-center mb-3">
            <Button
              variant="outline-primary"
              onClick={goToPreviousPage}
              disabled={pageNumber <= 1}
              className="me-2 read-now-btn text-white"
            >
              Previous
            </Button>
            <span className="page-info mx-3">
              Page {pageNumber} / {numPages || "--"}
            </span>
            <Button
              variant="outline-primary"
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="ms-2 read-now-btn text-white"
            >
              Next
            </Button>
          </div>

          <Form.Group
            as={Row}
            className="justify-content-center align-items-center"
          >
            <Col xs="auto">
              <Form.Label htmlFor="pageInput" className="mb-0">
                Go to page:
              </Form.Label>
            </Col>
            <Col xs="auto">
              <Form.Control
                id="pageInput"
                type="number"
                min="1"
                max={numPages || 1}
                value={pageNumber}
                onChange={goToPage}
                className="page-input"
              />
            </Col>
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
};

export default StoryReader;
