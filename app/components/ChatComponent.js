
'use client';
import React, { useState, useRef, useEffect } from 'react';

export default function ChatComponent() {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const chatBoxRef = useRef(null);

    useEffect(() => {
        const startLLM = async () => {
            try {
                await fetch("http://localhost:5000/llm/start", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } catch (error) {
                setMessages([{ type: 'error', text: 'Error: Unable to initialize LLM!' }]);
            }
        };

        startLLM();

        const chatBox = chatBoxRef.current;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, [messages]);

    const handleMessageSend = async () => {
        if (inputValue.trim() !== "") {
            setMessages([...messages, { type: 'user', text: inputValue }]);

            try {
                const response = await fetch("http://localhost:5000/llm/query", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ query: inputValue })
                });

                const data = await response.json();

                if (data.response) {
                    setMessages(prev => [...prev, { type: 'llm', text: data.response }]);
                } else {
                    throw new Error('Invalid response from server');
                }

            } catch (error) {
                setMessages(prev => [...prev, { type: 'error', text: 'Error: Unable to fetch response!' }]);
            }

            setInputValue("");
        }
    };

    return (
        <div className="chat-container mt-4 border p-4 rounded-lg w-3/4 mx-auto">
            <div ref={chatBoxRef} className="chat-box max-h-128 overflow-y-auto mb-4 bg-white p-4 rounded">
                {messages.map((message, index) => (
                    <div key={index} className={`mb-2 p-2 rounded-lg ${message.type === 'user' ? 'bg-gray-400' : message.type === 'llm' ? 'bg-blue-400' : 'bg-red-400'}`}>
                        <strong>{message.type === 'user' ? 'User:' : message.type === 'llm' ? 'AI:' : 'Error:'}</strong> {message.text}
                    </div>
                ))}
            </div>
            <div className="chat-input flex items-center">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="border rounded-l-lg p-2 flex-1 mr-2 text-black"
                    placeholder="Type your message..."
                />
                <button onClick={handleMessageSend} className="bg-blue-600 text-white p-2 rounded-r-lg">
                    Send
                </button>
            </div>
        </div>
    );
}
