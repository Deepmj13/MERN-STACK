import { Edit,  HelpCircleIcon,  Trash } from 'lucide-react'
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
  const onDelete = async (id) =>{
    const deletedNote = await axios.delete(`http://localhost:5001/api/notes/${id}`);
    if(deletedNote.status === 200){
      setNotes(notes.filter(note => note._id !== id));
    }
  }
  const onEdit = async (id,updateContent) =>{ 
  const editedNote = await axios.put(`http://localhost:5001/api/notes/${id}`,{content:updateContent});
  if(editedNote.status === 200){
    const updatedNotes = notes.map(note => {
      if(note._id === id){
        return {...note, content: updateContent};
      }
      return note;
    });
} }
  return (
    <div>
      <Navbar />
      <section className="hero">
        {isRatelimit && <Ratelimit />}
        {isHome && <Notediv  notes={notes} onDelete={onDelete} onEdit={onEdit}/>}

      </section>


    </div>
  )
}
const Notediv = ({notes,onDelete,onEdit}) => {
  return (
    <div className="notes">
      {notes.map((note) => (
        <div className="note" key={note._id}>
          <span className="title">
            {note.title}
          </span>
          <span className="info">{note.content}</span>
          <div className="note-action">
            <span className="date">{new Date(note.createdAt).toLocaleDateString()}</span>
            <span className="actions">
              <button onClick={() => onEdit(note._id,note.content)} style={{background:'none',border:'none',cursor:'pointer',color:'#fff'}}>
                <Edit />
              </button>
              <button onClick={()=>onDelete(note._id)} style={{background:'none',border:'none',cursor:'pointer',color:'#fff'}}> <Trash /></button>
            </span>
          </div>
        </div>
      ))}

    </div>
  )
}


export default Home



// import { Edit, Trash } from 'lucide-react'
// import React, { useEffect, useState } from 'react'
// import Navbar from '../components/Navbar'
// import Ratelimit from './Ratelimit';
// import axios from 'axios';

// function Home() {
//   // Fix 1: Default to false so error doesn't show on load
//   const [isRatelimit, setIsRatelimit] = useState(false);
//   const [notes, setNotes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchNotes = async () => {
//       try {
//         const res = await axios.get('http://localhost:5001/api/notes');
//         setNotes(res.data);
//         setIsRatelimit(false);
//       } catch (error) {
//         if (error.response && error.response.status === 429) {
//           setIsRatelimit(true);
//         }
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchNotes();
//   }, [])

//   // Fix 2: Handle delete inside the app, don't navigate away
//   const handleDelete = async (id) => {
//     try {
//       // Change to axios.delete (or axios.get if your backend requires it)
//       await axios.delete(`http://localhost:5001/api/delete/${id}`);
      
//       // Update UI immediately by removing the deleted item
//       setNotes(notes.filter(note => note._id !== id));
//     } catch (error) {
//       console.error("Error deleting note", error);
//     }
//   }

//   return (
//     <div>
//       <Navbar />
//       <section className="hero">
//         {loading && <p>Loading...</p>}
//         {!loading && isRatelimit && <Ratelimit />}
        
//         {/* Pass notes AND the delete handler to the child component */}
//         {!loading && !isRatelimit && <Notediv notes={notes} onDelete={handleDelete} />}
//       </section>
//     </div>
//   )
// }

// // Fix 3: Destructure props ({ notes, onDelete })
// const Notediv = ({ notes, onDelete }) => {
//   return (
//     <div className="notes">
//       {notes.map((note) => (
//         <div className="note" key={note._id}>
//           <span className="title">
//             {note.title}
//           </span>
//           <span className="info">{note.content}</span>
//           <div className="note-action">
//             <span className="date">{new Date(note.createdAt).toLocaleDateString()}</span>
//             <span className="actions">
//               <a href={`http://localhost:3000/note/${note._id}`}>
//                 <Edit />
//               </a>
//               {/* Fix 4: Use a button or span with onClick, not an anchor tag */}
//               <span 
//                 onClick={() => onDelete(note._id)} 
//                 style={{cursor: 'pointer'}}
//               >
//                 <Trash />
//               </span>
//             </span>
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }

// export default Home