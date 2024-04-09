import React, { useState, useEffect } from 'react';
import WebSocket from 'isomorphic-ws';
const CacheViewerWS: React.FC = () => {
    const [cacheData, setCacheData] = useState<any>({});
    const [key, setKey] = useState('');
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080/ws');

        socket.onmessage = (event) => {
            const messageData = event.data;

            if (typeof messageData === 'string') {
                const newData = JSON.parse(messageData);
                setCacheData(newData);
                setShowText(false)
            } else if (messageData instanceof ArrayBuffer) {
                const decoder = new TextDecoder('utf-8');
                const decodedData = decoder.decode(messageData);
                const newData = JSON.parse(decodedData);
                setCacheData(newData);
                setShowText(false)
            } else {
                setShowText(true)
                console.error('Unsupported message data type:', typeof messageData);
            }
        
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <div className='card' style={{ backgroundColor: "rgb(172 172 172)", margin: '10px' }}>
            <div style={{ margin: '10px' }}>
                <h4>Cache WebSocket Viewer</h4>
           
                <div className='row m-2' hidden={showText}>
                    <ul>
                        {Object.entries(cacheData).map(([key, value]) => (
                            <li key={key}>
                                <strong>{key}:</strong> {JSON.stringify(value)}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='row m-2'  hidden={!showText}>
                   <span>There is no value for the above key!!!</span>
                </div>

            </div>

        </div>

    );
};

export default CacheViewerWS;
