import { CloudLightning } from 'lucide-react'
import React from 'react'
import Navbar from '../components/Navbar'

function Ratelimit() {
  return (
    <>
    <section className='section'>
            <div className="content">
                <span className="img">
                    <CloudLightning/>
                </span>
                <h1>Rate Limit Exceeded</h1>
                </div>
    </section>
    </>
  )
}

export default Ratelimit