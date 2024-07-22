// src/components/S3BucketContents.jsx
import React, { useState, useEffect } from 'react'


export const S3BucketContents = () => {
  const [files, setFiles] = useState([]);

  const listFiles = async () => {
    try {
      const result = await Storage.list('');
      setFiles(result);
    } catch (error) {
      console.error('Error listing files:', error);
    }
  };

  useEffect(() => {
    listFiles();
  }, []);

  return (
    <div>
      <h2>S3 Bucket Contents</h2>
      <button onClick={listFiles}>Refresh List</button>
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file.key}</li>
        ))}
      </ul>
    </div>
  );
};

