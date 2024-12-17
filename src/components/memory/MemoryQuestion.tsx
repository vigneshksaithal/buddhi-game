import { useState, Devvit } from '@devvit/public-api'
import { GameProps } from '../../types/index.js'

export const MemoryQuestion = ({ context, setCurrentPage }: GameProps) => {
  const [showButtons, setShowButtons] = useState(false)
  const [sequence, setSequence] = useState(() => {
    const length = Math.floor(Math.random() * 6) + 3
    let seq = ''
    for(let i = 0; i < length; i++) {
      seq += Math.floor(Math.random() * 9) + 1
    }
    return seq
  })
  const [userSequence, setUserSequence] = useState('')

  const handleNumberClick = (num: string) => {
    setUserSequence(prev => prev + num)
  }

  const handleSubmit = () => {
    if(userSequence === sequence) {
      context.ui.showToast('Correct! 🎉')
    } else {
      context.ui.showToast(`Wrong! The correct sequence was ${sequence} 😔`)
    }
    setUserSequence('')
    // Generate new sequence after submission
    const length = Math.floor(Math.random() * 6) + 3
    let seq = ''
    for(let i = 0; i < length; i++) {
      seq += Math.floor(Math.random() * 9) + 1
    }
    setSequence(seq)
    setShowButtons(false)
  }

  return (
    <vstack height="100%" width="100%" padding='large' gap="medium" alignment="center middle" backgroundColor='#FF5700'>
      <text size='medium' weight='bold'>Memory Question</text>
      <text size='large' weight='bold'>Remember this sequence</text>
      {!showButtons && <text size='xxlarge' weight='bold'>{sequence}</text>}
      <button onPress={() => setShowButtons(true)}>Continue</button>
      {showButtons && (
        <>
          <text size='medium'>Enter the sequence you remembered:</text>
          <text size='xlarge' weight='bold'>Your sequence: {userSequence}</text>
          <hstack width="100%" alignment="center middle" gap="medium">
            <button width="80px" onPress={() => handleNumberClick('1')}>1</button>
            <button width="80px" onPress={() => handleNumberClick('2')}>2</button>
            <button width="80px" onPress={() => handleNumberClick('3')}>3</button>
          </hstack>
          <hstack width="100%" alignment="center middle" gap="medium">
            <button width="80px" onPress={() => handleNumberClick('4')}>4</button>
            <button width="80px" onPress={() => handleNumberClick('5')}>5</button>
            <button width="80px" onPress={() => handleNumberClick('6')}>6</button>
          </hstack>
          <hstack width="100%" alignment="center middle" gap="medium">
            <button width="80px" onPress={() => handleNumberClick('7')}>7</button>
            <button width="80px" onPress={() => handleNumberClick('8')}>8</button>
            <button width="80px" onPress={() => handleNumberClick('9')}>9</button>
          </hstack>
          <button width="40%" appearance='primary' size='large' onPress={handleSubmit}>Submit</button>
        </>
      )}
      <spacer size="medium" />
      <button appearance='destructive' onPress={() => setCurrentPage('home')}>
        Exit (Home)
      </button>
    </vstack>
  )
} 