import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Card.css';

function Card() {
    const [serverMessage, setServerMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchServerMessage = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await axios.get('http://localhost:3000/');
                setServerMessage(response.data.message);
            } catch (error) {
                console.error('Error fetching server message:', error);
                setError('Failed to connect to server');
            } finally {
                setLoading(false);
            }
        };

        fetchServerMessage();
    }, []);

    return (
        <div className="card-container">
            <div className="server-status-card">
                <h2>Server Connection Status</h2>
                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Connecting to server...</p>
                    </div>
                ) : error ? (
                    <div className="error">
                        <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="success">
                        <svg className="success-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p>{serverMessage}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Card;
