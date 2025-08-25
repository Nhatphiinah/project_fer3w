/*
 * Assignment create by Group 2
 */
import { Container, Row, Col, Card } from "react-bootstrap";
import "../styles/pages/privacy.css";

const PrivacyPolicy = () => {
    return (
        <Container className="privacy-page">
            <Row className="mb-5">
                <Col>
                    <h1 className="text-center privacy-title">Privacy Policy</h1>
                    <p className="text-center privacy-subtitle">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </Col>
            </Row>

            <Row>
                <Col lg={8} className="mx-auto">
                    <Card className="privacy-card">
                        <Card.Body>
                            <section className="mb-4">
                                <h3>1. Information We Collect</h3>
                                <p>
                                    We collect information you provide directly to us, such as when you create an account,
                                    subscribe to our newsletter, or contact us for support. This may include:
                                </p>
                                <ul>
                                    <li>Name and email address</li>
                                    <li>Account credentials</li>
                                    <li>Reading preferences and history</li>
                                    <li>Communication records</li>
                                </ul>
                            </section>

                            <section className="mb-4">
                                <h3>2. How We Use Your Information</h3>
                                <p>
                                    We use the information we collect to:
                                </p>
                                <ul>
                                    <li>Provide and maintain our services</li>
                                    <li>Personalize your reading experience</li>
                                    <li>Send you updates and notifications</li>
                                    <li>Improve our platform</li>
                                    <li>Respond to your inquiries</li>
                                </ul>
                            </section>

                            <section className="mb-4">
                                <h3>3. Information Sharing</h3>
                                <p>
                                    We do not sell, trade, or otherwise transfer your personal information to third parties
                                    without your consent, except as described in this policy or as required by law.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h3>4. Data Security</h3>
                                <p>
                                    We implement appropriate security measures to protect your personal information against
                                    unauthorized access, alteration, disclosure, or destruction.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h3>5. Your Rights</h3>
                                <p>
                                    You have the right to:
                                </p>
                                <ul>
                                    <li>Access your personal information</li>
                                    <li>Correct inaccurate information</li>
                                    <li>Request deletion of your data</li>
                                    <li>Opt-out of marketing communications</li>
                                </ul>
                            </section>

                            <section className="mb-4">
                                <h3>6. Cookies and Tracking</h3>
                                <p>
                                    We use cookies and similar technologies to enhance your browsing experience and analyze
                                    website traffic. You can control cookie settings through your browser preferences.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h3>7. Changes to This Policy</h3>
                                <p>
                                    We may update this privacy policy from time to time. We will notify you of any changes
                                    by posting the new policy on this page and updating the "Last updated" date.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h3>8. Contact Us</h3>
                                <p>
                                    If you have any questions about this privacy policy, please contact us at:
                                </p>
                                <p>
                                    <strong>Email:</strong> privacy@readverse.com<br />
                                    <strong>Address:</strong> 123 Reading Street, Ho Chi Minh City, Vietnam
                                </p>
                            </section>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PrivacyPolicy;
