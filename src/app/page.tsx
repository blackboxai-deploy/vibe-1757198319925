"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function HomePage() {
  const { state, dispatch } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    fitnessGoal: 'lose-weight'
  });

  useEffect(() => {
    setIsLoading(false);
    if (state.hasCompletedOnboarding && state.user) {
      router.push('/dashboard');
    }
  }, [state.hasCompletedOnboarding, state.user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.age || !formData.weight || !formData.height) {
      toast.error('Por favor, completa todos los campos');
      return;
    }

    const userProfile = {
      id: `user-${Date.now()}`,
      name: formData.name,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      height: parseInt(formData.height),
      fitnessGoal: formData.fitnessGoal,
      createdAt: new Date().toISOString(),
    };

    const initialProgress = {
      totalPoints: 0,
      level: 1,
      streak: 0,
      completedWorkouts: 0,
    };

    dispatch({ type: 'SET_USER', payload: userProfile });
    dispatch({ type: 'SET_PROGRESS', payload: initialProgress });
    dispatch({ type: 'SET_ONBOARDING_COMPLETE', payload: true });

    toast.success('¡Perfil creado con éxito! Redirigiendo...');
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-red-950 to-black">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (state.hasCompletedOnboarding) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-red-500 via-red-400 to-red-300 bg-clip-text text-transparent">
            shape.me
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-6">
            Tu rutina personalizada de entrenamiento, dieta y sueño
          </p>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Responde algunas preguntas y recibe un plan completamente personalizado 
            para alcanzar tus objetivos de salud y fitness
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900/80 border-red-800/50 backdrop-blur-sm hover:border-red-600/70 transition-colors">
            <CardHeader>
              <CardTitle className="text-white text-center">💪 Entrenamientos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-100 text-center">
                Planes de entrenamiento personalizados basados en tu nivel, 
                objetivos y equipamiento disponible
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/80 border-red-800/50 backdrop-blur-sm hover:border-red-600/70 transition-colors">
            <CardHeader>
              <CardTitle className="text-white text-center">🥗 Nutrición</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-100 text-center">
                Dietas equilibradas con calorías y macros calculados 
                para tus objetivos específicos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/80 border-red-800/50 backdrop-blur-sm hover:border-red-600/70 transition-colors">
            <CardHeader>
              <CardTitle className="text-white text-center">😴 Sueño</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-100 text-center">
                Rutinas de sueño optimizadas para mejorar 
                la calidad y duración del descanso
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gamification Preview */}
        <Card className="bg-gradient-to-r from-red-900/40 to-black/60 border-red-700/40 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">🎮 Sistema Gamificado</h3>
              <p className="text-gray-100 mb-4">
                ¡Gana puntos completando actividades, sube de nivel y desbloquea logros!
              </p>
              <div className="flex justify-center space-x-8 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">+10</div>
                  <div className="text-gray-200">Entrenamiento Completo</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-300">+5</div>
                  <div className="text-gray-200">Comida Seguida</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">+15</div>
                  <div className="text-gray-200">Rutina de Sueño</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Simple Onboarding Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-900/90 border-red-800/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-center text-2xl">
                ¡Vamos a Empezar!
              </CardTitle>
              <p className="text-gray-100 text-center">
                Algunas preguntas rápidas para crear tu plan personalizado
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-200">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white focus:border-red-500"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age" className="text-gray-200">Edad</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white focus:border-red-500"
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight" className="text-gray-200">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white focus:border-red-500"
                      placeholder="70"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="height" className="text-gray-200">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white focus:border-red-500"
                    placeholder="175"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white mt-6"
                >
                  Crear Mi Plan Personalizado
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-300">
          <p>&copy; 2024 shape.me. Transforma tu rutina, transforma tu vida.</p>
        </div>
      </div>
    </div>
  );
}