"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  User, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut
} from "firebase/auth";

type Ctx = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};
const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, u => { setUser(u); setLoading(false); }), []);

  const signIn = (email:string,pw:string) => signInWithEmailAndPassword(auth, email, pw).then(()=>{});
  const signUp = (email:string,pw:string) => createUserWithEmailAndPassword(auth, email, pw).then(()=>{});
  const signOutFn = () => signOut(auth);

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut: signOutFn }}>
    {children}
  </AuthContext.Provider>;
}
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
