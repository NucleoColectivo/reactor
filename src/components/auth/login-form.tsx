'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth, createUserProfileDocument } from '@/firebase';
import { AuthError, createUserWithEmailAndPassword, getAuth, signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';

export function LoginForm() {
  const auth = useAuth() ?? getAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleAuthError = (error: AuthError) => {
    console.error(error);
    let title = 'Error de Autenticación';
    let description = 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.';

    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/invalid-credential':
        title = 'Credenciales incorrectas';
        description = 'El correo o la contraseña no son correctos. Inténtalo de nuevo.';
        break;
      case 'auth/wrong-password':
        title = 'Contraseña incorrecta';
        description = 'La contraseña no es correcta. Inténtalo de nuevo.';
        break;
      case 'auth/email-already-in-use':
        title = 'Correo en uso';
        description = 'Ya existe una cuenta con este correo electrónico.';
        break;
      case 'auth/weak-password':
        title = 'Contraseña débil';
        description = 'La contraseña debe tener al menos 6 caracteres.';
        break;
      default:
        description = error.message;
    }
    toast({
      variant: 'destructive',
      title: title,
      description: description,
    });
  }

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      createUserProfileDocument(userCredential.user);
    } catch (e) {
      handleAuthError(e as AuthError);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      handleAuthError(e as AuthError);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAnonymousSignIn = async () => {
    setLoading(true);
    try {
      const userCredential = await signInAnonymously(auth);
      createUserProfileDocument(userCredential.user);
    } catch (e) {
      handleAuthError(e as AuthError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Acceder</CardTitle>
        <CardDescription>
          Ingresa tu correo para crear una cuenta o acceder a tu laboratorio.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" required disabled={loading} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex w-full gap-2">
            <Button onClick={handleSignIn} className="w-full" disabled={loading || !email || !password}>Acceder</Button>
            <Button onClick={handleSignUp} className="w-full" variant="outline" disabled={loading || !email || !password}>Crear Cuenta</Button>
        </div>
         <Button onClick={handleAnonymousSignIn} className="w-full" variant="secondary" disabled={loading}>
          Continuar como Anónimo
        </Button>
      </CardFooter>
    </Card>
  );
}
