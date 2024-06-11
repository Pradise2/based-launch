/** @jsxImportSource frog/jsx */

import { Button, Frog } from 'frog';
import { devtools } from 'frog/dev';
import { handle } from 'frog/next';
import { serveStatic } from 'frog/serve-static';
import { neynar } from 'frog/middlewares';
import dotenv from 'dotenv';
import 'dotenv/config';

dotenv.config();

const neynarApiKey = process.env.NEYNAR_API_KEY || '';
const warpcasthash = process.env.WARPCAST_HASH || '';

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

  if (cast && cast.hash === warpcasthash && cast.reactions) {
    const { likes, recasts } = cast.reactions;
    const interactorFid = interactor?.fid;

    if (likes.some(like => like.fid === interactorFid) || recasts.some(recast => recast.fid === interactorFid)) {
      console.log("Interactor has liked or recast with the correct warpcast hash.");
      return c.res({
        action: '/Done',
        image: 'https://based-launch.vercel.app/Youhavejoined.jpg',
        intents: [
          <Button.Link href='https://warpcast.com/based-launch/0xf09fac93'>Share</Button.Link>,
        ],
      });
    }
  }

  console.log("Interactor does not meet the criteria.");
  return c.res({
    action: '/Join-Waitlist',
    image: 'https://based-launch.vercel.app/Tryagain.jpg',
    intents: [
      <Button.Reset>Try-again</Button.Reset>,
      <Button.Link href="https://warpcast.com/based-launch">Follow /basedlaunch</Button.Link>,
      <Button.Link href="https://warpcast.com/~/channel/basedlaunch">Follow @based-launch</Button.Link>,
    ],
  });
});


devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
