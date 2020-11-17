import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const add = (a, b) => a + b;
test('should add two numbers', () => {
 const sum = add(3, 4);
 expect(sum).toBe(7);
});