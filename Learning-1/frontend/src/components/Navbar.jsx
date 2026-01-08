import React from 'react'
import { Plus } from 'lucide-react';

function Navbar() {
  return (
    <div className="header">
      <span className="logo">
        ThinkBoard
      </span>
      <span className="create">
        <button><Plus />Create Note</button>
      </span>
    </div>
  )
}

export default Navbar;