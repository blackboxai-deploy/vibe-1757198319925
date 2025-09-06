"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const { state, addPoints } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    if (!state.hasCompletedOnboarding || !state.user) {
      router.push('/');
    }
  }, [state.hasCompletedOnboarding, state.user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-red-950 to-black">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!state.user) {
    return null;
  }

  const categories = [
    {
      title: '💪 Entrenamientos',
      description: 'Tus ejercicios personalizados',
      color: 'from-red-600 to-red-800',
    },
    {
      title: '🥗 Nutrición',
      description: 'Plan alimentario equilibrado',
      color: 'from-red-500 to-red-700',
    },
    {
      title: '😴 Sueño',
      description: 'Rutina para mejor descanso',
      color: 'from-red-700 to-red-900',
    }
  ];

  const mockWorkouts = [
    { name: 'Sentadilla Libre', sets: 3, reps: '12-15', muscle: 'Piernas', completed: false },
    { name: 'Flexiones de Brazos', sets: 3, reps: '8-12', muscle: 'Pecho', completed: false },
    { name: 'Plancha', sets: 3, reps: '30s', muscle: 'Core', completed: false },
    { name: 'Caminata', sets: 1, reps: '20 min', muscle: 'Cardio', completed: false },
  ];

  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());

  const handleExerciseComplete = (index: number) => {
    setCompletedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
        addPoints(10);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black">
      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-t border-red-800/60">
        <div className="flex items-center justify-around h-16 px-4">
          <Button variant="ghost" className="flex flex-col items-center text-red-400">
            <span className="text-lg">🏠</span>
            <span className="text-xs">Inicio</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center text-gray-400">
            <span className="text-lg">💪</span>
            <span className="text-xs">Entreno</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center text-gray-400">
            <span className="text-lg">🥗</span>
            <span className="text-xs">Dieta</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center text-gray-400">
            <span className="text-lg">😴</span>
            <span className="text-xs">Sueño</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center text-gray-400">
            <span className="text-lg">👤</span>
            <span className="text-xs">Perfil</span>
          </Button>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-sm border-b border-red-800/60">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="text-xl font-bold bg-gradient-to-r from-red-500 via-red-400 to-red-300 bg-clip-text text-transparent">
            shape.me
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right text-sm">
              <div className="text-red-300 text-xs">
                Nivel {state.progress?.level || 1}
              </div>
              <div className="text-red-200 text-xs">
                {state.progress?.totalPoints || 0} pts
              </div>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {state.user?.name?.[0] || 'U'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 pt-24 pb-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            ¡Hola, {state.user.name}! 👋
          </h1>
          <p className="text-gray-100 text-lg">
            Continúa tu viaje de transformación
          </p>
        </div>

        {/* Points Display */}
        <Card className="bg-gradient-to-br from-red-950/60 to-black/80 border-red-800/40 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>🏆 Gamificación</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-400">{state.progress?.totalPoints || 0}</div>
                <div className="text-xs text-gray-200">puntos totales</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {state.progress?.streak || 0}
                </div>
                <div className="text-gray-200 text-sm">Días consecutivos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-300">
                  {state.progress?.level || 1}
                </div>
                <div className="text-gray-200 text-sm">Nivel actual</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">
                  {completedExercises.size}
                </div>
                <div className="text-gray-200 text-sm">Hoy completados</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Categories */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {categories.map((category, index) => (
            <Card
              key={index}
              className="bg-gray-900/60 border-red-800/50 backdrop-blur-sm hover:bg-gray-900/80 hover:border-red-600/70 transition-all cursor-pointer"
            >
              <CardHeader>
                <CardTitle className="text-white text-xl">{category.title}</CardTitle>
                <p className="text-gray-100 text-sm">{category.description}</p>
              </CardHeader>
              <CardContent>
                <div className={`h-2 bg-gradient-to-r ${category.color} rounded-full mb-4`}></div>
                <div className="flex justify-center">
                  <Button 
                    size="sm" 
                    className="bg-red-700 hover:bg-red-600 text-white"
                  >
                    Ver Detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Today's Workout */}
        <Card className="bg-gray-900/60 border-red-800/50 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-white">Entrenamiento de Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockWorkouts.map((exercise, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    completedExercises.has(index)
                      ? 'bg-red-900/30 border-red-500/30' 
                      : 'bg-gray-800/30 border-gray-700/30'
                  } border`}
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{exercise.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-200">
                      <span>{exercise.sets} series</span>
                      <span>{exercise.reps} reps</span>
                      <Badge className="bg-red-600">{exercise.muscle}</Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={completedExercises.has(index) ? "default" : "outline"}
                    onClick={() => handleExerciseComplete(index)}
                    className={
                      completedExercises.has(index)
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'border-gray-600 text-white hover:bg-gray-600'
                    }
                  >
                    {completedExercises.has(index) ? '✓' : '○'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Premium CTA */}
        <Card className="bg-gradient-to-r from-red-900/30 to-black/60 border-red-700/40 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              ¿Quieres un Nuevo Plan Personalizado?
            </h3>
            <p className="text-gray-100 mb-6">
              Crea variaciones de tu plan o experimenta nuevos objetivos con nuestros planes premium
            </p>
            <Button className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white">
              Desbloquear Premium ✨
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}