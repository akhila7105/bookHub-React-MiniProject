import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsFillStarFill, BsFillHeartFill} from 'react-icons/bs'
import FavoriteContext from '../../Context/FavoriteContext'
import Header from '../Header'
import Footer from '../Footer'

const bookDetailsApiStatuses = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class BookItemDetails extends Component {
  state = {
    bookDetailsData: {},
    bookDetailsApiStatus: bookDetailsApiStatuses.initial,
  }

  componentDidMount() {
    this.getBookDetailsApi()
  }

  getBookDetailsApi = async () => {
    this.setState({bookDetailsApiStatus: bookDetailsApiStatuses.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params
    const bookDetailsApi = `https://apis.ccbp.in/book-hub/books/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(bookDetailsApi, options)

      if (response.ok === true) {
        const fetchedData = await response.json()
        const {book_details: bookDetails} = fetchedData
        const updatedData = {
          bookDetails: {
            id: bookDetails.id,
            authorName: bookDetails.author_name,
            coverPic: bookDetails.cover_pic,
            aboutBook: bookDetails.about_book,
            rating: bookDetails.rating,
            aboutAuthor: bookDetails.about_author,
            readStatus: bookDetails.read_status,
            title: bookDetails.title,
          },
        }
        this.setState({
          bookDetailsData: updatedData,
          bookDetailsApiStatus: bookDetailsApiStatuses.success,
        })
      } else {
        throw new Error('Failed to fetch book details')
      }
    } catch (error) {
      this.setState({bookDetailsApiStatus: bookDetailsApiStatuses.failure})
    }
  }

  onClickRetry = () => {
    this.setState(
      {bookDetailsApiStatus: bookDetailsApiStatuses.inProgress},
      () => {
        this.getBookDetailsApi()
      },
    )
  }

  renderBookDetailsInProgressView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#8284C7" height={32} width={32} />
    </div>
  )

  renderBookDetailsFailureView = () => (
    <div className="top-rated-books-failure-container">
      <img
        className="top-rated-books-failure-image"
        src="https://res.cloudinary.com/dbij4wrw1/image/upload/v1668257782/MiniProject/Group_7522something_went_wrong_xdcjpq.png"
        alt="failure view"
      />
      <p className="top-rated-books-failure-heading">
        Something Went Wrong. Please try again.
      </p>
      <button
        className="top-rated-books-failure-btn"
        onClick={this.onClickRetry}
        type="button"
      >
        Try Again
      </button>
    </div>
  )

  renderBookDetailsSuccessView = () => {
    const {bookDetailsData} = this.state
    const {bookDetails} = bookDetailsData
    const {
      authorName,
      coverPic,
      aboutBook,
      rating,
      readStatus,
      aboutAuthor,
      title,
    } = bookDetails

    return (
      <div className="book-details-card-container">
        <div className="book-details-container">
          <img className="book-details-image" alt={title} src={coverPic} />
          <div className="container1">
            <h1 className="book-title" key={title}>
              {title}
            </h1>
            <p className="book-details-author-name">{authorName}</p>
            <div className="book-details-rating-container">
              <p className="book-details-abg-rating-heading">Avg rating</p>
              <BsFillStarFill className="book-details-star-icon" />
              <p className="book-details-rating">{rating}</p>
            </div>
            <p className="book-details-status-heading">
              Status: <span className="book-details-status">{readStatus}</span>
            </p>
            <FavoriteContext.Consumer>
              {value => {
                const {favoriteList, onToggleFavorite} = value
                const isChecked = favoriteList.find(
                  eachItem => eachItem.id === bookDetails.id,
                )
                const onChangeFavorite = () => {
                  onToggleFavorite({
                    id: bookDetails.id,
                    title,
                    readStatus,
                    rating,
                    authorName,
                    aboutAuthor,
                    coverPic,
                  })
                }
                return (
                  <>
                    <input
                      className="favorite-input"
                      onChange={onChangeFavorite}
                      id={bookDetails.id}
                      type="checkbox"
                    />
                    <label htmlFor={bookDetails.id}>
                      <div className="favorite-container">
                        <p className="book-details-status-heading">
                          MyFavorite
                        </p>
                        {isChecked ? (
                          <BsFillHeartFill className="favorite-icon-book-details-selected" />
                        ) : (
                          <BsFillHeartFill className="favorite-icon-book-details" />
                        )}
                      </div>
                    </label>
                  </>
                )
              }}
            </FavoriteContext.Consumer>
          </div>
        </div>

        <div className="container2">
          <hr name="horizontal-line" />
          <div>
            <h1 className="about-heading">About Author</h1>
            <p className="about-paragraph">{aboutAuthor}</p>
          </div>
          <div>
            <h1 className="about-heading">About Book</h1>
            <p className="about-paragraph">{aboutBook}</p>
          </div>
        </div>
      </div>
    )
  }

  renderBookDetails = () => {
    const {bookDetailsApiStatus} = this.state

    switch (bookDetailsApiStatus) {
      case bookDetailsApiStatuses.success:
        return <>{this.renderBookDetailsSuccessView()}</>
      case bookDetailsApiStatuses.inProgress:
        return <>{this.renderBookDetailsInProgressView()}</>
      case bookDetailsApiStatuses.failure:
        return <>{this.renderBookDetailsFailureView()}</>
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header shelves>
          <Link to="/">Home</Link>
        </Header>
        <div className="book-details-bg-container">
          {this.renderBookDetails()}
        </div>
        <Footer />
      </>
    )
  }
}

export default BookItemDetails
