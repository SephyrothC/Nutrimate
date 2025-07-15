#!/bin/bash

echo "🚀 Démarrage de NutriMate..."

# Fonction pour nettoyer les processus
cleanup() {
    echo "🛑 Arrêt des serveurs..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Gérer Ctrl+C
trap cleanup SIGINT

# Démarrer le backend
echo "🐍 Démarrage du backend FastAPI..."
cd backend
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate
python run.py &
BACKEND_PID=$!

# Attendre un peu
sleep 3

# Démarrer le frontend
echo "⚛️ Démarrage du frontend React..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Serveurs démarrés !"
echo "📱 Frontend: http://localhost:3000"
echo "🔌 Backend: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter"

# Attendre
wait
