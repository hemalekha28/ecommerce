pipeline {
    agent any

    environment {
        // These ID names must match exactly what you created in Jenkins Credentials
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

        stage('Build & Test') {
            steps {
                echo 'Running npm commands in a temporary Node container...'
                // We mount the workspace into a Node container and run the commands manually
                // This avoids the 'Invalid agent type docker' error
                sh 'docker run --rm -v ${WORKSPACE}:/app -w /app node:20 sh -c "cd backend && npm install && npm test && cd ../frontend && npm install"'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying to Production...'
                sh 'docker compose down'
                sh 'docker compose up -d --build'
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
