import http from 'http';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { promises as fs } from 'fs';
import path from 'path';

import config from './config.js';

// Create a logger instance
const logger = pino({ level: config.logLevel });
const httpLogger = pinoHttp();

const contentTypeMap = {
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.pbf': 'application/x-binary'
};

const server = http.createServer(async (req, res) => {
  // Attach the logger middleware
  httpLogger(req, res);

  let filePath = '.' + decodeURIComponent(req.url);

  const extname = path.extname(filePath);

  let contentType = 'text/html';
  contentType = contentTypeMap[extname] || 'application/octet-stream';

  try {
    // Read file
    let content;

    if (extname == '.json') {
      content = await fs.readFile(filePath, 'utf-8');
      // Replace {host}
      content = content.replace(/{host}/g, config.baseUrl);
    } else {
      content = await fs.readFile(filePath);
    }

    // Add CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    };

    Object.entries(corsHeaders).forEach(([header, value]) => {
      res.setHeader(header, value);
    });

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content, 'utf-8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.writeHead(404);
      res.end('404 Not Found');
    } else {
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  }
});

server.listen(config.port, () => {
  logger.info(`iMap Resource Server running at http://127.0.0.1:${config.port}`);
  logger.debug(config);
});
