import React from 'react'
function BasicSpinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', 'justifyContent': 'center' }}>
      <div className={['spinner-border', 'mr-1', 'text-primary'].join(' ')} role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}

export default BasicSpinner