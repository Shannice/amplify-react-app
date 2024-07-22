import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Summary from './summary';

const apiUrl = "https://07x4swesbl.execute-api.eu-central-1.amazonaws.com";
const region = 'eu-central-1';

const s3Client = new S3Client({ region });

export const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [summaries, setSummaries] = useState([]);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    fetchSummaries();
  }, []);

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
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
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
      setAudioBlob(audioBlob);
    }
  };

  const uploadToS3 = async () => {
    if (!audioBlob) return;

    try {
      const { data: { uploadURL, objectKey } } = await axios.get(`${apiUrl}/upload-url`);

      const command = new PutObjectCommand({
        Bucket: 'aws-conversation-agent-data-frankfurt',
        Key: objectKey,
        Body: audioBlob,
        ContentType: 'audio/webm',
      });

      await s3Client.send(command);
      console.log('Audio uploaded successfully:', objectKey);
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  };

  const fetchSummaries = async () => {
    try {
      const response = await axios.get(`${apiUrl}/list-summaries`);
      setSummaries(response.data);
    } catch (error) {
      console.error('Error fetching summaries:', error);
    }
  };

  const readSummary = async (key) => {
    try {
      const response = await axios.get(`${apiUrl}/read-summary/${encodeURIComponent(key)}`);
      setSelectedSummary(response.data.content);
    } catch (error) {
      console.error('Error reading summary:', error);
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
        Upload Recording
      </button>
      {audioURL && (
        <div>
          <audio src={audioURL} controls />
        </div>
      )}

      <h3>Summaries</h3>
      <button onClick={fetchSummaries}>Refresh Summaries</button>
      <ul>
        {summaries.map((summary) => (
          <li key={summary.Key}>
            {summary.Key.split('/').pop()}
            <button onClick={() => readSummary(summary.Key.split('/').pop())}>
              Read
            </button>
          </li>
        ))}
      </ul>

      {selectedSummary && (
        <div>
          <h4>Selected Summary Content:</h4>
          <pre>{selectedSummary}</pre>
        </div>
      )}

      <Summary />
    </div>
  );
};

export default VoiceRecorder;
