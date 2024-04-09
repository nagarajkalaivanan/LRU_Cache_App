import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
const CacheViewer: React.FC = () => {
    const [cacheData, setCacheData] = useState<any>({});
    const [key, setKey] = useState('');
    const [showText, setShowText] = useState(false);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/cache/${key}`);
            if (response.status) {
                setKey('');
                setCacheData(response.data);
                setShowText(false)
            }else{
                setKey('');
                setCacheData({})
                setShowText(true)
            }
        } catch (error) {
            setKey('');
            console.error('Error fetching cache item:', error);
            setCacheData({});
            setShowText(true)
        }
    };

    return (
        <div className='card' style={{ backgroundColor: "rgb(239 244 205)", margin: '10px' }}>
            <div style={{ margin: '10px' }}>
                <h4>Cache Viewer</h4>
                <div className='row'>
                    <div className='col-md-3 col-lg-3 col-sm-3'>
                        <label>
                            Key:
                            <input className='form-control-sm' type="text" value={key} onChange={(e) => setKey(e.target.value)} />
                        </label>
                    </div>

                    <div className='col-md-2 col-lg-2 col-sm-2'>
                        <Button variant='primary' className='m-1' onClick={fetchData}>Get</Button>
                        
                        <Button variant='warning' onClick={()=> setCacheData({})}>Clear</Button>
                    </div>
                    
                </div>
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

export default CacheViewer;
