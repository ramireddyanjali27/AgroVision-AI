import './Loader.css'

const Loader = ({ text }) => {
  return (
    <div className="loader-wrap">
      <div className="spinner spinner-dark"></div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  )
}

export default Loader
