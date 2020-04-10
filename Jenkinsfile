pipeline {
  agent any

  environment {
    dockerImage = ''
    latestImage = ''
  }
  stages {
    stage('Deploy Develop to ECS') {
      when { branch 'develop-skip' }

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
  post {
    success {
      script {
        // cleanWs()
        // notifySuccess()
      }
    }
    failure {
      script {
        // cleanWs()
        // notifyFailed()
      }
    }
  }
}

def notifySuccess() {
  def msg = changeLogs()
  slackSend (botUser: true, channel: 'hanami', color: '#009900', message: "SUCCESSFUL: Job '${env.JOB_NAME} #${env.BUILD_NUMBER}' (${env.BUILD_URL}) \n ```${msg}```")
}

def notifyFailed() {
  def msg = changeLogs()
  slackSend (botUser: true, channel: 'hanami', color: '#ff0000', message: "FAILED: Job '${env.JOB_NAME} #${env.BUILD_NUMBER}' (${env.BUILD_URL})\n ```${msg}```")
}

@NonCPS
def changeLogs() {
  def msg = "Changes:"
  def changeLogSets = currentBuild.changeSets
  for (int i = 0; i < changeLogSets.size(); i++) {
    def entries = changeLogSets[i].items
    for (int j = 0; j < entries.length; j++) {
      def entry = entries[j]
      msg +=  "\n\t- ${entry.msg} [${entry.author}]"
    }
  }
  return msg
}
