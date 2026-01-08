import { Edit, Plus, Trash } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Ratelimit from './Ratelimit';
import axios from 'axios';
function Home() {
  const [isRatelimit, setIsRatelimit] = useState(true);
  const [isHome, setHome] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/notes');
        setNotes(res.data);
        setHome(true);
        setIsRatelimit(false);
      } catch (error) {
        if (error.response && error.response.status === 429) {
          setIsRatelimit(true);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, [])
  return (
    <>
      <Navbar />
      <section className="hero">
        {isRatelimit && <Ratelimit />}
        {isHome && <Notediv />}

      </section>


    </>
  )
}
const Notediv = () => {
  return (
    <div className="notes">
      {/* <div className="note">
          <span className="title">SQL</span>
          <span className="info">Sql queries like select,update,delete</span>
          <div className="note-action">
            <span className="date">SEP 13</span>
            <span className="actions">
              <a href="http://">
              <Edit/>
              </a>
              <a href="http://">
              <Trash/>
              </a>
            </span>
          </div>
        </div>             */}

      {notes.map((note) => (
        <div className="note" key={note._id}>
          <span className="title">
            {note.title}
          </span>
          <span className="info">{note.content}</span>
          <div className="note-action">
            <span className="date">{new Date(note.createdAt).toLocaleDateString()}</span>
            <span className="actions">
              <a href={`http://localhost:3000/note/${note._id}`}>
                <Edit />
              </a>
              <a href={`http://localhost:5001/api/delete/${note._id}`}><Trash /></a>
            </span>
          </div>
        </div>
      ))}

    </div>
  )
}


export default Home