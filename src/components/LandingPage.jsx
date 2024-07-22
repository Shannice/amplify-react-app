// src/components/LandingPage.jsx
import React from 'react';
import VoiceRecorder from './VoiceRecorder';
import S3BucketContents from './S3BucketContents';

const LandingPage = ({ user, signOut }) => {
  return (
    <div>
      <h1>Voice Recording App</h1>
      <p>Welcome, {user.username}!</p>
      <VoiceRecorder />
      <S3BucketContents />
      <button onClick={signOut}>Sign out</button>
    </div>
  );
};

export default LandingPage;