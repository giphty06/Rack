import { useLocation, useNavigate } from 'react-router-dom'

function Privacy() {
  const navigate = useNavigate()
  const fromSignup = useLocation().state?.from === 'signup'
  const goBack = () => (window.history.length > 1 ? navigate(-1) : navigate('/'))

  return (
    <div className="page legal">
      <button className="back" onClick={goBack} aria-label="Back">←</button>
      <h2 className="title">Privacy notice</h2>
      <p>Last updated: 29th October 2026.</p>

      <h3>Who we are</h3>
      <p>
        Rack is a website that helps buyers find vendors and chat with them on WhatsApp.
        It is run by Gifty Chima Chidiebere in Aba, Nigeria. You can contact us at
        rack.com.ng@gmail.com.
      </p>

      <h3>What we collect</h3>
      <p>From vendors, we collect your shop name, WhatsApp number, town, and the photos,
        prices and details of the products you post. We use your phone number to log you in
        with a code.</p>
      <p>Buyers do not need an account, and we do not ask buyers for personal details.
        If a buyer saves items, that list is kept on their own phone. Our hosting services
        may record basic technical information when you visit, such as your device type
        and IP address.</p>

      <h3>What is public</h3>
      <p>Everything a vendor posts is visible to anyone who visits Rack. This includes your
        shop name, town, <strong>WhatsApp number</strong>, and your product photos and prices.
        Only post what you are happy for the public to see.</p>

      <h3>How we use it</h3>
      <p>We use your information to show your shop and products, let buyers contact you, let
        you log in, and keep the website working and secure. We do not sell your information.</p>

      <h3>Who else handles it</h3>
      <p>We use Supabase to store data and handle log-in, and Vercel to host the website.
        When we send log-in codes, a messaging service will handle your phone number for that
        purpose. These services may store data on servers outside Nigeria.</p>
      <p>Chats between buyers and vendors happen in WhatsApp, under WhatsApp's own rules.
        We cannot see them.</p>

      <h3>Your choices</h3>
      <p>You can edit or delete any of your products at any time in My shop. To have your
        shop and account removed, contact us and we will remove them.</p>

      <h3>Keeping it safe</h3>
      <p>We take reasonable steps to protect your information, but no website is completely
        secure. Please keep your log-in code private.</p>

      <h3>Who Rack is for</h3>
      <p>Rack is meant for people aged 18 and over.</p>

      <h3>Changes</h3>
      <p>We may update this notice. The date at the top shows when it last changed.</p>

      <button className="cta" onClick={goBack}>
        {fromSignup ? 'Back to sign up' : 'Go back'}
      </button>
    </div>
  )
}

export default Privacy