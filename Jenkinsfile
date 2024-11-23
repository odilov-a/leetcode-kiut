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
                sh 'npm test'
            }
        }

        stage('Deploy') {
            steps {
                sshagent(['server-ssh']) {
                    sh '''
                    # Copy built files to the project directory on the server
                    scp -r ./build/* root@79.133.183.21:/root/leetcode-kiut/

                    # (Optional) Restart services or apply additional commands if needed
                    ssh root@79.133.183.21 "cd /root/leetcode-kiut && npm install --production"
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
