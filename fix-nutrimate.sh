#!/bin/bash

echo "🚀 Correction rapide de NutriMate..."

# Se placer dans le bon dossier
cd "$(dirname "$0")"

# Vérifier si on est dans le bon dossier
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Erreur: Vous devez lancer ce script depuis la racine du projet NutriMate"
    exit 1
fi

echo "📁 Dossier de travail: $(pwd)"

# 1. Correction Backend
echo "🐍 Configuration du backend..."
cd backend

# Corriger le requirements.txt (ajouter pydantic-settings)
echo "fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
alembic==1.12.1
pydantic==2.5.0
pydantic-settings==2.1.0
python-jose==3.3.0
passlib==1.7.4
bcrypt==4.1.1
python-multipart==0.0.6
httpx==0.25.2
reportlab==4.0.7
python-dotenv==1.0.0
psycopg2-binary==2.9.9" > requirements.txt

# Installer les dépendances backend
if [ ! -d "venv" ]; then
    echo "🔧 Création de l'environnement virtuel..."
    python3 -m venv venv
fi

source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null || echo "⚠️ Impossible d'activer l'environnement virtuel"

pip install -r requirements.txt

# Créer .env si inexistant
if [ ! -f ".env" ]; then
    echo "📝 Création du fichier .env..."
    cat > .env << EOF
# Application
APP_NAME=NutriMate
DEBUG=True
SECRET_KEY=nutrimate-super-secret-key-change-in-production-2024

# Database
DATABASE_URL=sqlite:///./nutrimate.db

# AI Service
DEEPSEEK_API_KEY=sk-7c53295873364c99a9a980fec5e95def
DEEPSEEK_API_URL=https://api.deepseek.com/v1

# Security
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
EOF
fi

cd ..

# 2. Correction Frontend
echo "⚛️ Configuration du frontend..."
cd frontend

# Nettoyer et réinstaller les dépendances
echo "🧹 Nettoyage des dépendances..."
rm -rf node_modules package-lock.json

echo "📦 Installation des dépendances..."
npm install

# Créer .env si inexistant
if [ ! -f ".env" ]; then
    echo "📝 Création du fichier .env frontend..."
    cat > .env << EOF
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=NutriMate
EOF
fi

# Corriger les imports manquants dans Input.jsx
echo "🔧 Correction des imports React Hook Form..."
cat > src/components/common/Input.jsx << 'EOF'
import React, { forwardRef } from 'react'

const Input = forwardRef(({ 
  label, 
  error, 
  className = '', 
  ...props 
}, ref) => {
  const inputClasses = `input ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`
  
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input ref={ref} className={inputClasses} {...props} />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
EOF

cd ..

# 3. Ajout du .gitignore manquant
echo "📝 Création du .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
venv/
env/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Database
*.db
*.sqlite
*.sqlite3

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# PyInstaller
*.manifest
*.spec

# Unit test / coverage reports
htmlcov/
.tox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
.hypothesis/
.pytest_cache/

# Translations
*.mo
*.pot

# Django stuff:
*.log
local_settings.py
db.sqlite3

# Flask stuff:
instance/
.webassets-cache

# Scrapy stuff:
.scrapy

# Sphinx documentation
docs/_build/

# PyBuilder
target/

# Jupyter Notebook
.ipynb_checkpoints

# pyenv
.python-version

# celery beat schedule file
celerybeat-schedule

# SageMath parsed files
*.sage.py

# Environments
.env
.venv
env/
venv/
ENV/
env.bak/
venv.bak/

# Spyder project settings
.spyderproject
.spyproject

# Rope project settings
.ropeproject

# mkdocs documentation
/site

# mypy
.mypy_cache/

# Build outputs
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
EOF

# 4. Script de lancement simple
echo "🎯 Création du script de lancement..."
cat > start.sh << 'EOF'
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
EOF

chmod +x start.sh

echo ""
echo "✅ Corrections appliquées avec succès !"
echo ""
echo "🚀 Pour démarrer l'application :"
echo "   ./start.sh"
echo ""
echo "🔧 Ou manuellement :"
echo "   Backend:  cd backend && source venv/bin/activate && python run.py"
echo "   Frontend: cd frontend && npm run dev"
echo ""
echo "📝 N'oubliez pas de configurer votre clé DeepSeek dans backend/.env"