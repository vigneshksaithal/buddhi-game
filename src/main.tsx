// Learn more at developers.reddit.com/docs
import { Devvit, useAsync, useState } from '@devvit/public-api'
import getQuestion from './server/question.server.js'

Devvit.addSettings([
  {
    name: 'open-ai-api-key',
    label: 'Open AI API key',
    type: 'string',
    isSecret: true,
    scope: 'app'
  }
])

Devvit.configure({
  redditAPI: true,
  http: true
})

// Add a menu item to the subreddit menu for instantiating the new experience post
Devvit.addMenuItem({
  label: 'Add Buddhi Game post',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context
    ui.showToast("Submitting your post - upon completion you'll navigate there.")

    const subreddit = await reddit.getCurrentSubreddit()
    const post = await reddit.submitPost({
      title: 'My devvit post',
      subredditName: subreddit.name,
      preview: <Loading />
    })
    ui.navigateTo(post)
  }
})

// Add a post type definition
Devvit.addCustomPostType({
  name: 'Experience Post',
  height: 'tall',
  render: (_context) => {
    const [currentPage, setCurrentPage] = useState('home')

    if (currentPage === 'home') {
      return <Home setCurrentPage={setCurrentPage} />
    } else if (currentPage === 'math') {
      return <MathQuestion context={_context} setCurrentPage={setCurrentPage} />
    } else if (currentPage === 'memory') {
      return <MemoryQuestion context={_context} setCurrentPage={setCurrentPage} />
    } else {
      return <Home setCurrentPage={setCurrentPage} />
    }
  }
})

const Home = ({ setCurrentPage }: { setCurrentPage: (currentPage: string) => void }) => (
  <vstack height="100%" width="100%" padding='large' gap="medium" alignment="center middle" backgroundColor='#FF5700'>
    <button appearance="primary" size='large' onPress={() => setCurrentPage('memory')}>
      PLAY
    </button>
  </vstack>
)

const Loading = () => (
  <vstack>
    <text>...Loading...</text>
  </vstack>
)

async function fetchResponse(context: Devvit.Context): Promise<any> {
  try {
    const result = await getQuestion(context)
    console.log('1RES', result)
    console.log('QUESTION', result.question)

    return result
  } catch (e: any) {
    console.log('Fetch error ', e)
    return { question: 'Error', answer: 'Error', options: [] }
  }
}

const MathQuestion = ({ context, setCurrentPage }: { context: Devvit.Context, setCurrentPage: (currentPage: string) => void }) => {
  const [question, setQuestion] = useState<string>('')
  const [answer, setAnswer] = useState<string>('')
  const [options, setOptions] = useState<string[]>([])
  const [selectedOption, setSelectedOption] = useState<string>('')

  const {data, loading, error} = useAsync(async () => await fetchResponse(context))

  // console.log('RESPONSE', data)

  setQuestion(data.question || 'No Response')
  setAnswer(data.answer || 'No Response')
  setOptions(data.options || [])

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

const MemoryQuestion = ({ context, setCurrentPage }: { context: Devvit.Context, setCurrentPage: (currentPage: string) => void }) => {
  const [question, setQuestion] = useState<string>('')
  const [answer, setAnswer] = useState<string>('')
  const [options, setOptions] = useState<string[]>([])
  const [selectedOption, setSelectedOption] = useState<string>('')

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
    setShowButtons(false) // Hide buttons to show new sequence
  }

  return (
    <vstack height="100%" width="100%" padding='large' gap="medium" alignment="center middle" backgroundColor='#FF5700'>
      <text size='medium' weight='bold'>Memory Question</text>
      <text size='medium'>Remember the sequence</text>
      <button onPress={() => setShowButtons(!showButtons)}>
        {showButtons ? 'Show Sequence' : 'Hide Sequence'}
      </button>
      {!showButtons && <text size='xxlarge' weight='bold'>{sequence}</text>}
      {showButtons && (
        <>
          <text size='medium'>Enter the sequence you remembered:</text>
          <text size='medium'>Your sequence: {userSequence}</text>
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

export default Devvit
