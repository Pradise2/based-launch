import { getFrameMetadata } from 'frog/next'
import type { Metadata } from 'next'
import dotenv from 'dotenv';

dotenv.config();

import styles from './page.module.css'

export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `${'https://based-launch.vercel.app'}/api`,
  )
  return {
    other: frameTags,
  }
}
export default function Home() {
  return (

        <div className={styles.mainContainerClasses}>
          <div className={styles.textContainerClasses}>
            <h1 className={styles.titleClasses}>$Based Launch</h1>
            <p className={styles.descriptionClasses}>
              Experience the future of presales with Based Launch, the first frame-powered launchpad on Base. Join our waitlist now for exclusive access to our upcoming launch. Don't miss out!
            </p>
          </div>
        </div>
  );
};