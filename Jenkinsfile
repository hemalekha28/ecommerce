pipeline {
    agent any

    environment {
        MONGODB_URI = credentials('MONGODB_URI')
        JWT_SECRET  = credentials('JWT_SECRET')
        RAZORPAY_KEY_ID = credentials('RAZORPAY_KEY_ID')
        RAZORPAY_KEY_SECRET = credentials('RAZORPAY_KEY_SECRET')
    }

    stages {
        stage('Clone') {
            steps {
                checkout scm
            }
        }

        stage('Build API') {
            steps {
                echo 'Building Backend Image...'
                sh 'docker build -t mern-api ./backend'
            }
        }

        stage('Test') {
            steps {
                echo 'Running Backend Tests...'
                sh 'docker run --rm mern-api npm test -- --passWithNoTests'
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building Frontend Image...'
                sh 'docker build --build-arg VITE_API_URL=http://localhost:5000 -t mern-frontend ./frontend'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Redeploying Containers...'
                // Ensure network exists
                sh 'docker network create mern-network || true'
                
                // Cleanup old containers
                sh 'docker stop mern-api mern-frontend mern-mongodb || true'
                sh 'docker rm mern-api mern-frontend mern-mongodb || true'
                
                // 1. Run MongoDB
                sh 'docker run -d --name mern-mongodb -v mongo-data:/data/db --network mern-network mongo:latest'
                
                // 2. Run Backend
                sh """
                docker run -d --name mern-api \
                --network mern-network \
                -e MONGODB_URI=mongodb://mern-mongodb:27017/ecommerce \
                -e JWT_SECRET=${JWT_SECRET} \
                -e RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID} \
                -e RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET} \
                -p 5000:5000 \
                mern-api
                """
                
                // 3. Run Frontend
                sh 'docker run -d --name mern-frontend --network mern-network -p 80:80 mern-frontend'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed.'
        }
    }
}
