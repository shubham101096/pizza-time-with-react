import React, { useState } from "react";
import "./loginModal.css";
import LinkButton from "../Button";
import { useNavigate } from "react-router-dom";
import validateForm from "../validateForm";

const LoginModal = ({ setLoginModalWindow, setValidLogin, loginModalWindow, hideMenu, validLogin, getUser }) => {
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState({});
  const [loading, setLoading] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const validate = validateForm("login");

  const handleValidation = (e) => {
    const { name, value } = e.target;
    setFormValue((prevFormValue) => ({
      ...prevFormValue,
      [name]: value,
    }));
  };

  const hideLoginModal = () => {
    setLoginModalWindow(false);
    setFormValue({ email: '', password: '' });
    setFormError({});
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError(validate(formValue));

    if (Object.keys(validate(formValue)).length > 0) {
      setLoading(false);
      return;
    } else {
      try {
        const response = await fetch(`${process.env.REACT_APP_LOGIN_URL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formValue),
        });

        const result = await response.json();
        console.log('// response---', result);

        if (result.statusCode === 200) {
          // Successful login
          console.log('// Successful login');
          getUser(result.data.id);
          setValidLogin(true);
          hideLoginModal();
          navigate('/menu');
        } else {
          console.log('// Failed login')
          // Failed login
          setVerificationError(result.error || 'Invalid credentials');
        }
      } catch (error) {
        console.log('// error login')
        console.error('Error:', error.message);
        setVerificationError('Internal Server Error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <article className={`modal ${loginModalWindow ? 'active-modal' : null}`}>
      <section className="modal-main">
        <button
          className="close-modal-btn"
          type="button"
          onClick={hideLoginModal}
        >
          X
        </button>
        <section className="modal-content">
          <h2>Log in</h2>
          {loading ? (
            <div role="status" className="loader">
              <p>Almost there...</p>
              <img
                alt="Processing request"
                src="https://media0.giphy.com/media/L05HgB2h6qICDs5Sms/giphy.gif?cid=ecf05e472hf2wk1f2jou3s5fcnx1vek6ggnfcvhsjbeh7v5u&ep=v1_stickers_search&rid=giphy.gif&ct=s"
              />
            </div>
          ) : (
            <form onSubmit={handleLogin}>
              {verificationError.length === 0 ? null : (
                <p className="login-input-err">{verificationError}</p>
              )}
              <input
                onChange={handleValidation}
                value={formValue.email}
                name="email"
                type="text"
                placeholder="Email"
              />
              <span className="login-input-err">{formError.email}</span>
              <input
                onChange={handleValidation}
                value={formValue.password}
                name="password"
                type="password"
                autoComplete="true"
                placeholder="Password"
              />
              <span className="login-input-err">{formError.password}</span>
              <section className="login-and-signup">
                <LinkButton
                  onClick={() => {
                    hideLoginModal();
                    hideMenu();
                  }}
                  to="/register"
                  className="modal-signup-btn"
                >
                  Sign up
                </LinkButton>
                <button type="submit" className="modal-login-btn">
                  Log in
                </button>
              </section>
            </form>
          )}
        </section>
      </section>
    </article>
  );
};

export default LoginModal;
