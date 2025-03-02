import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  return { user };
};
