// src/components/ListS3Contents.jsx
import React, { useState, useEffect } from 'react';
import { Storage } from 'aws-amplify';

const ListS3Contents = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    listFiles();
  }, []);

  async function listFiles() {
    try {
      const fileList = await Storage.list('');
      setFiles(fileList);
    } catch (error) {
      console.error('Error listing files: ', error);
    }
  }

  return (
    <div>
      <h2>S3 Bucket Contents</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file.key}</li>
        ))}
      </ul>
    </div>
  );
};

export default ListS3Contents;