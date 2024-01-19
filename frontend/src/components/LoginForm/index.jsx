import { useState } from "react";

import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router-dom";

import "./index.css";

function LoginForm() {
  const [username, setUsername] = useState("rahul");
  const [password, setPassword] = useState("rahul@2021");
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  function onChangeUsername(event) {
    setUsername(event.target.value);
  }

  function onChangePassword(event) {
    setPassword(event.target.value);
  }

  function onSubmitSuccess(jwtToken) {
    Cookies.set("jwt_token", jwtToken, {
      expires: 30,
    });
    navigate("/");
  }

  function onSubmitFailure(errorMsg) {
    setShowSubmitError(true);
    setErrorMsg(errorMsg);
  }

  async function submitForm(event) {
    event.preventDefault();
    const userDetails = { username, password };
    const loginApiUrl = "https://apis.ccbp.in/login";
    const options = {
      method: "POST",
      body: JSON.stringify(userDetails),
    };
    const response = await fetch(loginApiUrl, options);
    const data = await response.json();

    if (response.ok === true) {
      onSubmitSuccess(data.jwt_token);
    } else {
      onSubmitFailure(data.error_msg);
    }
  }

  function renderPasswordField() {
    const fieldType = showPassword ? "text" : "password";

    return (
      <>
        <label className="input-label" htmlFor="password">
          Password*
        </label>
        <input type={fieldType} id="password" className="password-input-field" value={password} onChange={onChangePassword} placeholder="Password" />
      </>
    );
  }

  function renderUsernameField() {
    return (
      <>
        <label className="input-label" htmlFor="username">
          Username*
        </label>
        <input type="text" id="username" className="username-input-field" value={username} onChange={onChangeUsername} placeholder="Username" />
      </>
    );
  }

  function onToggleCheckbox(event) {
    setShowPassword(event.target.checked);
  }

  function renderCheckbox() {
    return (
      <div className="checkbox-input-container">
        <input id="checkboxInput" type="checkbox" className="checkbox-input-field" onChange={onToggleCheckbox} />
        <label className="input-label checkbox-label" htmlFor="checkboxInput">
          Show Password
        </label>
      </div>
    );
  }

  const jwtToken = Cookies.get("jwt_token");

  if (jwtToken !== undefined) {
    return <Navigate to="/" />;
  }

  return (
    <div className="login-form-container">
      <div className="login-desktop-img-container">
        <img className="login-desktop-img" src="https://res.cloudinary.com/dinhpbueh/image/upload/v1662553915/LoginImageDesktop_w3keid.png" alt="" />
      </div>
      <div className="form-container">
        <img className="login-mobile-img" src="https://res.cloudinary.com/dinhpbueh/image/upload/v1662553670/Ellipse_99_gsgnqs.png" alt="website login" />
        <img className="login-website-logo" src="https://res.cloudinary.com/dinhpbueh/image/upload/v1662553813/BookHub_qnzptf.png" alt="login website logo" />
        <form className="form" onSubmit={submitForm}>
          <div className="input-container">{renderUsernameField()}</div>
          <div className="input-container">{renderPasswordField()}</div>
          <div className="input-container">{renderCheckbox()}</div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
