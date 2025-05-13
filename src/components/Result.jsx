import botImage from '../assets/bot.png';

export default function Result({user}) {
  const isUser = user.toLowerCase() === "user";
  return (
    <div className='result'>
      <p>{isUser ? "You" : user}</p>
      <img src={botImage} alt="" />
      <p>0/<span>0</span></p>
    </div>
  )
}