import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import {store} from './redux/store.js'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from './redux/store.js'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Projects from './pages/Projects.jsx'
import Singin from './pages/Signin.jsx'
import SignUp from './pages/SignUp.jsx'


const router = createBrowserRouter([
  {
    path:"/",
    element: <Home/>,
    children: [
      {
        path:"/about",
        element:<About/>
      },
      {
        path:"/dashboard",
        element:<Dashboard/>
      },
      {
        path:"/projects",
        element:<Projects/>
      },
      {
        path:"/sign-in",
        element:<Singin/>
      },
      {
        path:"/sign-up",
        element:<SignUp/>
      }
    ]
  },
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router}>
          </RouterProvider>   
      </PersistGate>
  </Provider>,
  </React.StrictMode>,
)
