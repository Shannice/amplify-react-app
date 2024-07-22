import axios from 'axios';
import React, { useEffect, useState } from 'react';


const Summary = () => {
  const [objects, setObjects] = useState([]);
  const [error, setError] = useState(null);


  const fetchObjects = async () => {
    axios.get('http://localhost:3000/fetch')
    .then((responce) => {
      setObjects(responce.data);
    })
    .catch((error) => {
      console.error(error);
    });      
  };
  
  useEffect(() => {
    

    fetchObjects();
  }, []);

  return (
    <div>
      <h2>S3 Bucket Contents</h2>
      {error && <p>Error: {error.message}</p>}
      {objects.length === 0 && <p>No objects found in the bucket.</p>}
      <ul>
        {objects.map((fileName,i) => (
          <li key={i}>{fileName}</li>
        ))}
      </ul>
    </div>
  );
};

export default Summary;
