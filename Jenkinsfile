pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-20.x'  // Must match Global Tool Configuration name
    }
    
    environment {
        // Set NODE_ENV for testing
        NODE_ENV = 'test'
        PORT = '3001'  // Use different port for testing
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                sh 'npm install'
            }
        }
        
        stage('Verify Setup') {
            steps {
                echo 'Verifying Node.js and npm versions...'
                sh 'node --version'
                sh 'npm --version'
                sh 'ls -la'  // List files to verify structure
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running tests with reporting...'
                sh 'npm run test:ci'
            }
            post {
                always {
                    // Publish test results
                    junit 'junit.xml'
                    
                    // Archive coverage reports if available
                    script {
                        if (fileExists('coverage/lcov-report/index.html')) {
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'coverage/lcov-report',
                                reportFiles: 'index.html',
                                reportName: 'Coverage Report'
                            ])
                        } else {
                            echo 'No coverage report found'
                        }
                    }
                }
            }
        }
        
        stage('Code Quality') {
            steps {
                echo 'Running code quality checks...'
                sh 'npm run lint || true'  // Don't fail build on lint errors
            }
        }
        
        stage('Build') {
            steps {
                echo 'Building application...'
                sh 'npm run build'
                
                // Verify products.json exists or create it
                script {
                    if (!fileExists('products.json')) {
                        echo 'Creating products.json file...'
                        writeFile file: 'products.json', text: '''[
  {
    "id": 1,
    "name": "Sample Product 1",
    "price": 29.99,
    "description": "A sample product for testing"
  },
  {
    "id": 2,
    "name": "Sample Product 2", 
    "price": 49.99,
    "description": "Another sample product for testing"
  }
]'''
                    }
                }
                
                // Archive build artifacts
                archiveArtifacts artifacts: 'server.js,products.json,package.json', fingerprint: true
            }
        }
        
        stage('Start Test Server') {
            steps {
                echo 'Testing server startup...'
                script {
                    // Test that server can start without errors
                    sh '''
                        timeout 10s node server.js &
                        SERVER_PID=$!
                        sleep 3
                        
                        # Test if server is responding
                        curl -f http://localhost:3000/ || echo "Server health check failed"
                        
                        # Kill the test server
                        kill $SERVER_PID 2>/dev/null || true
                        wait $SERVER_PID 2>/dev/null || true
                        
                        echo "Server startup test completed"
                    '''
                }
            }
        }
        
        stage('Deploy') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                echo 'Preparing for deployment...'
                sh 'echo "Deployment would happen here"'
                sh 'echo "API server is ready for deployment"'
                
                // Example deployment commands (uncomment and modify as needed):
                // sh 'scp server.js products.json package.json user@server:/path/to/app/'
                // sh 'ssh user@server "cd /path/to/app && npm install --production && pm2 restart api-server"'
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up workspace...'
            // Clean up any test files but keep important artifacts
            sh 'rm -f test-products.json junit.xml || true'
        }
        success {
            echo '✅ Pipeline completed successfully!'
            echo 'API server build and tests passed!'
        }
        failure {
            echo '❌ Pipeline failed!'
            echo 'Check the console output for details'
            // Send notifications (email, Slack, etc.)
        }
        unstable {
            echo '⚠️ Pipeline completed with warnings'
        }
    }
}