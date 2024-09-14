import { TypeAnimation } from 'react-type-animation'
import './homepage.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export const Homepage = () => {

  const [typingStatus, setTypingStatus] = useState("human1")

  return (
    <div className='homepage'>
      <img src="/orbital.png" alt="" className='orbital'/>
      <div className="left">
        <h1>AI CHAT</h1>
        <h2>Some Text Here</h2>
        <h3>Some Text here.....</h3>
        <Link to ="/dashboard">Get Started</Link>
      </div>
      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg">

            </div>
          </div>
          <img src="/bot.png" alt="" className='bot'/>
          <div className="chat">
          <img src={typingStatus==="human1" ? "/human1.jpeg" : typingStatus==="human2" ? "/human2.jpeg" : "/bot.png"} alt="" />
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                'HUMAN : Hi, how are you?',
                2000, ()=>{
                  setTypingStatus("bot")
                },
                'BOT : Hello, I am just a bot. How can I help you?',
                2000, ()=>{
                  setTypingStatus("human1")
                },
                'HUMAN : How many Days in a week?',
                2000, ()=>{
                  setTypingStatus("bot")
                },
                'BOT : There are 7 days in a week.',
                2000, ()=>{
                  setTypingStatus("human1")
                },
              ]}
              wrapper="span"
              omitDeletionAnimation={true}
              cursor={true}
              repeat={Infinity}
            />
          </div>
        </div>
      </div>
      <div className="terms">
        <img src="/logo.png" alt='' />
        <div className="links">
          <Link to="/">Terms of Service</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  )
}

export default Homepage