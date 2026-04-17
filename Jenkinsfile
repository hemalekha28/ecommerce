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

        stage('Deploy to Kubernetes') {
            steps {
                echo 'Deploying to Kubernetes cluster...'
                sh """
                # 1. Create/Update Kubernetes Secrets
                # We delete first to ensure the latest credentials from Jenkins are used
                kubectl delete secret mern-secrets --ignore-not-found
                kubectl create secret generic mern-secrets \
                    --from-literal=mongodb-uri=${MONGODB_URI} \
                    --from-literal=jwt-secret=${JWT_SECRET} \
                    --from-literal=razorpay-key-id=${RAZORPAY_KEY_ID} \
                    --from-literal=razorpay-key-secret=${RAZORPAY_KEY_SECRET}

                # 2. Apply Storage and MongoDB Configuration
                kubectl apply -f k8s/mongodb.yaml

                # 3. Apply API, Frontend, and Auto-scaler configuration
                kubectl apply -f k8s/app-deploy.yaml

                # 4. Force a rollout restart to pick up latest images
                kubectl rollout restart deployment mern-api
                kubectl rollout restart deployment mern-frontend
                """
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
