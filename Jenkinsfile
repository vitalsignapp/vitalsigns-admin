pipeline {
  agent any

  environment {
    dockerImage = ''
    latestImage = ''
  }
  stages {
    stage('Deploy Develop to NIPA') {
      when { branch 'develop' }

      environment {
          REGISTRY = 'registry.odds.team/vitalsigns/vitalsigns-admin'
      }

      stages {
        stage('Build images') {
          steps {
            sh "docker build -t ${REGISTRY}:dev ."
            sh "docker tag ${REGISTRY}:dev ${REGISTRY}:dev.v${env.BUILD_NUMBER}_dev_${GIT_COMMIT.take(6)}"
          }
        }
        stage('Push images') {
          steps {
           withDockerRegistry(credentialsId: '4ab7b1e1-0d78-4557-91c7-753ab09606f6', url: 'registry.odds.team/vitalsigns/vitalsigns-admin') {
                sh "docker push ${REGISTRY}:dev"
                sh "docker push ${REGISTRY}:dev.v${env.BUILD_NUMBER}_dev_${GIT_COMMIT.take(6)}"
            }
          }
        }
        stage('Deploy to NIPA') {
          steps {
             sshPublisher(publishers: [sshPublisherDesc(configName: 'vitalsigns', transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: 'cd /home/nc-user/vitalsign/api && bash deploy.sh', execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '', remoteDirectorySDF: false, removePrefix: '', sourceFiles: '')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false)])
          }
        }
      }
    }
  }
}
