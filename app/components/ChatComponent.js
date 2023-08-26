'use client';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

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
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
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
                    <button 
                        onClick={handleInitialize}
                        style={{ backgroundColor: '#0070f3', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Start AI and Digest Documents
                    </button>
                </div>
            ) : (
                <div style={{ width: '500px', height: '600px', border: '1px solid #333', overflowY: 'scroll', padding: '20px', backgroundColor: '#181818' }}>
                    {messages.map((message, index) => (
                        <div key={index} style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
                            <strong style={{ marginBottom: '5px', color: '#f1f1f1' }}>{message.sender} &gt;</strong>
                            <div style={{
                                padding: '10px',
                                borderRadius: '10px',
                                backgroundColor: message.sender === 'User' ? '#0070f3' : '#242424',
                                color: message.sender === 'User' ? 'white' : '#f1f1f1',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
                            }}>
                                {message.text}
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef}></div>
                    <form onSubmit={handleMessageSubmit} style={{ position: 'absolute', bottom: '10px', width: '460px' }}>
                        <input
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            style={{ width: '360px', padding: '10px', marginRight: '10px', borderRadius: '4px', backgroundColor: '#242424', color: 'white', border: '1px solid #333' }}
                            placeholder="Type your queries about your document here"
                        />
                        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Send</button>
                    </form>
                </div>
            )}
        </div>
    );
                        }
                            
    export default ChatComponent;
