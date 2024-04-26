import { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { closeModal } = useModal();

  useEffect(() => {
    errors;

    console.log({ errors });
  }, [errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        setIsSubmitted(true);
        const data = await res.json();
        console.log({ error: data.message });
        if (data && data.message) {
          setErrors(data.message);
        }
      });
  };
  const handleDemo = (e) => {
    e.preventDefault();
    return dispatch(
      sessionActions.login({ credential: "Demo-lition", password: "password" })
    )
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        setErrors(data);
      });
  };

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleDemo}>
        <button type="submit">Log In as Demo User</button>
      </form>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p>{errors.credential}</p>}
        <button
          type="submit"
          disabled={credential.length < 4 || password.length < 6}
        >
          Log In
        </button>
        {isSubmitted && errors && (
          <p className="error">The provided credentials were invalid</p>
        )}
      </form>
    </>
  );
}

export default LoginFormModal;
