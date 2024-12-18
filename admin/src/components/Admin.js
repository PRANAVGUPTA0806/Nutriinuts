import React,{useState,useEffect} from 'react'
import "../styles/Admin.css";
import Sidebar from './Sidebar'
import {Routes,Route,useLocation} from 'react-router-dom'
import AllUser from './AllUser';
import AllProduct from './AllProduct';
import Allnewlaunch from './Allnewlaunch';
import Allgiftings from './Allgiftings'; // Make sure this matches the exact file name
import AllOrder from './AllOrder';
import AllBlog from './AllBlog';
import AllFeedback from './AllFeedback';
import AllOffers from './AllOffers';
import AllHome from './AllHome';


const Admin = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 800);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <div className='admin'>
      <Sidebar/>
      {(location.pathname === '/admin' || location.pathname === '/admin/') && (
        <h3
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh', // Full viewport height for vertical centering
            margin: 0, // Remove default margins
            textAlign: 'center',
            position: 'absolute', // Positioning for centering
            left: isMobile ? '50%' : '65%', // Adjusts left based on screen size
            top: isMobile ? '90%' : '60%', // Adjusts top based on screen size
            transform: 'translate(-50%, -50%)', // Centering with transform
          }}
        >
          Admin Dashboard
        </h3>
      )}
      <Routes>
           <Route path='allhome' element={<AllHome/>}/>
            <Route path='allusers' element={<AllUser/>}/>
            <Route path='allproduct' element={<AllProduct/>}/>
            <Route path='newlaunch' element={<Allnewlaunch/>}/>
            <Route path='gifting' element={<Allgiftings/>}/>
            <Route path='allorders' element={<AllOrder/>}/>
            <Route path='allblog' element={<AllBlog/>}/>
            <Route path='allfeedback' element={<AllFeedback/>}/>
            <Route path='alloffers' element={<AllOffers/>}/>
      </Routes>
    </div>
  )
}

export default Admin
