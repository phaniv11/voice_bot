## Setting up the tool on a VM on GCP

### Prerequisites (for setting up on GCP):
- GCP account for setting up the VM
- Enable Billing for your project on GCP

### Prerequisites(for setting up on Local system)
- Any OS(Ubuntu, Windows, Mac)
- 8GB RAM
- 40GB free HD space
- Docker 
- Docker-Compose

**Note**: *Since setting up these tools on local system may slow downs the processing of the system, I am setting it up on GCP VM for better performance.*

## Steps to setup the tool
- Step 1: Signup or Signin to your GCP account
- Step 2: [Create a project in the GCP account ](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
- Step 3: Now we will create the VM in our newly created Project using Google's [Compute Engine Service](https://cloud.google.com/compute) with the below configuration:
    - Machine Configuration:
        - Machine Family: General-purpose
        - Series: N1
        - Machine type: n1-standard-4(4 vCPU, 15GB Memory)
    - Boot Disk:
        - Public Images
        - OS: Ubuntu 18.0.4 LTS
        - Boot disk type: Standard persistent disk 
        - Size: 50GB
    - Identify and API access:
        - Service account: Compute Engine default service account
        - Access scopes: Allow default access
    - Firewall
        - Allow HTTP traffic
        - Allow HTTPS traffic
     
- Step 4: Once we have selected the above configuration, click on create, it will take few minutes to start the VM, Once you see green tick on you VM instance, Click on Connect through **SSH** 

- Step 5: Once you have connected run the below commands to setup the required tools:
    - > sudo apt-get update
     
     ### Install Docker
     - > curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add 
     - > sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
     - > sudo apt-get update
     - >  apt-cache policy docker-ce
     - > sudo apt-get install -y docker-ce
     - > sudo systemctl status docker
     
     ### Install [Docker-Compose](https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-16-04)
     - > sudo curl -L https://github.com/docker/compose/releases/download/1.18.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose

     - > sudo chmod +x /usr/local/bin/docker-compose
     - > docker-compose --version
     
 - Step 6: Now we will clone the `botium-speech-processing` repo and build the tools:
    - > git clone https://github.com/JiteshGaikwad/botium-speech-processing
    
 - Step 7: Once you have cloned the repo, go to the `botium-speech-processing` folder and run the below command
    - > cd botium-speech-processing
    - > docker-compose up -d
 
 - Step 8: It will take some time to compile and setup the tools.
 
    
        


