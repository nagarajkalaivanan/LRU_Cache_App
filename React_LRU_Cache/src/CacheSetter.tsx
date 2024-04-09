import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';


const CacheSetter: React.FC = () => {
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');
    const [expiration, setExpiration] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8080/cache/${key}`, {
                value: value,
                expiration: parseInt(expiration)
            });
            if (response.status) {
                setKey('');
                setValue('');
                setExpiration("")
                window.alert("Cache Added Successfully")
            }
        } catch (error) {
            console.error('Error setting cache item:', error);
        }
    };

    return (
        <div className='card' style={{ backgroundColor: "#c8e9f5", margin: '10px' }}>
            <div style={{ margin: '10px' }}>
                <h4>Cache Setter</h4>
                <form onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className='col-md-3 col-lg-3 col-sm-3'>
                            <label>
                                Key:
                                <input className='form-control-sm' type="text" value={key} onChange={(e) => setKey(e.target.value)} />
                            </label>
                        </div>
                        <div className='col-md-3 col-lg-3 col-sm-3'>
                            <label>
                                Value:
                                <input className='form-control-sm' type="text" value={value} onChange={(e) => setValue(e.target.value)} />
                            </label>
                        </div>
                        <div className='col-md-3 col-lg-3 col-sm-3'>
                            <label>
                                Expiration:
                                <input
                                  className='form-control-sm'
                                    type="number"
                                    placeholder="Expiration time(in sec)"
                                    value={expiration}
                                    onChange={(e) => setExpiration(e.target.value)}
                                />
                            </label>
                        </div>
                        <div className='col-md-1 col-lg-1 col-sm-1'>
                            <Button variant='primary' type="submit">Set</Button>
                        </div>
                    </div>

                </form>
            </div>

        </div>
    );
};

export default CacheSetter;
