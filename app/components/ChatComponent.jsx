'use client';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import styles from '../Styling/ChatComponent.module.css'
import ReactMarkdown from 'react-markdown';

function formatMessageForMarkdown(text) {
    // Replace '•' with '- ' for bullets, '*' with '- ' for compatibility and prepare numbered lists
    let replacedText = text.replace(/•/g, '- ').replace(/\*/g, '- ').replace(/(\d+)\./g, "$1. ");
    replacedText = text.replace('�', 'rt')
    console.log("Transformed Text:", replacedText);  // Log the transformed text for verification
    return replacedText;
}




function ChatComponent() {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isWaitingForAI, setIsWaitingForAI] = useState(false);
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
            if (response.data.status === 'success' || response.data.status === 'already initialized') {
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
    
        // Append user's message
        setMessages(prev => [...prev, { sender: 'User', text: inputValue }]);
    
        // Append a temporary AI "typing" message
        setMessages(prev => [...prev, { sender: 'AI', text: '...' }]);
    
        try {
            const response = await axios.post('http://localhost:5000/llm/query', { query: inputValue });
            console.log("AI Response:", response.data.response);
            // Update the last AI message from "..." to the actual response
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].text = response.data.response;
                return newMessages;
            });
    
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
                <div className={styles.chatSection}> {/* Wrapped chatContainer and form inside chatSection */}
                    <div className={styles.chatContainer}>
                        {messages.map((message, index) => (
                            <div 
                                key={index} 
                                className={`${styles.message} ${message.sender === 'User' ? styles.rightAligned : ''}`}
                                >
                                <img 
                                    className={message.sender === 'User' ? styles.userPhoto : styles.aiPhoto} 
                                    src={`/images/${message.sender}.svg`} 
                                    alt={message.sender} 
                                />
                                <div 
                                    className={message.sender === 'User' ? styles.userMessageContainer : styles.aiMessageContainer}
                                >
                                    <div className={styles.markdownContent}>
                                    {message.text === '...' ? 
                                    <div className={styles.wavyText}>
                                    <span>.</span><span>.</span><span>.</span>
                                    </div> : 
                                    <ReactMarkdown>
                                        {formatMessageForMarkdown(message.text)}
                                    </ReactMarkdown>
                                   }
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef}></div>
                    </div>
                    <form onSubmit={handleMessageSubmit} className={styles.form}> {/* Moved form outside chatContainer */}
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