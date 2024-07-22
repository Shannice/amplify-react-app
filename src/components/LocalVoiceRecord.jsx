//this code works locally. for the purpose of troubleshooting. do not edit 
// src/components/VoiceRecorder.jsx//
import axios from 'axios';
import React, { useState, useRef } from 'react';
import Summary from './summary';

export const VoiceRecorder = () => {

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        chunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
    }
  };

  const uploadToS3 = async () => {
    if (!audioBlob) return;

    try {
      //mediaRecorderRef.current.addEventListener('stop', () => {
        chunksRef.current = [];

        // Send the audio blob to the backend server
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        axios.post('http://localhost:3000/upload', formData)
          .then(() => {
            console.log('Audio uploaded successfully');
          })
          .catch((error) => {
            console.error('Error uploading audio:', error);
          });
        
      //});
      //alert('Audio uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file: ', error);
    }
  };

  return (
    <div>
      <h2>Voice Recorder</h2>
      <button onClick={startRecording} disabled={isRecording}>
        {isRecording ? 'Recording...' : 'Start Recording'}
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
      <button onClick={uploadToS3} disabled={!audioBlob}>
        Upload to S3
      </button>
      {audioURL && (
        <div>
          <audio src={audioURL} controls />
        </div>
      )}


      <Summary />
    </div>
  );
};
