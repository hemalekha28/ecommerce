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

        stage('Build') {
            steps {
                echo 'Building images with Docker Compose...'
                // This builds the images so we have node/npm ready inside them
                sh 'docker compose build'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests INSIDE the built Docker image...'
                // This runs the test command in a temporary backend container
                sh 'docker compose run --rm backend npm test'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Finishing deployment...'
                // Starts all containers (backend, frontend, mongodb)
                sh 'docker compose up -d'
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed.'
        }
        success {
            echo '✅ Automation Successful!'
        }
        failure {
            echo '❌ Automation Failed. Check the container logs.'
        }
    }
}
