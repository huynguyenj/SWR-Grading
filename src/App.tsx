import { RouterProvider } from 'react-router/dom'
import { router } from './routers/router'
import { Slide, ToastContainer } from 'react-toastify'

function App() {
  return (
    <>
      <ToastContainer
        position='top-center'
        hideProgressBar
        autoClose={3000}
        transition={Slide}
        newestOnTop
        pauseOnHover={false}
        theme='colored'
        closeButton={false}
        closeOnClick
        stacked
      />
      <RouterProvider router={router}/>
    </>
  )
}

export default App
