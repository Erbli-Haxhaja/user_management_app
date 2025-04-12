pipeline {
    // using docker agent for access to docker cli
    agent {
        docker {
            image 'docker:20.10.16'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub')
    }
    
    stages {
        stage('Build Image') {
            steps {
                script {
                    // Build the Docker image using the Dockerfile in the current directory
                    sh 'docker build -t eeba19/user_management_app:latest .'
                }
            }
        }

        stage('Push Image') {
            steps {
                script {
                    // Log in to Docker Hub using Jenkins credentials
                    sh "docker login -u ${DOCKER_HUB_CREDENTIALS_USR} -p ${DOCKER_HUB_CREDENTIALS_PSW}"
                    
                    // Push the image to Docker Hub with the 'latest' tag
                    sh 'docker push eeba19/user_management_app:latest'
                }
            }
        }
    }
}