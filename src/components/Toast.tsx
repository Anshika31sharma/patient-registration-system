'use client';
import React from 'react';

const Toast = ({ message }: { message: string }) => (
  <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50">
    {message}
  </div>
);

export default Toast;
