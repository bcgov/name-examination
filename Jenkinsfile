// FE = front-end code.  JS and VUE.js.

// FE requires a chained build: First buildconfig outputs an intermediate image that's then consumed by a second stage
// (cont..) build that uses it to build the deploy-ready image

// Front-end definitions.  Extra because of the chained build.  "INT" = Intermediate.
def FE_INT_BUILDCFG_NAME ='namex-fe-build'  // TODO: rename build to "namex-fe-int-build"
def FE_INT_IMAGE_NAME = 'namex-front'       // TODO: rename image to "namex-fe-int-image"
def FE_BUILDCFG_NAME ='namex-fe-web'        // TODO: rename build to "namex-fe-build"
def FE_IMAGE_NAME = 'namex-front-caddy'     // TODO: rename image to "namex-fe-image"
def FE_DEPLOYMENT_NAME = 'namex-fe-web-caddy'  // TODO: rename deployment to "namex-fe-deploy"

// define constants
def BUILDCFG_NAME ='namex-web'
def IMAGE_NAME = 'namex-front-caddy'
def DEV_DEPLOYMENT_NAME = 'namex-web-dev'
def DEV_TAG_NAME = 'dev'
def DEV_NS = 'servicebc-ne-dev'
def TST_DEPLOYMENT_NAME = 'namex-web-test'
def TST_TAG_NAME = 'test'
def TST_BCK_TAG_NAME = 'test-previous'
def TST_NS = 'servicebc-ne-test'
def PROD_DEPLOYMENT_NAME = 'namex'
def PROD_TAG_NAME = 'prod'
def PROD_BCK_TAG_NAME = 'prod-previous'
def PROD_NS = 'ocp-myapp-prod'

// define groovy functions

// send a msg to slack channel that deploy occured
import groovy.json.JsonOutput
def notifySlack(text, channel, url, attachments) {
    def slackURL = url
    def jenkinsIcon = 'https://wiki.jenkins-ci.org/download/attachments/2916393/logo.png'
    def payload = JsonOutput.toJson([text: text,
        channel: channel,
        username: "Jenkins",
        icon_url: jenkinsIcon,
        attachments: attachments
    ])
    def encodedReq = URLEncoder.encode(payload, "UTF-8")
    sh("curl -s -S -X POST " +
            "--data \'payload=${encodedReq}\' ${slackURL}")    
}

// create a string listing commit msgs occured since last build
@NonCPS
def getChangeString() {
  MAX_MSG_LEN = 512
  def changeString = ""
  def changeLogSets = currentBuild.changeSets
  for (int i = 0; i < changeLogSets.size(); i++) {
     def entries = changeLogSets[i].items
     for (int j = 0; j < entries.length; j++) {
         def entry = entries[j]
         truncated_msg = entry.msg.take(MAX_MSG_LEN)
         changeString += " - ${truncated_msg} [${entry.author}]\n"
     }
  }
  if (!changeString) {
     changeString = "No changes"
  }
  return changeString
}

// pipeline

// Note: openshiftVerifyDeploy requires policy to be added:
// oc policy add-role-to-user view system:serviceaccount:devex-platform-tools:jenkins -n devex-platform-dev
// oc policy add-role-to-user view system:serviceaccount:devex-platform-tools:jenkins -n devex-platform-test
// oc policy add-role-to-user view system:serviceaccount:devex-platform-tools:jenkins -n devex-platform-prod

// define job properties - keep 10 builds only
properties([[$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '10']]])

// Part 1 - CI - Source code scanning, build, dev deploy

podTemplate(label: 'jenkins-python3nodejs', name: 'jenkins-python3nodejs', serviceAccount: 'jenkins', cloud: 'openshift', containers: [
containerTemplate(
    name: 'jnlp',
    image: '172.50.0.2:5000/openshift/jenkins-slave-python3nodejs',
    resourceRequestCpu: '500m',
    resourceLimitCpu: '1000m',
    resourceRequestMemory: '1Gi',
    resourceLimitMemory: '2Gi',
    workingDir: '/tmp',
    command: '',
    args: '${computer.jnlpmac} ${computer.name}'
    )
])
  // Front-end chain builds
  {
    node('jenkins-python3nodejs') {

        stage('checkout') {
            echo "checking out source"
            echo "Build: ${BUILD_ID}"
            checkout scm
        }

        stage('Intermediate build') {
            echo ">>> Building Namex intermediate image..."
                openshiftBuild bldCfg: FE_INT_BUILDCFG_NAME, showBuildLogs: 'true'
            echo ">>> Get Intermediate Image Hash"
            IMAGE_HASH = sh (
                script: 'oc get istag namex-front:latest -o template --template="{{.image.dockerImageReference}}"|awk -F ":" \'{print $3}\'',
                    returnStdout: true).trim()
            echo ">>> IMAGE_HASH: $IMAGE_HASH"
            echo ">>> Intermediate Image Build Complete"

        }
        stage ('Final image build') {
            echo ">>> Building Namex final image..."
            openshiftBuild bldCfg: FE_BUILDCFG_NAME, showBuildLogs: 'true'
            echo ">>> Get Final Image Hash"
            IMAGE_HASH = sh (
                script: 'oc get istag namex-front-caddy:latest -o template --template="{{.image.dockerImageReference}}"|awk -F ":" \'{print $3}\'',
                    returnStdout: true).trim()
            echo ">>> IMAGE_HASH: $IMAGE_HASH"
            openshiftTag destStream: FE_IMAGE_NAME, verbose: 'true', destTag: 'dev', srcStream: FE_IMAGE_NAME, srcTag: "${IMAGE_HASH}"
            sleep 5
            openshiftVerifyDeployment depCfg: FE_DEPLOYMENT_NAME, namespace: 'servicebc-ne-dev', replicaCount: 1, verbose: 'false', verifyReplicaCount: 'false'
            echo ">>> Deployment Complete"
        }
    }
  }

stage('deploy-test') {	
  timeout(time: 1, unit: 'DAYS') {
	  input message: "Deploy to test?", submitter: "ljtrent,thorwolpert,rarmitag"
  }
  node('master') {
	  echo ">>> Tag ${TST_TAG_NAME} with ${TST_BCK_TAG_NAME}"
	  openshiftTag destStream: IMAGE_NAME, verbose: 'false', destTag: TST_BCK_TAG_NAME, srcStream: IMAGE_NAME, srcTag: TST_TAG_NAME
          echo ">>> Tag ${IMAGE_HASH} with ${TST_TAG_NAME}"
	  openshiftTag destStream: IMAGE_NAME, verbose: 'false', destTag: TST_TAG_NAME, srcStream: IMAGE_NAME, srcTag: "${IMAGE_HASH}"
          sleep 5
	  openshiftVerifyDeployment depCfg: TST_DEPLOYMENT_NAME, namespace: TST_NS, replicaCount: 1, verbose: 'false', verifyReplicaCount: 'false'
	  echo ">>>> Deployment Complete"
	  notifySlack("Test Deploy, changes:\n" + getChangeString(), "#builds", "https://hooks.slack.com/services/${SLACK_TOKEN}", [])
  }
}
