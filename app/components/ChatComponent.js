'use client';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import styles from '../Styling/ChatComponent.module.css'

function ChatComponent() {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleInitialize = async () => {
        setLoading(true);
        try {
            if (file) {
                const formData = new FormData();
                formData.append('document', file);
                await axios.post('http://localhost:5000/backend/documents', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
            }
            const response = await axios.post('http://localhost:5000/llm/start');
            if (response.data.status === 'success') {
                setIsInitialized(true);
            } else {
                alert('Failed to initialize');
            }
        } catch (error) {
            alert('Error during initialization. Please check the backend.');
        }
        setLoading(false);
    };

    const handleMessageSubmit = async (e) => {
        e.preventDefault();
        if (inputValue.trim() === '') return;
        setMessages(prev => [...prev, { sender: 'User', text: inputValue }]);
        try {
            const response = await axios.post('http://localhost:5000/llm/query', { query: inputValue });
            setMessages(prev => [...prev, { sender: 'AI', text: response.data.response }]);
            setInputValue('');
        } catch (error) {
            alert('Error fetching response. Please check the backend.');
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <h2>Parsing Documents and Generating Embeddings</h2>
                <CircularProgress />
            </div>
        );
    }
    
    return (
        <div>
            {!isInitialized ? (
                <div>
                    <input type="file" onChange={e => setFile(e.target.files[0])} />
                    <button className={styles.initializeButton} onClick={handleInitialize}>
                        Start AI and Digest Documents
                    </button>
                </div>
            ) : (
                <div className={styles.chatContainer}>
                    {messages.map((message, index) => (
                        <div key={index} className={styles.message}>
                            <strong className={styles.sender}>{message.sender} &gt;</strong>
                            <div className={message.sender === 'User' ? styles.userMessage : styles.aiMessage}>
                                {message.text}
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef}></div>
                    <form onSubmit={handleMessageSubmit} className={styles.form}>
                        <input
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            className={styles.input}
                            placeholder="Type your queries about your document here"
                        />
                        <button type="submit" className={styles.sendButton}>Send</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ChatComponent;