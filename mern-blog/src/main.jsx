import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import {store} from './redux/store.js'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from './redux/store.js'
import ThemeProvider from './components/ThemeProvider.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Projects from './pages/Projects.jsx'
import Singin from './pages/Signin.jsx'
import SignUp from './pages/SignUp.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import CreatePost from './pages/CreatePost.jsx'
import UpdatePost from './pages/UpdatePost.jsx'
import PostPage from './pages/PostPage.jsx'
import App from './pages/App.jsx'
import Search from './pages/Search.jsx'

const router = createBrowserRouter([
  {
    path:"/",
    element: <App/>,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/search",
        element: <Search/>
      },
      {
        path:"/about",
        element:<About/>
      },
      {
        element: <PrivateRoute/>,
        children: [
          {
            path:"/dashboard",
            element: <Dashboard/>
          }
        ]
      },
      {
        element: <AdminRoute/>,
        children: [
          {
            path:"/create-post",
            element: <CreatePost/>
          },
          {
            path: "/update-post/:postId",
            element: <UpdatePost/>
          }
        ]
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
      },
      {
        path:"/post/:postSlug",
        element: <PostPage/>
      }
    ]
  },
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider>
            <RouterProvider router={router}>
            </RouterProvider>   
          </ThemeProvider>
      </PersistGate>
  </Provider>,
  </React.StrictMode>,
)
