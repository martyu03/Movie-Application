import { useEffect, useState, useContext } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import UserContext from "../context/UserContext";
import { Notyf } from "notyf";

export default function ProductView() {
    const { productId } = useParams();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const notyf = new Notyf();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1); // New state for quantity

    const subtotal = price * quantity;

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`)
            .then(res => res.json())
            .then(data => {
                console.log('Fetched product data:', data);
                setName(data.name);
                setDescription(data.description);
                setPrice(data.price);
            });
    }, [productId]);

    function addToCart(productId) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/add-to-cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                productId,
                quantity,
                subtotal
            })
        })
            .then(res => {
                console.log('Response:', res); // Log the entire response
                return res.json(); // Return the parsed response
            })
            .then(data => {
                console.log('Response data:', data); // Log the data returned from server
                if (data.message === 'Admin is forbidden') {
                    notyf.error('Admin Forbidden');
                } else if (data.message === 'Item added to cart successfully') {
                    notyf.success('Product added to cart successfully');
                    navigate('/products');
                } else {
                    notyf.error('Internal Server Error. Notify System Admin');
                }
            })
            .catch(error => {
                console.error('Fetch error:', error); // Log fetch errors
                notyf.error('An error occurred while adding to cart.');
            });
    }
    

    const incrementQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const decrementQuantity = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

    return (
        <Row>
            <Col lg={{ span: 6, offset: 3 }}>
                <Card>
                    <Card.Body>
                        <Card.Title>{name}</Card.Title>
                        <Card.Text>{description}</Card.Text>
                        <Card.Subtitle>Price:</Card.Subtitle>
                        <Card.Text>PhP {price}</Card.Text>

                        <div className="d-flex align-items-center">
                            <Button variant="outline-secondary" onClick={decrementQuantity}>-</Button>
                            <span className="mx-2">{quantity}</span>
                            <Button variant="outline-secondary" onClick={incrementQuantity}>+</Button>
                        </div>

                        {
                            user.id !== null ? (
                                <Button variant="primary" onClick={() => addToCart(productId)}>
                                    Add to Cart
                                </Button>
                            ) : (
                                <Link className="btn btn-primary" to="/login">Login</Link>
                            )
                        }
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}
