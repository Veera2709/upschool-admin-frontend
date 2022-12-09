import React from 'react'
import Spinner from '../assets/images/Spinner.gif'

const FullPageLoader = () => {
  return (
    <div className='loader-container'>
        <div className='loader'>
            <img alt="loading" src={Spinner} />
        </div>
    </div>
  )
}

export default FullPageLoader