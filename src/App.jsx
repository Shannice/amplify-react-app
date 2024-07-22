// src/App.jsx
import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import {Link} from "react-router-dom"
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';


Amplify.configure(awsExports);

const App = ({ signOut, user }) => (
  <div>
    <h1>Voice Recording App</h1>
    <p>Hello, {user.username}</p>
    <button onClick={signOut}>Sign out</button>
    <Link  to="voicerecorder">Go to Voice recorder</Link>
   
   
  </div>
);

export default withAuthenticator(App);