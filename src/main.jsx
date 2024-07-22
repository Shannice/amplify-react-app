// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {VoiceRecorder} from './components/VoiceRecorder.jsx'
import {S3BucketContents} from './components/S3BucketContents.jsx'


Amplify.configure(awsconfig);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<App />} />
         <Route path="voicerecorder" element={<VoiceRecorder />} />
         <Route path="s3bucket" element={<S3BucketContents />} />
        </Routes>
      </BrowserRouter>
  </React.StrictMode>
);