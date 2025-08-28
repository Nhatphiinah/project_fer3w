/*
 * Assignment create by Group 1
 */
import {
  Col,
  Container,
  FormControl,
  FormGroup,
  Form,
  Row,
  Button,
  Card,
} from "react-bootstrap";
import "../../styles/pages/storylist.css";
import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { GenreContext } from "../../context/GenreContext";
import { getStories, searchStories } from "../../utils/storyService.js";

const genres = [
  "All",
  "Romance",
  "Detective / Mystery",
  "Horror",
  "Action",
  "Comedy",
  "Science Fiction (Sci-Fi)",
];

// Hàm chuyển đổi chuỗi có dấu thành không dấu
const removeDiacritics = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
    .replace(/[èéẹẻẽêềếệểễ]/g, "e")
    .replace(/[ìíịỉĩ]/g, "i")
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
    .replace(/[ùúụủũưừứựửữ]/g, "u")
    .replace(/[ỳýỵỷỹ]/g, "y")
    .replace(/[đ]/g, "d");
};

const StoryList = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const storiesData = await getStories();
        setStories(storiesData);
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const { selectedGenre, setSelectedGenre } = useContext(GenreContext);
  const [search, setSearch] = useState("");

  // Xử lý tìm kiếm
  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchStories(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching stories:', error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(search);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const filteredStories = (isSearching ? searchResults : stories)
    .filter((story) => {
      if (selectedGenre === "All") return true;
      return story.genre === selectedGenre;
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <Row>
          <Col className="mb-5">
            <h2>STORY LIST</h2>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center">
            <Form className="w-50">
              <FormGroup>
                <FormControl
                  type="search"
                  placeholder="Search..."
                  className="me-2"
                  aria-label="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </FormGroup>
            </Form>
          </Col>
        </Row>

        <Row className="justify-content-center m-lg-5">
          <Col>
            {genres.map((genre, index) => (
              <Button
                key={index}
                className={`m-2 shadow-sm genre-btn ${selectedGenre === genre ? "active" : ""
                  }`}
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </Button>
            ))}
          </Col>
        </Row>

        <Row className="justify-content-center m-lg-3">
          {filteredStories.length > 0 ? (
            filteredStories.map((story) => (
              <Col lg={3} md={4} sm={6} key={story.id} className="m-2 mb-3">
                <Card className="card shadow" style={{ width: "100%", maxWidth: "280px" }}>
                  <Card.Img
                    src={story.coverImage}
                    variant="top"
                    alt={story.title}
                    className="p-1 rounded-top-3"
                    style={{
                      height: "300px",
                      objectFit: "cover",
                    }}
                  />
                  <Card.Body className="card-body p-3 text-start">
                    <Card.Title className="text-primary mb-3 opacity-75 title-text">
                      <strong>{story.title}</strong>
                    </Card.Title>
                    <Card.Text>View: {story.viewCount}</Card.Text>
                    <Card.Text className="title-text">
                      Author: {story.author}
                    </Card.Text>
                    <Button
                      as={Link}
                      to={`/stories/${story.id}`}
                      className="mt-2 read-now-btn"
                    >
                      Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col className="text-center">
              <p>No stories found.</p>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default StoryList;
