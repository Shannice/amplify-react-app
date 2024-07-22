// src/components/UploadVoice.jsx
import React, { useState, useRef } from 'react';


const UploadVoice = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
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
    }
  };

  const uploadToS3 = async () => {
    if (!audioBlob) return;

    try {
      const fileName = `recording_${Date.now()}.wav`;
      await Storage.put(fileName, audioBlob, {
        contentType: 'audio/wav',
      });
      alert('Audio uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file: ', error);
    }
  };

  return (
    <div>
      <h2>Record Audio</h2>
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
      <button onClick={uploadToS3} disabled={!audioBlob}>
        Upload to S3
      </button>
    </div>
  );
};

export default UploadVoice;