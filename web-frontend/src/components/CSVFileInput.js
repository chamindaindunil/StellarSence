import { Button, Col, Container, Row, Form, Table, Spinner } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';

const CSVFileInput = () => {
    const [showSpinner, setShowSpinner] = useState(false);
    const [file, setFile] = useState([]);
    const [predictions, setPredictions] = useState([]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        setShowSpinner(true);

        const formData = new FormData();
        formData.append('csvFile', file);

        axios.post('http://127.0.0.1:5000/predict', formData, {
            headers: {
                'Access-Control-Allow-Origin': '*', // Allow CORS
                'Content-Type': 'multipart/form-data'
            },
        })
        .then(response => {
            console.log(response);
            setPredictions(response.data.predictions);
        })
        .catch(error => {
            console.error('Error uploading CSV file: ', error);
        })
        .finally(() => {
            setShowSpinner(false);
        });
    };

    return (
        <Container>
            <Row className='mt-5'>
                <Col md={{ span: 6, offset: 3 }}>
                    <h1 className='text-center'>Spectral Type Identification</h1>
                    
                        <Form.Group className='mb-3' controlId='formFile'>
                            <Form.Label>Upload CSV File</Form.Label>
                            <br />
                            <Form.Control type='file' accept=".csv" onChange={handleFileChange} />
                            <br />
                        </Form.Group>
                        <Button className='mt-3' onClick={handleUpload}>Detect Spectral Type</Button>

                        {showSpinner && 
                        <div className='text-center'>
                        <Spinner animation='border' role='status' className='mt-3'>
                            <span className='visually-hidden'>Loading...</span>
                        </Spinner>
                        </div>
                        }
                    
                    <Table striped bordered hover className='mt-5'>
                        {predictions.length > 0 ? 
                            <thead>
                            <tr>
                                <th>Star Object index</th>
                                <th>Main Spectral Type</th>
                            </tr>
                            </thead>
                        : null}
                        {predictions.map((value, index) => (
                            <tbody>
                                <tr key={index}>
                                    <td>{index}</td>
                                    <td>{value}</td>
                                </tr>
                            </tbody>
                        ))}
                    </Table>
                </Col>
            </Row>
        </Container>
    )
};

export default CSVFileInput;