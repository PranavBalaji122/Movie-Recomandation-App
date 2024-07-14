import './App.css'
import React from 'react'
import { Navigate, Routes, Route, BrowserRouter } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import ProtectedRoutes from './components/ProtectedRoutes'
import NotFound from './pages/NotFound'
import About from './pages/about'
import Navbar from './pages/navbar'
import Dashboard from './pages/dashboard'


function Logout(){
  localStorage.clear()
  return <Navigate to = "/logiin"/>
}

function RegisterAndLogout(){
  localStorage.clear()
  return <Register/>

}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path = "/"
          element ={
            <ProtectedRoutes>
              <Navbar />
            </ProtectedRoutes>
          }
        />
        <Route path = "/login" element = {<Login/>} />
        <Route path = "/register" element = {<Register/>} />
        <Route path = "*" element = {<NotFound/>}/>
        <Route path = "/about" element = {<About/>}/>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
