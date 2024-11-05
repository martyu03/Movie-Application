import { useEffect, useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from "notyf";

export default function Register() {
    const { user, setUser } = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isActive, setIsActive] = useState(false);

    const notyf = new Notyf();

    useEffect(() => {
        setIsActive(email !== "" && password !== "" && confirmPassword !== "" && password === confirmPassword);
        console.log(isActive);
    }, [email, password, confirmPassword]);

    function registerUser(e) {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                password
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            console.log(data);
            if (data) {
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                notyf.success('Registration Successful');
            } else {
                notyf.error(data.message || 'Something went wrong');
            }
        })
        .catch(error => {
            console.error('Error during fetch:', error);
            notyf.error('An error occurred during registration. Please try again.');
        });
    }

    // Check if user is null before accessing user.id
    if (user && user.id) {
        return <Navigate to="/movies" />;
    }

    return (
        <Form onSubmit={(e) => registerUser(e)}>
            <h1 className='my-5 text-center'>Register</h1>
            
            <Form.Group>
                <Form.Label>Email:</Form.Label>
                <Form.Control type='text' placeholder='Enter Email' required value={email} onChange={e => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Password:</Form.Label>
                <Form.Control type='password' placeholder='Enter Password' required value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Verify Password:</Form.Label>
                <Form.Control type='password' placeholder='Confirm Password' required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </Form.Group>
            {
                isActive ?
                <Button variant="primary" type="submit" id='submitBtn'>Submit</Button> :
                <Button className="mt-3" variant="danger" type="submit" id='submitBtn' disabled>Please enter your registration details</Button>
            }
        </Form>
    );
}
