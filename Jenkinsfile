pipeline {
    agent any

    environment {
        // App Credentials
        MONGODB_URI = credentials('MONGODB_URI')
        JWT_SECRET  = credentials('JWT_SECRET')
        RAZORPAY_KEY_ID = credentials('RAZORPAY_KEY_ID')
        RAZORPAY_KEY_SECRET = credentials('RAZORPAY_KEY_SECRET')
        
        // Notification Config
        SLACK_CHANNEL = '#deploy-alerts'
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
                // Module 3: Catch error to allow cleanup but mark build as failed
                catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                    echo 'Clearing old containers to avoid conflicts...'
                    sh 'docker stop mern-api mern-frontend mern-mongodb || true'
                    sh 'docker rm mern-api mern-frontend mern-mongodb || true'

                    echo 'Starting Test Environment...'
                    // Module 2: docker compose up for testing
                    sh 'docker-compose up -d'
                    
                    echo 'Running Backend Tests...'
                    // Run tests in the built image
                    sh 'docker run --rm mern-api npm test -- --passWithNoTests'
                }
            }
        }

        stage('Build Frontend') {
            when {
                // Module 3: Only run if tests passed
                expression { currentBuild.result == 'SUCCESS' || currentBuild.result == null }
            }
            steps {
                echo 'Building Frontend Image...'
                sh 'docker build --build-arg VITE_API_URL=http://localhost:5000 -t mern-frontend ./frontend'
            }
        }

        stage('Deploy') {
            when {
                // Module 3: Only run if all previous stages succeeded
                expression { currentBuild.result == 'SUCCESS' || currentBuild.result == null }
            }
            steps {
                echo 'Deploying MERN Application...'
                // Module 1: Using docker run for deployment
                sh 'docker stop mern-api mern-frontend || true'
                sh 'docker rm mern-api mern-frontend || true'
                sh "docker run -d --name mern-api -p 5000:5000 -e MONGODB_URI=${MONGODB_URI} -e JWT_SECRET=${JWT_SECRET} mern-api"
                sh "docker run -d --name mern-frontend -p 3000:3000 mern-frontend"
            }
        }
    }

    // Module 1: Post block for orchestration
    post {
        always {
            echo 'Pipeline completed. Cleaning up test containers...'
            // Module 2: Always teardown docker-compose
            sh 'docker-compose down'
        }
        success {
            echo '✅ Deployment successful!'
            // Module 5: Slack notification on success
            slackSend channel: env.SLACK_CHANNEL, 
                      color: 'good', 
                      message: "PASSED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
        }
        failure {
            echo '❌ Pipeline failed.'
            // Module 4: Email notification on failure
            mail to: 'admin@yourdomain.com',
                 subject: "Pipeline Failed: ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
                 body: """The pipeline failed!
                          Branch: ${env.BRANCH_NAME}
                          Status: ${currentBuild.result}
                          Console Log: ${env.BUILD_URL}console"""

            // Module 5: Slack notification on failure
            slackSend channel: env.SLACK_CHANNEL, 
                      color: 'danger', 
                      message: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' at stage '${env.STAGE_NAME}' (${env.BUILD_URL})"
        }
    }
}
