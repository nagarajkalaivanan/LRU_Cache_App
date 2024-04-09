import React from 'react';
import CacheViewer from './CacheViewer';
import CacheSetter from './CacheSetter';
import CacheDelete from './CacheDelete';
import CacheViewerWS from './CacheWS';

const App: React.FC = () => {
  return (
    <div>
      <div style={{textAlign:'center'}}> <h3>LRU Cache App</h3></div>
     
      <CacheSetter />
      <CacheViewer />
      <CacheDelete />
      <CacheViewerWS/>
      
    </div>
  );
};

export default App;
