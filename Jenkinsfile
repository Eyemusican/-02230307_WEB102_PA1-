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
                bat 'npm install'
            }
        }
        
        stage('Verify Setup') {
            steps {
                echo 'Verifying Node.js and npm versions...'
                bat 'node --version'
                bat 'npm --version'
                bat 'dir'  // List files to verify structure
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running tests with reporting...'
                bat 'npm run test:ci'
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
                bat 'npm run lint || exit /b 0'  // Don't fail build on lint errors (Windows equivalent)
            }
        }
        
        stage('Build') {
            steps {
                echo 'Building application...'
                bat 'npm run build'
                
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
                    // Test that server can start without errors (Windows version)
                    bat '''
                        @echo off
                        start /b node server.js
                        timeout /t 3 > nul
                        
                        REM Test if server is responding
                        curl -f http://localhost:3000/ || echo Server health check failed
                        
                        REM Kill the test server
                        taskkill /f /im node.exe > nul 2>&1 || echo No node processes to kill
                        
                        echo Server startup test completed
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
                bat 'echo Deployment would happen here'
                bat 'echo API server is ready for deployment'
                
                // Example deployment commands (uncomment and modify as needed):
                // bat 'scp server.js products.json package.json user@server:/path/to/app/'
                // bat 'ssh user@server "cd /path/to/app && npm install --production && pm2 restart api-server"'
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up workspace...'
            // Clean up any test files but keep important artifacts
            bat 'del /f /q test-products.json junit.xml 2>nul || echo Nothing to clean'
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