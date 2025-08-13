import { useSelector, useDispatch } from 'react-redux'
import { login, signup } from '../features/auth/thunks';
import AuthForm from '../components/AuthForm'

function Signup() {
  const dispatch = useDispatch()
  const { error, laoding } = useSelector(state => state.auth);
  async function onSubmit(data) {
    try {
      const res = await dispatch(signup(data)).unwrap();
      if (res.success) {
        await dispatch(login({
          username: data.username,
          password: data.password
        })).unwrap();
        navigate("/"); 
      }

    } catch (error) {
      console.log(error);
    }
  }
  return (
    <AuthForm type={"signup"} onSubmit={onSubmit} error={error} loading={laoding}></AuthForm>
  )
}

export default Signup