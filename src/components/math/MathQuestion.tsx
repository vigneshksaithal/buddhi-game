import { useState, useAsync, Devvit } from '@devvit/public-api'
import { GameProps } from '../../types/index.js'
import getQuestion from '../../server/question.server.js'

export const MathQuestion = ({ context, setCurrentPage }: GameProps) => {
  const [question, setQuestion] = useState<string>('')
  const [answer, setAnswer] = useState<string>('')
  const [options, setOptions] = useState<string[]>([])
  const [selectedOption, setSelectedOption] = useState<string>('')

  const {data, loading, error} = useAsync(async () => await getQuestion(context))

  setQuestion(data?.question || 'No Response')
  setAnswer(data?.answer || 'No Response')
  setOptions(data?.options || [])

  return (
    <vstack height="100%" width="100%" padding='large' gap="medium" alignment="center middle" backgroundColor='#FF5700'>
      <text size="xxlarge" weight='bold'>{question}</text>
      <spacer size="medium" />
      {options.map((option) => (
        <button width="100%" onPress={() => setSelectedOption(option)} key={option}>{option}</button>
      ))}
      <spacer size="large" />
      <button appearance='destructive' onPress={() => setCurrentPage('home')}>
        Exit (Home)
      </button>
    </vstack>
  )
} 