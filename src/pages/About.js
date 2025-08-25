/*
 * Assignment create by Group 2
 */
import { Container, Row, Col, Card } from "react-bootstrap";
import "../styles/pages/about.css";

const About = () => {
    return (
        <Container className="about-page">
            <Row className="mb-5">
                <Col>
                    <h1 className="text-center about-title">About ReadVerse</h1>
                    <p className="text-center about-subtitle">
                        Your Gateway to Literary Adventures
                    </p>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col lg={6} className="mb-4">
                    <Card className="about-card h-100">
                        <Card.Body>
                            <h3>Our Mission</h3>
                            <p>
                                ReadVerse is dedicated to bringing the best stories from around the world
                                to Vietnamese readers. We believe in the power of storytelling to inspire,
                                educate, and entertain people of all ages.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6} className="mb-4">
                    <Card className="about-card h-100">
                        <Card.Body>
                            <h3>Our Vision</h3>
                            <p>
                                To become the leading digital library platform in Vietnam, offering
                                diverse genres and high-quality content that enriches the reading
                                experience of our community.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col>
                    <Card className="about-card">
                        <Card.Body>
                            <h3>What We Offer</h3>
                            <Row>
                                <Col md={4} className="text-center mb-3">
                                    <div className="feature-icon">📚</div>
                                    <h5>Diverse Genres</h5>
                                    <p>From romance to sci-fi, mystery to action</p>
                                </Col>
                                <Col md={4} className="text-center mb-3">
                                    <div className="feature-icon">🌍</div>
                                    <h5>International Content</h5>
                                    <p>Stories from around the world</p>
                                </Col>
                                <Col md={4} className="text-center mb-3">
                                    <div className="feature-icon">📱</div>
                                    <h5>Easy Access</h5>
                                    <p>Read anywhere, anytime</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col>
                    <Card className="about-card">
                        <Card.Body>
                            <h3>Our Team</h3>
                            <p>
                                ReadVerse is powered by a passionate team of book lovers, translators,
                                and technology enthusiasts who work together to bring you the best
                                reading experience possible.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="about-card">
                        <Card.Body>
                            <h3>Contact Us</h3>
                            <p>
                                Have questions or suggestions? We'd love to hear from you!
                                Reach out to us through our contact page or social media channels.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default About;
