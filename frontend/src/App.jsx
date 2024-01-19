import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import HeaderContext from "./context/HeaderContext";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";
import Bookshelves from "./components/Bookshelves";
import BookItemDetails from "./components/BookItemDetails";
import Favorites from "./components/Favorites";

function App() {
  const [showNavIcons, setShowNavIcons] = useState(false);

  const [activeNavId, setActiveNavId] = useState("");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [favoritesList, setFvoritesList] = useState([]);
  const appBg = isDarkTheme ? "dark-theme" : "light-theme";
  function updateActiveNavId(navId) {
    setActiveNavId(navId);
  }

  function onToggleTheme() {
    setIsDarkTheme(!isDarkTheme);
  }

  function onToggleIcon() {
    setShowNavIcons(!showNavIcons);
  }

  function onClose() {
    setShowNavIcons(false);
  }

  function removeAllFavorites() {
    setFvoritesList([]);
    localStorage.setItem("favorites_list", []);
  }

  function addFavorites(book) {
    const bookObject = favoritesList.find((eachBook) => eachBook.id === book.id);
    if (bookObject === undefined) {
      setFvoritesList([...favoritesList, book]);
    }
  }

  function removeFavorites(id) {
    const updatedFavoritesList = favoritesList.filter((eachItem) => eachItem.id !== id);

    setFvoritesList(updatedFavoritesList);
  }

  return (
    <HeaderContext.Provider
      value={{
        showNavIcons,
        activeNavId,
        updateActiveNavId,
        onToggleIcon,
        onClose,
        isDarkTheme,
        onToggleTheme,
        favoritesList,
        removeAllFavorites,
        removeFavorites,
        addFavorites,
      }}
    >
      <div className={`app-container ${appBg}`}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/shelf" element={<Bookshelves />} />
            <Route path="/books/:id" element={<BookItemDetails />} />
            <Route path="/favorites" element={<Favorites />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </HeaderContext.Provider>
  );
}

export default App;
