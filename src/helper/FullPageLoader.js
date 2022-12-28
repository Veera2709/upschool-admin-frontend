import React from 'react';
import Spinner from '../assets/images/Spinner.gif';
// import Spinner from '../assets/images/loading.gif';
// import Spinner from '../assets/images/loader.gif';

const FullPageLoader = () => {
  return (
    <div className='loader-container'>
        <div className='loader'>
            <img width="70" alt="loading" src={Spinner} />
        </div>
    </div>
  )
}

export default FullPageLoader