import React, { createContext, useState } from 'react'

const FocusUserContext = createContext()

export const ProviderWithState = ({ children }) => {
  const [focusedUserId, focusUser] = useState(null)
  return (
    <FocusUserContext.Provider value={{
      focusedUserId,
      focusUser
    }}>
      { children }
    </FocusUserContext.Provider>
  )
}

export default FocusUserContext
