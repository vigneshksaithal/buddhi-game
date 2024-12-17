import { PageProps } from '../../types/index.js'
import { Devvit } from '@devvit/public-api'

export const Home = ({ setCurrentPage }: PageProps) => (
  <vstack height="100%" width="100%" padding='large' gap="medium" alignment="center middle" backgroundColor='#FF5700'>
    <button appearance="primary" size='large' onPress={() => setCurrentPage('memory')}>
      PLAY
    </button>
  </vstack>
) 