import React from 'react'
import "../styles/Sidebar.css"
import {Link} from 'react-router-dom'
import add_product_icon from '../assets/Product_Cart.svg'
import list_product_icon from '../assets/Product_list_icon.svg'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Link to={'/admin/allhome'} style={{textDecoration:"none"}}>
      <div className="sidebar-item">
        <img src={list_product_icon} alt="" />
      <p>All Home Silders</p>
      </div>
      </Link>
      <Link to={'/admin/allusers'} style={{textDecoration:"none"}}>
      <div className="sidebar-item">
        <img src={add_product_icon} alt="" />
      <p>All Users Details</p>
      </div>
      </Link>
      <Link to={'/admin/allproduct'} style={{textDecoration:"none"}}>
      <div className="sidebar-item">
        <img src={add_product_icon} alt="" />
      <p>All Products List</p>
      </div>
      </Link>
      <Link to={'/admin/newlaunch'} style={{textDecoration:"none"}}>
      <div className="sidebar-item">
        <img src={list_product_icon} alt="" />
      <p>NewLaunch List</p>
      </div>
      </Link> 
      <Link to={'/admin/gifting'} style={{textDecoration:"none"}}>
      <div className="sidebar-item">
        <img src={list_product_icon} alt="" />
      <p>Giftings Products</p>
      </div>
      </Link> 
      <Link to={'/admin/allorders'} style={{textDecoration:"none"}}>
      <div className="sidebar-item">
        <img src={list_product_icon} alt="" />
      <p>All Orders  Details</p>
      </div>
      </Link>
      <Link to={'/admin/allblog'} style={{textDecoration:"none"}}>
      <div className="sidebar-item">
        <img src={list_product_icon} alt="" />
      <p>All Blogs  Details</p>
      </div>
      </Link>
      <Link to={'/admin/allfeedback'} style={{textDecoration:"none"}}>
      <div className="sidebar-item">
        <img src={list_product_icon} alt="" />
      <p>All Feedback List</p>
      </div>
      </Link>
      <Link to={'/admin/alloffers'} style={{textDecoration:"none"}}>
      <div className="sidebar-item">
        <img src={list_product_icon} alt="" />
      <p>All Offers  Details</p>
      </div>
      </Link>
    </div>
  )
}

export default Sidebar
