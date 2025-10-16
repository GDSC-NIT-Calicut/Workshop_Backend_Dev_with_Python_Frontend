import React from 'react'
import { createContext, useContext } from 'react'

const authContext = createContext(null)

export const AuthProvider = ({ children, value }) => {
  return <authContext.Provider value={value}>{children}</authContext.Provider>
}

export default authContext