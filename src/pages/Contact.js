/*
 * Assignment create by Group 1
 */
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import "../styles/pages/contact.css";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("success");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlertMessage("");

        try {
            const contactData = {
                ...formData,
                createdAt: new Date().toISOString()
            };

            const response = await fetch('http://localhost:5000/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactData),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setAlertMessage("Thank you for your message! We'll get back to you soon.");
            setAlertVariant("success");
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error) {
            console.error('Error sending message:', error);
            setAlertMessage("Failed to send message. Please try again.");
            setAlertVariant("danger");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="contact-page">
            <Row className="mb-5">
                <Col>
                    <h1 className="text-center contact-title">Contact Us</h1>
                    <p className="text-center contact-subtitle">
                        Get in touch with our team
                    </p>
                </Col>
            </Row>

            {alertMessage && (
                <Row className="mb-4">
                    <Col>
                        <Alert variant={alertVariant} dismissible onClose={() => setAlertMessage("")}>
                            {alertMessage}
                        </Alert>
                    </Col>
                </Row>
            )}

            <Row>
                <Col lg={8} className="mb-4">
                    <Card className="contact-form-card">
                        <Card.Body>
                            <h3>Send us a message</h3>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Name *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Your name"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email *</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="your.email@example.com"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label>Subject *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="What is this about?"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Message *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your message..."
                                    />
                                </Form.Group>
                                <Button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Message'
                                    )}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="contact-info-card">
                        <Card.Body>
                            <h3>Contact Information</h3>
                            <div className="contact-item">
                                <h5>📧 Email</h5>
                                <p>info@readverse.com</p>
                            </div>
                            <div className="contact-item">
                                <h5>📱 Phone</h5>
                                <p>+84 123 456 789</p>
                            </div>
                            <div className="contact-item">
                                <h5>📍 Address</h5>
                                <p>123 Reading Street<br />Ho Chi Minh City, Vietnam</p>
                            </div>
                            <div className="contact-item">
                                <h5>⏰ Business Hours</h5>
                                <p>Monday - Friday: 9:00 AM - 6:00 PM<br />
                                    Saturday: 9:00 AM - 1:00 PM</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Contact;
