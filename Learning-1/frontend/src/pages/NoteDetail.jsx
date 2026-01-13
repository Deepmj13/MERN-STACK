import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../lib/axios";

function NoteDetail() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setTitle(res.data.message.title);
        setContent(res.data.message.content);
      } catch (err) {
        setError("Failed to load note");
      } finally {
        setLoading(false);
        console.log(title)
      }
    };

    fetchNote();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="container">
      <div className="content">
        <div className="backlink">
          <Link to="/">
            <ArrowLeft /> Back
          </Link>
        </div>

        <div className="note-detail">
          <h1>{title}</h1>
          <p>{content}</p>
        </div>
      </div>
    </section>
  );
}

export default NoteDetail;
