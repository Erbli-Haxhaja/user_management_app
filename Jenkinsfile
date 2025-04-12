pipeline {
    agent any
    
    environment {
        // Replace 'docker-hub' with your Jenkins credentials ID if different
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub')
    }
    
    stages {
        stage('Build Image') {
            steps {
                script {
                    // Use a Docker image that has the Docker CLI installed to run docker commands
                    docker.image('docker:20.10.16').inside('-v /var/run/docker.sock:/var/run/docker.sock') {
                        sh 'docker build -t eeba19/user_management_app:latest .'
                    }
                }
            }
        }

        stage('Push Image') {
            steps {
                script {
                    docker.image('docker:20.10.16').inside('-v /var/run/docker.sock:/var/run/docker.sock') {
                        sh "docker login -u ${DOCKER_HUB_CREDENTIALS_USR} -p ${DOCKER_HUB_CREDENTIALS_PSW}"
                        sh 'docker push eeba19/user_management_app:latest'
                    }
                }
            }
        }
    }
}