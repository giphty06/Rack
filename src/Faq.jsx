const CONTACT = 'rack.com.ng@gmail.com'

const groups = [
  {
    title: 'For buyers',
    items: [
      {
        q: 'Do I need an account to buy?',
        a: 'No. You can browse, save items you like, and message vendors without signing up.',
      },
      {
        q: 'How do I pay?',
        a: 'You agree payment directly with the vendor in your WhatsApp chat. Rack does not take payments or hold money yet. Ask the vendor for extra photos or a video before paying, and be careful about paying in advance to someone you do not know.',
      },
      {
        q: 'Does Rack deliver my order?',
        a: 'No. The vendor arranges delivery or pick-up with you in the chat.',
      },
      {
        q: 'What does saving an item do?',
        a: 'It keeps the item in a list on your phone. From the Saved page, you can message each vendor once about everything you picked from them.',
      },
    ],
  },
  {
    title: 'For vendors',
    items: [
      {
        q: 'How do I join?',
        a: `Rack is new, so vendors are being added in small groups. Message us at ${CONTACT} and we will set you up. Then tap Sell, enter your shop name, WhatsApp number and town, and confirm with the code we send you.`,
      },
      {
        q: 'Does it cost anything?',
        a: 'Rack is free to use while it is new.',
      },
      {
        q: 'Who can see my WhatsApp number?',
        a: 'Everyone who visits your shop. Buyers need it to message you, so only use a number you are happy to share.',
      },
      {
        q: 'How do I mark an item sold out or remove it?',
        a: 'Open My shop. Each item has buttons to mark it sold out, edit it, or delete it.',
      },
      {
        q: 'How do I delete my shop?',
        a: `Message us at ${CONTACT} and we will remove it.`,
      },
    ],
  },
]

function Faq() {
  return (
    <div className="faq">
      {groups.map((g) => (
        <div key={g.title}>
          <h4 className="faq-group">{g.title}</h4>
          {g.items.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Faq