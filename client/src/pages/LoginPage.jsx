import AuthForm from '../components/AuthForm'
import { login } from '../features/auth/thunks.js';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {error, laoding} = useSelector(state => state.auth);
  async function onSubmit(data) {
    try {
      const res = await dispatch(login(data)).unwrap();
      if (res.success) {
        navigate("/dashboard");
      }

    } catch (error) {
      console.log(error);
    }
  }
  return (
    <AuthForm type={"login"} onSubmit={onSubmit} error={error} loading={laoding}></AuthForm>
  )
}

export default Login