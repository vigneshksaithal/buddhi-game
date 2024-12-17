import { Devvit, useState } from '@devvit/public-api'
import { Home } from './components/home/Home.js'
import { MathQuestion } from './components/math/MathQuestion.js'
import { MemoryQuestion } from './components/memory/MemoryQuestion.js'
import { Loading } from './components/Loading.js'

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

Devvit.addCustomPostType({
  name: 'Experience Post',
  height: 'tall',
  render: (context) => {
    const [currentPage, setCurrentPage] = useState('home')

    if (currentPage === 'home') {
      return <Home setCurrentPage={setCurrentPage} />
    } else if (currentPage === 'math') {
      return <MathQuestion context={context} setCurrentPage={setCurrentPage} />
    } else if (currentPage === 'memory') {
      return <MemoryQuestion context={context} setCurrentPage={setCurrentPage} />
    } else {
      return <Home setCurrentPage={setCurrentPage} />
    }
  }
})

export default Devvit
