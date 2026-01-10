import { ArrowBigLeft } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router'

function Createnote() {
  return (
    <section className="container">
      <div className="content">
        <div className="backlink">
          <Link to={"/"}><ArrowBigLeft/> Back</Link>
        </div>
        <form>
          <span>
            Create a Note
          </span>
        <div className="formcontent">
          <input type="text" placeholder='Title'/>
          <textarea placeholder='Content' rows={4}></textarea>
          <button >Create</button>
        </div>
        </form>
      </div>
    </section>
  )
}

export default Createnote