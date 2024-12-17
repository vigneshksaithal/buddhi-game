// Learn more at developers.reddit.com/docs
import { Devvit, useAsync, useState } from '@devvit/public-api'
import { getQuestion } from './server/openai.server.js'

Devvit.addSettings([
  {
    // Name of the setting which is used to retrieve the setting value
    name: 'open-ai-api-key',
    // This label is used to provide more information in the CLI
    label: 'Open AI API key',
    // Type of the setting value
    type: 'string',
    // Marks a setting as sensitive info - all secrets are encrypted
    isSecret: true,
    // Defines the access scope
    // app-scope ensures only developers can create/replace secrets via CLI
    scope: 'app',
  },
]);

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
      currentPage === 'home' ? <Home setCurrentPage={setCurrentPage} /> : <Question context={_context} setCurrentPage={setCurrentPage} />
    )
  }
})

const Home = ({ setCurrentPage }: { setCurrentPage: (currentPage: string) => void }) => {

  return (
    <vstack height="100%" width="100%" padding='large' gap="medium" alignment="center middle" backgroundColor='#FF5700'>
      <button appearance="primary" size='large' onPress={() => setCurrentPage('question')}>
      PLAY
    </button>
  </vstack>
)
}

const Loading = () => (
    <vstack>
      <text>SS Loading</text>
    </vstack>
  )

  async function fetchResponse(context: Devvit.Context): Promise<string> {
    try {
      const apiKey = await context.settings.get('open-ai-api-key');

      const systemPrompt = `
You are a helpful assistant that generates questions for a game. 
Generate a simple math question in the form of "10% of 100". 
The answer should be a number. 
Respond in JSON format.

Output format:
{
    "question": "10% of 100",
    "answer": 10,
    "options": [1, 10, 0.1, 20]
}
` 
  
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: systemPrompt }],
        }),
      });
  
      const json = await res.json();
      console.log('JSON', json)
  
        console.log('Type of response', typeof json?.choices[0]?.message?.content)
        return json?.choices?.length > 0 ? JSON.parse(json?.choices[0]?.message?.content) : 'No response'
    } catch (e: any) {
      console.log('Fetch error ', e)
      return e.toString()
    }
  }

const Question = ({context, setCurrentPage}: {context: Devvit.Context, setCurrentPage: (currentPage: string) => void}) => {

  const [question, setQuestion] = useState<string>('')
  const [answer, setAnswer] = useState<string>('')
  const [options, setOptions] = useState<string[]>([])

  async function onPress() {
    const response = await fetchResponse(context)
    console.log('RESPONSE',response)

    setQuestion(response.question || 'No Response')
    setAnswer(response.answer || 'No Response')
    setOptions(response.options || [])
   
  }

  return (
  <vstack height="100%" width="100%" padding='large' gap="medium" alignment="center middle" backgroundColor='#FF5700'>
    <button onPress={onPress}>Generate</button>
    <text size="xlarge" weight='bold'>{question}</text>
    <spacer size="medium" />
    {options.map((option, index) => (
      <button onPress={() => setAnswer(option)}>{option}</button>
    ))}
    <spacer size="large" />
    <button onPress={() => setCurrentPage('home')}>
      Exit (Home)
    </button>
  </vstack>
)
}


export default Devvit
