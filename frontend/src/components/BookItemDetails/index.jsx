import Cookies from "js-cookie";
import { AiFillHeart } from "react-icons/ai";
import { BsFillStarFill } from "react-icons/bs";
import { Audio } from "react-loader-spinner";

import Header from "../Header";
import "./index.css";
import Footer from "../Footer";
import HeaderContext from "../../context/HeaderContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

function BookItemDetails(props) {
  const [apiStatus, setapiStatus] = useState(apiStatusConstants.initial);
  const [bookData, setbookData] = useState({});
  const [isFavoriteBook, setisFavoriteBook] = useState(false);
  const { id } = useParams();


  useEffect(() => {
    getBookData();
  }, []);

  const getUpdatedData = (data) => ({
    aboutAuthor: data.about_author,
    aboutBook: data.about_book,
    authorName: data.author_name,
    coverPic: data.cover_pic,
    id: data.id,
    rating: data.rating,
    readStatus: data.read_status,
    title: data.title,
  });

  const getBookData = async () => {
    setapiStatus(apiStatusConstants.inProgress);
    // const { match } = props;
    // const { params } = match;
    // const { id } = params;

    const jwtToken = Cookies.get("jwt_token");
    const bookDetailsApiUrl = `https://apis.ccbp.in/book-hub/books/${id}`;

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(bookDetailsApiUrl, options);
    if (response.ok === true) {
      const fetchedData = await response.json();
      const updatedData = getUpdatedData(fetchedData.book_details);

      setapiStatus(apiStatusConstants.success);
      setbookData(updatedData);
    } else {
      setapiStatus(apiStatusConstants.failure);
    }
  };

  const onClickTryAgain = () => {
    getBookData();
  };

  const renderFailureView = () => (
    <HeaderContext.Consumer>
      {(value) => {
        const { isDarkTheme } = value;

        const darkThemeDescription = isDarkTheme ? "book-item-details-dark-description-text" : "";

        return (
          <div className="book-details-failure-view">
            <img
              className="book-details-failure-view-image"
              src="https://res.cloudinary.com/gottumukkala/image/upload/v1670324059/Book%20Hub%20Mini%20Project/Group_7522_cza4zl.png"
              alt="failure view"
            />
            <p className={`book-details-failure-view-description ${darkThemeDescription}`}>Something went wrong, Please try again.</p>
            <button type="button" className="try-again-btn" onClick={onClickTryAgain}>
              Try Again
            </button>
          </div>
        );
      }}
    </HeaderContext.Consumer>
  );

  const renderSuccessView = () => {
    const { aboutAuthor, aboutBook, authorName, coverPic, rating, id, title, readStatus } = bookData;

    return (
      <HeaderContext.Consumer>
        {(value) => {
          console.log(value)
          const { isDarkTheme, removeFavorites, addFavorites, favoritesList } = value;
          const darkThemeColor = isDarkTheme ? "#d3d3d3" : "#475569";
          const bookObject = favoritesList.find((eachBook) => eachBook.id === id);
          const isFavorite = bookObject !== undefined;

          const favoriteIcon = isFavorite ? <AiFillHeart size={25} color="#ff0b37" /> : <AiFillHeart size={25} color={`${darkThemeColor}`} />;

          const bookItemsDetailsBg = isDarkTheme ? "book-item-details-dark-bg" : "";
          const darkThemeHeading = isDarkTheme ? "book-item-details-dark-heading-text" : "";
          const darkDescription = isDarkTheme ? "book-item-details-dark-description-text" : "";

          const onClickFavorite = () => {
            // eslint-disable-next-line no-unused-expressions
            isFavoriteBook ? removeFavorites(id) : addFavorites({ ...bookData, isFavorite: true });

            setisFavoriteBook(!isFavoriteBook);
          };

          return (
            <div className={`details-container ${bookItemsDetailsBg}`}>
              <div className="cover-pic-and-info-container">
                <img className="book-details-cover-pic" src={coverPic} alt={title} />
                <div className="info-container">
                  <h1 className={`book-details-title ${darkThemeHeading}`}>{title}</h1>
                  <p className={`book-details-author-name ${darkDescription}`}>{authorName}</p>
                  <div className="rating-container">
                    <p className={`rating-text ${darkDescription}`}>Avg Rating</p>
                    <BsFillStarFill color="#FBBF24" size={18} />
                    <p className={`book-details-rating ${darkDescription}`}>{rating}</p>
                  </div>
                  <p className={`book-details-status-text ${darkDescription}`}>
                    Status:
                    <span className="book-details-status"> {readStatus}</span>
                  </p>
                  <button type="button" className={`add-to-favorites-button ${darkDescription}`} onClick={onClickFavorite}>
                    Add To Favorites {favoriteIcon}
                  </button>
                </div>
              </div>
              <hr className="horizontal-line" />
              <h1 className={`about-author-heading ${darkThemeHeading}`}>About Author</h1>
              <p className={`about-author-description ${darkDescription}`}>{aboutAuthor}</p>
              <h1 className={`about-book-heading ${darkThemeHeading}`}>About Book</h1>
              <p className={`about-book-description ${darkDescription}`}>{aboutBook}</p>
            </div>
          );
        }}
      </HeaderContext.Consumer>
    );
  };

  const renderBookDetails = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderSuccessView();
      case apiStatusConstants.failure:
        return renderFailureView();
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      default:
        return null;
    }
  };

  const renderLoadingView = () => (
    <div className="book-details-loader-container" testid="loader">
      <Audio type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  );

  // render() {
  return (
    <>
      <Header />
      <div className="book-details-container">{renderBookDetails()}</div>
      {apiStatus === apiStatusConstants.success && <Footer />}
    </>
  );
}
// }

export default BookItemDetails;
