pipeline {
    agent any

    environment {
        // Secrets should be configured in Jenkins Credential Manager
        MONGODB_URI = credentials('MONGODB_URI')
        JWT_SECRET  = credentials('JWT_SECRET')
        RAZORPAY_KEY_ID = credentials('RAZORPAY_KEY_ID')
        RAZORPAY_KEY_SECRET = credentials('RAZORPAY_KEY_SECRET')
    }

    stages {
        stage('Clone') {
            steps {
                // Clones the code from the Git repository associated with the job
                checkout scm
            }
        }

        stage('Install') {
            steps {
                echo 'Installing dependencies...'
                dir('backend') {
                    sh 'npm install'
                }
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Test') {
            steps {
                echo 'Running Backend Tests...'
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying to Production using Docker Compose...'
                // Restart containers with the latest builds
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
            echo '❌ Deployment failed. Please check the Jenkins logs.'
        }
    }
}
