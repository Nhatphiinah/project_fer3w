/*
 * Assignment create by Group 2
 */
import { Button, Card, Carousel, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/pages/home.css";
import { getStories } from "../utils/storyService.js";
import { useEffect, useState } from "react";

const Home = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const featuredStories = stories
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5)
    .filter((story) => story.viewCount > 100);

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
          <Col>
            <Carousel fade className="custom-carousel mb-5">
              {featuredStories.map((story) => (
                <Carousel.Item key={story.id}>
                  <Row className="carousel-content">
                    <Col md={6} className="carousel-image-col">
                      <img
                        className="carousel-image"
                        src={story.coverImage}
                        alt={story.title}
                      />
                    </Col>

                    <Col md={4} className="carousel-text-col">
                      <h3>{story.title}</h3>
                      <p className="author">by {story.author}</p>

                      <p className="description">
                        {story.description ||
                          `Explore the captivating story of ${story.title}.`}
                      </p>
                      <Button
                        as={Link}
                        to={`/stories/${story.id}`}
                        className="mt-2 read-now-btn"
                      >
                        Details
                      </Button>
                    </Col>
                  </Row>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
        <Row className="text-end view-more">
          <Col>
            <Button as={Link} to={"/stories"} className="mt-2 read-now-btn">
              View More
            </Button>
          </Col>
        </Row>

        <Row className="justify-content-center m-lg-3">
          {stories
            .sort((a, b) => b.id - a.id)
            .slice(0, 8)
            .map((story) => (
              <Col lg={3} md={4} sm={6} key={story.id} className="m-2 mb-3">
                <Card
                  key={story.id}
                  className="card shadow"
                  style={{ width: "100%", maxWidth: "280px" }}
                >
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
                      {<strong>{story.title}</strong>}
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
            ))}
        </Row>
      </Container>
    </>
  );
};

export default Home;
