import { AuthProvider } from './state/auth'

export default function AppProviders({ children }){
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}

