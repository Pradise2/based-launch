/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import { neynar } from 'frog/middlewares'
import dotenv from 'dotenv';

dotenv.config();

const neynarApiKey = process.env.NEYNAR_API_KEY || '';

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
}).use(
  neynar({
    apiKey: neynarApiKey,
    features: ['interactor', 'cast'],
  }),
);

app.frame('/start', (c) => {
  return c.res({
    action: '/Join-Waitlist',
    image: "https://based-launch.vercel.app/Getstarted.jpg",
    intents: [
      <Button value="Join-waitlist">Join-waitlist</Button>,
    ],
  });
});

app.frame('/Join-Waitlist', (c) => {
  const interactor = c.var.interactor;
  const cast = c.var.cast;

  if (
    interactor &&
    interactor.viewerContext &&
    interactor.viewerContext.following
  ) {
   
    if (cast && cast.reactions) {
      const { likes, recasts } = cast.reactions;
      const interactorFid = interactor.fid;

      if (likes.some(like => like.fid === interactorFid) || recasts.some(recast => recast.fid === interactorFid)) {
        return c.res({
          action: '/Done',
          image: "https://based-launch.vercel.app/Youhavejoined.jpg",
        });
      }
    }

    return c.res({
      action: '/Join-Waitlist',
      image: "https://based-launch.vercel.app/Tryagain.jpg",
      intents: [
        <Button.Reset>Try-again</Button.Reset>,
        <Button.Link href="https://warpcast.com/based-launch">Follow /basedlaunch</Button.Link>,
        <Button.Link href="https://warpcast.com/~/channel/basedlaunch">Follow @based-launch</Button.Link>,
      ],
    });
  } else {
   
    return c.res({
      action: '/Join-Waitlist',
      image: "https://based-launch.vercel.app/Tryagain.jpg",
      intents: [
        <Button.Reset>Try-again</Button.Reset>,
        <Button.Link href="https://warpcast.com/based-launch">Follow /basedlaunch</Button.Link>,
        <Button.Link href="https://warpcast.com/~/channel/basedlaunch">Follow @based-launch</Button.Link>,
      ],
    });
  }
});

app.frame('/Done', (c) => {
  return c.res({
    image: "http://localhost:3000/Youhavejoined.jpg",
    intents: [
      <Button value="Share">Share</Button>,
    ],
  });
});


devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
