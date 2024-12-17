// Learn more at developers.reddit.com/docs
import { Devvit, useAsync, useState } from '@devvit/public-api'
import { getQuestion } from './server/openai.js'
// import Loading from './loading.js'

Devvit.configure({
  redditAPI: true
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
      // The preview appears while the post loads
      preview: (
        <Loading />
      )
    })
    ui.navigateTo(post)
  }
})

// Add a post type definition
Devvit.addCustomPostType({
  name: 'Experience Post',
  height: 'tall',
  render: (_context) => {
    const [counter, setCounter] = useState(0)
    const [showQuestionPage, setShowQuestionPage] = useState(false)
    const [currentPage, setCurrentPage] = useState('home')

    return (
      currentPage === 'home' ? <Home setCurrentPage={setCurrentPage} /> : <Question setCurrentPage={setCurrentPage} />
    )
  }
})

const Home = ({ setCurrentPage }: { setCurrentPage: (currentPage: string) => void }) => {
  const question = useAsync(async () => await getQuestion())
  console.log(question)

  return (
    <vstack height="100%" width="100%" padding='large' gap="medium" alignment="center middle" backgroundColor='#FF5700'>
      <button appearance="primary" size='large' onPress={() => setCurrentPage('question')}>
      PLAY
      {question.data}
    </button>
  </vstack>
)
}

const Loading = () => (
    <vstack>
      <text>SS Loading</text>
    </vstack>
  )

const Question = ({ setCurrentPage }: { setCurrentPage: (currentPage: string) => void }) => (
  <vstack height="100%" width="100%" padding='large' gap="medium" alignment="center middle" backgroundColor='#FF5700'>
    <text size="xlarge" weight='bold'>10% of 100</text>
    <spacer size="medium" />
    <button width="100%">1</button>
    <button width="100%">10</button>
    <button width="100%">0.1</button>
    <button width="100%">20</button>
    <spacer size="large" />
    <button onPress={() => setCurrentPage('home')}>
      Exit (Home)
    </button>
  </vstack>
)


export default Devvit
