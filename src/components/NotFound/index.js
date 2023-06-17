import {Link, withRouter} from 'react-router-dom'

import './index.css'

const NotFound = props => {
  const onClickBackToHome = () => {
    const {history} = props
    history.replace('/')
  }

  return (
    <div className="not-found-container">
      <img
        src="https://res.cloudinary.com/dbij4wrw1/image/upload/v1668257779/MiniProject/Group_7484not_found_uzphcr.png"
        alt="not found"
        className="not-found-bg-image"
      />
      <h1 className="page_Not_Found-heading">Page Not Found</h1>
      <p className="page_Not_Found-description">
        we are sorry, the page you requested could not be found, please go back
        to the homepage
      </p>
      <Link to="/">
        <button
          type="button"
          className="not_found-button"
          onClick={onClickBackToHome}
        >
          Go Back to Home
        </button>
      </Link>
    </div>
  )
}

export default withRouter(NotFound)
