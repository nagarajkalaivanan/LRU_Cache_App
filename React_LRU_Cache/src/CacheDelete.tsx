import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
const CacheDelete: React.FC = () => {
    const [key, setKey] = useState('');

    const fetchData = async () => {
        try {
            const response = await axios.delete(`http://localhost:8080/cache/${key}`);
            if(response.status){
                setKey('');
                window.alert("Cache Deleted Successfully!!!")
            }
        } catch (error) {
            setKey('');
            console.error('Error deleting cache item:', error);
          
        }
    };

    return (
        <div className='card' style={{ backgroundColor: "#f4cdcd", margin: '10px' }}>
            <div style={{ margin: '10px' }}>
                <h4>Cache Delete</h4>
                <div className='row'>
                    <div className='col-md-3 col-lg-3 col-sm-3'>
                        <label>
                            Key:
                            <input className='form-control-sm' type="text" value={key} onChange={(e) => setKey(e.target.value)} />
                        </label>
                    </div>
                   
                    <div className='col-md-1 col-lg-1 col-sm-1'>
                        <Button variant='danger'  onClick={fetchData}>Delete</Button>
                    </div>
                </div>
               
            </div>

        </div>

    );
};

export default CacheDelete;
