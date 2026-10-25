import { Link } from 'react-router-dom'

const buyerSteps = [
  { title: 'Search or filter', text: 'Search by name, or filter by price and size.' },
  { title: 'Find a vendor', text: 'See who sells it and what else they have.' },
  { title: 'Chat on WhatsApp', text: 'Ask questions and agree the details directly.' },
]

const vendorSteps = [
  { title: 'Sign up with your WhatsApp number', text: 'Confirm it with a code. Takes about 2 minutes.' },
  { title: 'Pick photos and add the price', text: 'Choose from your gallery, just like a status.' },
  { title: 'Get messages from buyers', text: 'Buyers contact you directly on WhatsApp.' },
]

function Steps({ items }) {
  return (
    <div className="steps">
      {items.map((s, i) => (
        <div className="step" key={s.title}>
          <div className="num">{i + 1}</div>
          <div>
            <div className="step-title">{s.title}</div>
            <div className="vendor">{s.text}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function Landing() {
  return (
    <div>
      <div className="inner nav">
        <h1 className="brand">Rack</h1>
        <div className="nav-links">
          <Link to="/login" className="link">Log in</Link>
          <Link to="/browse" className="pill">Buy</Link>
          <Link to="/signup" className="pill fill">Sell</Link>
        </div>
      </div>

      <div className="inner hero">
        <div className="hero-text">
          <h2>Find what you want, from vendors near you.</h2>
          <p>Browse products from vendors in your area, then chat with them straight on WhatsApp.</p>
          <div className="hero-actions">
            <Link to="/browse" className="cta">Browse products</Link>
            <Link to="/signup" className="cta outline">Start selling</Link>
          </div>
        </div>
        <div className="hero-photo"></div>
      </div>

      <div className="band">
        <div className="inner section">
          <h3>For buyers</h3>
          <Steps items={buyerSteps} />
        </div>
      </div>

      <div className="inner section">
        <h3>For vendors: post once, stay visible</h3>
        <p className="vendor">No more statuses that disappear after a day. Your products stay on your shop page for buyers to find.</p>
        <Steps items={vendorSteps} />
      </div>

      <div className="final">
        <div className="inner section">
          <h3>Ready to sell?</h3>
          <Link to="/signup" className="cta yellow">Create my shop</Link>
        </div>
      </div>

      <div className="inner footer">Rack · <Link to="/privacy" className="link">Privacy notice</Link> · Contact: [your WhatsApp or email]</div>
    </div>
  )
}

export default Landing