import axios from 'axios';
import { ArrowBigLeft } from 'lucide-react'
import React, {useState } from 'react'
import { Link } from 'react-router'

function Createnote() {
const [title,setTitle]= useState("");
const [content,setContent]= useState("");
const [loading,setLoading] = useState(false);

async function handleForm (e) {
  e.preventDefault();
  setLoading(true);
  if(!title.trim() || !content.trim()){setLoading(false); return alert("all fields required");}
try {
    const created = await axios.post("http://localhost:5001/api/notes",{title,content}) 
    setLoading(false)
    setTitle("")
    setContent("")

} catch (error) {
    alert("not created")
}

  
}
  return (
    <section className="container">
      <div className="content">
        <div className="backlink">
          <Link to={"/"}><ArrowBigLeft/> Back</Link>
        </div>
        <form onSubmit={handleForm}>
          <span>
            Create a Note
          </span>
        <div className="formcontent">
          <input type="text" placeholder='Title'value={title} onChange={(e)=>{setTitle(e.target.value)}}/>
          <textarea placeholder='Content' rows={4} value={content} onChange={(e)=>{setContent(e.target.value)}}></textarea>
          <button type='submit' disabled={loading}>{loading ? "Loading":"Create" }</button>
        </div>
        </form>
      </div>
    </section>
  )
}

export default Createnote