import React from 'react';
import Button from '@mui/material/Button';
import { Client } from './Client';

export const App = () => {
  return (
    <div>
      <Button variant="contained">Button</Button>
      <Client />
    </div>
  );
};
