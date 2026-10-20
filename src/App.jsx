import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './Landing'
import Browse from './Browse'
import Detail from './Detail'
import Profile from './Profile'
import Signup from './Signup'
import Login from './Login'
import Verify from './Verify'
import MyShop from './MyShop'
import NewItems from './NewItems'
import EditItem from './EditItem'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/product/:id" element={<Detail />} />
        <Route path="/vendor/:vendorId" element={<Profile />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/my-shop" element={<MyShop />} />
        <Route path="/my-shop/new" element={<NewItems />} />
        <Route path="/my-shop/edit/:id" element={<EditItem />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App