"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  User, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  sendEmailVerification
} from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  role: "student" | "admin" | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  requireVerification: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  requireVerification: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"student" | "admin" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      // Clean up previous snapshot if it exists (fixes React Strict Mode duplicate listeners)
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (user) {
        setUser(user);
        
        // Fetch custom claims or role from Firestore
        try {
          const idTokenResult = await user.getIdTokenResult();
          
          // Check custom claims first
          if (idTokenResult.claims.role) {
            setRole(idTokenResult.claims.role as "student" | "admin");
          } else {
            // Fallback to Firestore
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().role) {
              setRole(docSnap.data().role);
            } else {
              setRole("student"); // Default
            }
          }
          
          // Sync auth state to cookies for Next.js Middleware
          const token = await user.getIdToken();
          document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Strict;`;

          // Handle Concurrent Logins (Safe fallback if crypto is not available on non-localhost IPs)
          const currentSessionId = typeof crypto !== 'undefined' && crypto.randomUUID 
            ? crypto.randomUUID() 
            : Math.random().toString(36).substring(2) + Date.now().toString(36);
          await setDoc(doc(db, "users", user.uid), { currentSessionId }, { merge: true });
          
          // Listen to changes to sign out if session ID changes (another login)
          unsubscribeSnapshot = onSnapshot(doc(db, "users", user.uid), (doc) => {
            if (doc.exists() && doc.data().currentSessionId !== currentSessionId) {
              console.warn("Concurrent login detected. Signing out.");
              firebaseSignOut(auth);
              alert("You have been signed out because your account was accessed from another device.");
            }
          });

        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
        setRole(null);
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      setLoading(false);
    });

    return () => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
      unsubscribeAuth();
    };
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' }); // Force account selection
    try {
      const result = await signInWithPopup(auth, provider);
      
      // Create user doc if it doesn't exist
      const docRef = doc(db, "users", result.user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          role: "student",
          createdAt: new Date(),
          updatedAt: new Date(),
          disabled: false
        });
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const requireVerification = user ? !user.emailVerified : false;

  return (
    <AuthContext.Provider value={{ user, role, loading, signInWithGoogle, signOut, requireVerification }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
