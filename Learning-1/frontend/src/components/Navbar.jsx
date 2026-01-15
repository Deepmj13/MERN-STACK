import React from 'react'
import { Plus } from 'lucide-react';
import { Link } from 'react-router';

function Navbar() {
  return (
    <div className="header">
      <span className="logo">
        ThinkBoard
      </span>
      <span className="create">
        <Link to={"/create"} className='lnk'><Plus />Create Note</Link>
      </span>
    </div>
  )
}

export default Navbar;