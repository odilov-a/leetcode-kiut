pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                // Clean install to ensure a fresh setup of dependencies
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                // Run tests and fail the pipeline if tests fail
                sh 'npm test'
            }
        }

        stage('Deploy') {
            steps {
                sshagent(['server-ssh']) {
                    sh '''
                    # Sync built files to the server directory
                    rsync -avz --delete ./build/ root@79.133.183.21:/root/leetcode-kiut/

                    # Install production dependencies on the server
                    ssh root@79.133.183.21 "cd /root/leetcode-kiut && npm install --production"

                    # Optional: Restart server or services
                    ssh root@79.133.183.21 "pm2 reload all || pm2 start server.js"
                    '''
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
