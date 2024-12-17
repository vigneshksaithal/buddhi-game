import { Devvit } from '@devvit/public-api'

export interface PageProps {
  setCurrentPage: (currentPage: string) => void
}

export interface GameProps extends PageProps {
  context: Devvit.Context
} 