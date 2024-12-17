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



  return (
    <vstack height="100%" width="100%" padding='large' gap="medium" alignment="center middle" backgroundColor='#FF5700'>
      <text>Memory Question</text>
      <spacer size="medium" />
      8️⃣4️⃣5️⃣2️⃣
      <spacer size="medium" />
      <button width="100%" onPress={() => setCurrentPage('home')}></button>
      <button width="100%" onPress={() => setCurrentPage('home')}></button>
      <button width="100%" onPress={() => setCurrentPage('home')}></button>
      <button width="100%" onPress={() => setCurrentPage('home')}></button>
      <button appearance='destructive' onPress={() => setCurrentPage('home')}>
        Exit (Home)
      </button>
    </vstack>
  )
}

export default Devvit
