import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './components/App';

@Controller()
export class AppController {
  @Get()
  root(@Res() res: Response) {
    const htmlBody = renderToString(<App time={new Date().toISOString()} />);

    const fullHtml = `
      <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8"/>
          <title>Nest SSR</title>
          <style>body{font-family:sans-serif;margin:2rem;}</style>
        </head>
        <body>
          <div id="root">${htmlBody}</div>
        </body>
        </html>
    `;

    res.type('text/html').send(fullHtml);
  }
}
