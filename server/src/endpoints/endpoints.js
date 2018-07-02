import express from 'express';
import fs from 'fs';
import path from 'path';

const routers = {
  authed: express.Router(),
  notAuthed: express.Router(),
}

// Recursively read through subfolders
const readFileOrDir = (pathname) => {
  // Ignore this file....
  if(pathname === 'endpoints.js') {
    return;
  }
  // Check if it's a folder
  if(fs.statSync(pathname).isDirectory()) {
    // Then read and iterate through each item
    fs.readdirSync(pathname).forEach((file) => {
      // And call recursively
      readFileOrDir(path.join(pathname, file));
    });
  } else {
    // If it's a file, require it and see if it's a function
    const route = require(pathname).default;
    if(typeof route === 'function') {
      // Then call the function with the different routers.
      route(routers);
    }
  }
}

readFileOrDir(__dirname);

export default routers;