import React from 'react'
import { CFooter } from '@coreui/react'
import { Link } from "react-router-dom";

const TheFooter = () => {
  return (
    <CFooter fixed={false} className="bg-black container">
      <div>
        <Link to="/home" className="text-decoration-none footer-text-color">Home</Link>
        <Link to="/privacy" className="text-decoration-none ml-3 footer-text-color">Privacy Policy</Link>
        <Link to="/terms" className="text-decoration-none ml-3 footer-text-color">Terms of Use</Link>
        <Link to="/content-policy" className="text-decoration-none ml-3 footer-text-color">Content Policy</Link>
        <Link to="/code-ethics" className="text-decoration-none ml-3 footer-text-color">Code of Ethics</Link>
      </div>
      <div className="mfs-auto">
        <span className="mr-1 footer-text-color">© 2021 Decentraland</span>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
