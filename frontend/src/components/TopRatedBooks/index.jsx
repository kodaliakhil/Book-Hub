import { Link } from "react-router-dom";
import { Audio } from "react-loader-spinner";
import Cookies from "js-cookie";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.css";
import Footer from "../Footer";
import HeaderContext from "../../context/HeaderContext";
import { useEffect, useState } from "react";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
};

function TopRatedBooks() {
  // state = { apiStatus: apiStatusConstants.initial, topRatedBooksList: [] };
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [topRatedBooksList, setTopRatedBooksList] = useState(0);

  // function componentDidMount() {
  //   getTopRatedBooks();
  // }
  useEffect(() => {
    getTopRatedBooks();
  }, []);

  const getUpdatedData = (data) => ({
    authorName: data.author_name,
    coverPic: data.cover_pic,
    id: data.id,
    title: data.title,
  });

  const getTopRatedBooks = async () => {
    // setState({ apiStatus: apiStatusConstants.inProgress });
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    const topRatedBooksApiUrl = "https://apis.ccbp.in/book-hub/top-rated-books";
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(topRatedBooksApiUrl, options);
    //  const response = await fetch(topRatedBooksApiUrl);
    if (response.ok) {
      const fetchedData = await response.json();
      const updatedData = fetchedData.books.map((eachBook) => getUpdatedData(eachBook));
      // setState({
      //   apiStatus: apiStatusConstants.success,
      //   topRatedBooksList: updatedData,
      // });
      setApiStatus(apiStatusConstants.success);
      setTopRatedBooksList(updatedData);
    } else {
      // setState({ apiStatus: apiStatusConstants.failure });
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const renderTopRatedBooksHeader = () => (
    <HeaderContext.Consumer>
      {(value) => {
        const { updateActiveNavId, isDarkTheme } = value;
        const onClickFindBooks = () => {
          updateActiveNavId(2);
        };

        const darkHeadingText = isDarkTheme ? "top-rated-books-dark-heading-text" : "";

        return (
          <div className="top-rated-books-header-container">
            <h1 className={`top-rated-books-heading ${darkHeadingText}`}>Top Rated Books</h1>
            <Link to="/shelf">
              <button type="button" className="find-books-desktop-btn" onClick={onClickFindBooks}>
                Find Books
              </button>
            </Link>
          </div>
        );
      }}
    </HeaderContext.Consumer>
  );

  const renderSlider = () => {
    // const { topRatedBooksList } = state;
    return (
      <HeaderContext.Consumer>
        {(value) => {
          const { updateActiveNavId, isDarkTheme } = value;
          const onClickBook = () => {
            updateActiveNavId("");
          };

          const darkHeadingText = isDarkTheme ? "top-rated-books-dark-heading-text" : "";
          const darkDescriptionText = isDarkTheme ? "top-rated-books-dark-description-text" : "";
          return (
            <Slider {...settings}>
              {topRatedBooksList.map((eachBook) => {
                const { id, authorName, coverPic, title } = eachBook;
                return (
                  <Link to={`books/${id}`} className="slider-nav-link" key={id} onClick={onClickBook}>
                    <div className="slick-item" key={id}>
                      <img className="cover-pic" src={coverPic} alt="company logo" />
                      <h1 className={`book-title ${darkHeadingText}`}>{title}</h1>
                      <p className={`book-author-name ${darkDescriptionText}`}>{authorName}</p>
                    </div>
                  </Link>
                );
              })}
            </Slider>
          );
        }}
      </HeaderContext.Consumer>
    );
  };

  const renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Audio type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  );

  const onClickTryAgain = () => {
    getTopRatedBooks();
  };

  const renderFailureView = () => (
    <HeaderContext.Consumer>
      {(value) => {
        const { isDarkTheme } = value;

        const darkDescriptionText = isDarkTheme ? "top-rated-books-dark-description-text" : "";

        return (
          <div className="top-rated-books-failure-view">
            <img className="failure-view-image" src="https://res.cloudinary.com/gottumukkala/image/upload/v1670324059/Book%20Hub%20Mini%20Project/Group_7522_cza4zl.png" alt="failure view" />
            <p className={`top-rated-books-failure-view-description ${darkDescriptionText}`}>Something went wrong, Please try again.</p>
            <button type="button" className="try-again-btn" onClick={onClickTryAgain}>
              Try Again
            </button>
          </div>
        );
      }}
    </HeaderContext.Consumer>
  );

  const renderSuccessView = () => <div className="slick-container">{renderSlider()}</div>;

  const renderTopRatedBooksSection = () => {
    // const { apiStatus } = state;

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

  // render() {
  //   const {apiStatus} = state
  return (
    <HeaderContext.Consumer>
      {(value) => {
        const { isDarkTheme } = value;
        const TopRatedBooksDarkBg = isDarkTheme ? "top-rated-books-dark-bg" : "";
        return (
          <>
            <div className={`top-rated-books-container ${TopRatedBooksDarkBg}`}>
              {renderTopRatedBooksHeader()}
              {renderTopRatedBooksSection()}
            </div>
            {apiStatus === apiStatusConstants.success && <Footer />}
          </>
        );
      }}
    </HeaderContext.Consumer>
  );
}
// }

export default TopRatedBooks;
