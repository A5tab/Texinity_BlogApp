import Layout from "./Layout"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react";
import { setUpAxiosInterceptors } from "./api/setupAxiosInterceptors";

function App() {

  const navigate = useNavigate();
  useEffect(() => {
    setUpAxiosInterceptors(navigate);
  }, [])

  return (
    <>
      <Layout />
    </>
  )

}

export default App
