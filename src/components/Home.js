// src/components/Home.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../App.css'; // Optional: if you want to add custom styles

const Home = () => {
    return (
        <Container fluid>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="text-center mt-4">
                        <Card.Body>
                            <Card.Title>Welcome to Movie Booking</Card.Title>
                            <Card.Text>
                                Your one-stop solution for managing your movie bookings and staying entertained.
                            </Card.Text>
                            <Card.Link href="/register" className="btn btn-primary">
                                Get Started
                            </Card.Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;
