import { useEffect } from 'react';
import { auth } from '../services/firebase';

const FirebaseTest = () => {
  useEffect(() => {
    console.log('Firebase auth object:', auth);
    console.log('Firebase config:', auth.config);
    console.log('Firebase app:', auth.app);
  }, []);

  return <div>Check console for Firebase debug info</div>;
};

export default FirebaseTest;