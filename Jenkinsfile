pipeline {
    parameters {
        choice(name: 'Environment', choices: ['prod', 'dev'], description: 'Deploy in development environment')
        string(name: 'Version', defaultValue: '', description: 'Version to deploy')
        booleanParam(name: 'BuildApp', defaultValue: false, description: 'Rebuild the application container')
    }
    agent {
        label "stargaze-builder"
    }
    environment {
        ENV_FILE=credentials("trailblazer-admin-${params.Environment}")
    }
    stages {
        stage("Checkout Version") {
            steps {
                script {
                    if (params.Environment == 'prod') {
                        if (params.Version) {
                            echo "🏷️ Checking out tag: ${params.Version}"
                            checkout([
                                $class: 'GitSCM',
                                branches: [[name: "refs/tags/${params.Version}"]],
                                userRemoteConfigs: scm.userRemoteConfigs
                            ])
                        } else {
                            echo "🚨 Missing version"
                            error "Missing version"
                        }
                    } else if (params.Environment == 'dev') {
                        echo "🏷️ Checking out branch: develop"
                        checkout([
                            $class: 'GitSCM',
                            branches: [[name: '*/develop']],
                            userRemoteConfigs: scm.userRemoteConfigs
                        ])
                    } else {
                        echo "🚨 Invalid environment: ${params.Environment}"
                        error "Invalid environment: ${params.Environment}"
                    }
                }
            }
        }
        stage("Setup Environment") {
            steps {
                echo "⚙️ Creating environment file with credentials..."
                sh 'cp $ENV_FILE .env'
            }
        }
        stage("Run Container") {
            steps {
                script {
                    def buildOption = params.BuildApp ? "--build" : ""
                    echo "🐳 Starting Docker container (Build: ${params.BuildApp})..."
                    sh "BUILD_VERSION=${params.Version} docker compose up -d ${buildOption} || docker-compose up -d ${buildOption}"
                }
            }
        }
    }
    post {
        success {
            echo "🎉 Deployment successful!"
        }
        failure {
            echo "🚨 Deployment failed!"
        }
        always {
            echo "🧹 Cleaning up environment file..."
            sh 'rm -f .env'
        }
    }
}
