// FE = front-end code.  JS and VUE.js.

// FE requires a chained build: First buildconfig outputs an intermediate image that's then consumed by a second stage
// (cont..) build that uses it to build the deploy-ready image

// Front-end definitions.  Extra because of the chained build.  "INT" = Intermediate.
def FE_INT_BUILDCFG_NAME ='namex-fe-build'  // TODO: rename build to "namex-fe-int-build"
def FE_INT_IMAGE_NAME = 'namex-front'       // TODO: rename image to "namex-fe-int-image"
def FE_BUILDCFG_NAME ='namex-fe-web'        // TODO: rename build to "namex-fe-build"
def FE_IMAGE_NAME = 'namex-front-caddy'     // TODO: rename image to "namex-fe-image"
def FE_DEPLOYMENT_NAME = 'namex-fe-deploy'  // TODO: rename deployment to "namex-fe-deploy"

// **** Note: openshiftVerifyDeploy requires policy to be added:
// oc policy add-role-to-user view system:serviceaccount:<project-prefix>-tools:jenkins -n <project-prefix>-dev
// oc policy add-role-to-user view system:serviceaccount:<project-prefix>-tools:jenkins -n <project-prefix>-test
// oc policy add-role-to-user view system:serviceaccount:<project-prefix>-tools:jenkins -n <project-prefix>-prod

//See https://github.com/jenkinsci/kubernetes-plugin
// The "python3nodejs" has both Python and NodeJS6 so we can use it to build BE and FE
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
  // Front-end chain build
  {
    node('jenkins-python3nodejs') {
        stage('Intermediate build') {
            echo "Building Namex intermediate image..."
                openshiftBuild bldCfg: FE_INT_BUILDCFG_NAME, showBuildLogs: 'true'
            echo ">>> Get Image Hash"
            IMAGE_HASH = sh (
                script: 'oc get istag FE_INT_IMAGE_NAME:latest -o template --template="{{.image.dockerImageReference}}"|awk -F ":" \'{print $3}\'',
                    returnStdout: true).trim()
            echo ">> INT_IMAGE_HASH: $INT_IMAGE_HASH"
            echo ">>> Intermediate Image Build Complete"

        }
        stage ('Final image build') {
            echo ">>> Building Namex final image..."
            openshiftBuild bldCfg: FE_BUILDCFG_NAME, showBuildLogs: 'true'
            echo ">>> Get Image Hash"
            IMAGE_HASH = sh (
                script: 'oc get istag FE_IMAGE_NAME:latest -o template --template="{{.image.dockerImageReference}}"|awk -F ":" \'{print $3}\'',
                    returnStdout: true).trim()
            echo ">>> IMAGE_HASH: $IMAGE_HASH"
            openshiftTag destStream: FE_IMAGE_NAME, verbose: 'true', destTag: 'dev', srcStream: FE_IMAGE_NAME, srcTag: "${IMAGE_HASH}"
            sleep 5
            openshiftVerifyDeployment depCfg: FE_DEPLOYMENT_NAME, namespace: 'servicebc-ne-dev', replicaCount: 1, verbose: 'false', verifyReplicaCount: 'false'
            echo ">>> Deployment Complete"
            }
    }
    }
