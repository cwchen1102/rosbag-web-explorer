# Rosbag Web Explorer

# Introduction
<img src="https://github.com/cwchen1102/rosbag-web-explorer/blob/master/Demo.gif" alt="image" width="70%" height="auto">

**Rosbag Web Explorer** is a web application that offers users a user-friendly interface for effortlessly exploring the details of rosbags on the internet. It streamlines the process of launching ROS on a local machine, enabling users to access and review rosbags from anywhere and at any time.

**Rosbag Web Explorer consists of multiple containers running within Docker.** These containers can be categorized into four distinct components as follows:

- **Reverse Proxy: Nginx**
- **Frontend: React**
- **Backend: Django, uWSGI**
- **Database: PostgreSQL**

The Docker Compose file serves a vital role in activating multiple containers. In this repository, you will find two distinct Docker Compose files, each designed for a specific purpose:

- `docker-compose-dev.yml`: for local machine development.
- `docker-compose.yml`: for deployment on AWS.

To develop Rosbag Web Explorer on your local machine, please follows the steps:

1. Install Docker
2. Activate all containers by running `docker-compose -f docker-compose-dev.yml up` 
3. Visit `http://localhost/`

**To automate the build, test and deployment on AWS, please follows the guides of AWS and Github Actions below.**

# AWS

Here is the AWS services we are going to use:

1. **Identity and Access Management (IAM)** specifies who or what can access services
2. **Elastic Beanstalk (EB)** deploys and scales web applications and services automatically, from capacity provisioning, load balancing, and auto scaling to application health monitoring.
3. **Simple Storage Service** (**S3)** stores and protects data for virtually any use case
4. **Relational Database Service (RDS)** sets up, operates, and scales a relational database in the cloud
5. **Virtual Private Cloud (VPC)** gives full control over the virtual networking environment

# AWS Setup Guide

## Section 1: IAM (Identity and Access Management)

### 1.1 Create EC2 IAM Instance Profile

To set up an IAM instance profile for your EC2 instances, follow these steps:

1. Log in to the AWS Management Console.
2. In the navigation bar, search for **IAM** and select the IAM Service.
3. Click on **Roles** under **Access Management** in the left sidebar.
4. Click the **Create role** button.
5. Select **AWS Service** as the trusted entity type and choose **EC2** under common use cases.
6. Search for **AWSElasticBeanstalk** and select the policies: **AWSElasticBeanstalkWebTier**, **AWSElasticBeanstalkWorkerTier**, and **AWSElasticBeanstalkMulticontainerDocker**. Click the **Next** button.
7. Name the role as **aws-elasticbeanstalk-ec2-role** and click the **Create role** button.

### 1.2 Create an IAM User

To create an IAM user, follow these steps:

1. Search for **IAM Security, Identity & Compliance Service**.
2. Click **Create Individual IAM Users** and select **Manage Users**.
3. Click **Add User**.
4. Enter a name for the user in the "User Name" field.
5. Click **Next**.
6. Choose "Attach Policies Directly".
7. Search for "beanstalk" and select "AdministratorAccess-AWSElasticBeanstalk".
8. Click **Next**.
9. Click **Create user**.
10. Select the IAM user you just created from the list of users.
11. Click "Security Credentials".
12. Scroll down to find "Access Keys".
13. Click "Create access key".
14. Select "Command Line Interface (CLI)".
15. Scroll down, check the "I understand..." box, and click "Next".
16. Copy and/or download the **Access Key ID** and **Secret Access Key** for use in the GitHub Actions Variable Setup.

## Section 2: Elastic Beanstalk

### 2.1 Create Elastic Beanstalk Environment

To create an Elastic Beanstalk environment, follow these steps:

1. Log in to the AWS Management Console.
2. In the navigation bar, search for **Elastic Beanstalk** and select the Elastic Beanstalk service.
3. If you're new to Elastic Beanstalk, click the **Create Application** button. If you have existing environments, click the **Create environment** button.
4. Set the Application Name to **docker-explorer**, and it will auto-populate an Environment Name.
5. In the Platform section, select "Docker running on 64bit Amazon Linux 2".
6. Ensure that the "free tier eligible" option is selected in the Presets section.
7. Click **Next** to proceed to the next step.
8. You will be prompted to configure Service Access:
    - Select **Create and use a new service role** and name it as **aws-elasticbeanstalk-service-role**. The EC2 instance profile should auto-populate with the role created earlier.
9. Click **Skip to Review** as Steps 3-6 are not applicable.
10. Click **Submit** and wait for your Elastic Beanstalk application and environment to be created and launched.
11. Click the link below the checkmark under Domain to open the application in your browser and see a Congratulations message.

## Section 3: S3 (Simple Storage Service)

### 3.1 Update Object Ownership of S3 Bucket

To update the object ownership of your S3 bucket, follow these steps:

1. Log in to the AWS Management Console.
2. In the navigation bar, search for **S3** and select the S3 service.
3. Find and click the Elastic Beanstalk bucket created with your environment.
4. Click the **Permissions** menu tab.
5. Locate **Object Ownership** and click **Edit**.
6. Change from **ACLs disabled** to **ACLs enabled** and set **Bucket owner Preferred** to **Object Writer**. Acknowledge the warning by checking the box.
7. Click **Save changes**.

## Section 4: RDS (Relational Database Service)

### 4.1 Create RDS Database

To create an RDS database, follow these steps:

1. Go to the AWS Management Console and search for RDS using Find Services.
2. Click the "Create database" button.
3. Select PostgreSQL.
4. In Templates, check the Free tier box.
5. In Settings, set DB Instance identifier to **docker-explorer-postgres**.
6. Set Master Username to **postgres**.
7. Set Master Password to **postgrespassword** and confirm.
8. In Connectivity, ensure that VPC is set to Default VPC.
9. In Additional Configuration, click to unhide and set Initial database name to **files**.
10. Click the "Create Database" button.

## Section 5: VPC (Virtual Private Cloud)

### 5.1 Create a Custom Security Group

To create a custom security group, follow these steps:

1. Go to the AWS Management Console and use Find Services to search for VPC.
2. In the left sidebar, find the Security section and click on Security Groups.
3. Click the "Create Security Group" button.
4. Set the Security group name to **docker-explorer**.
5. Set the Description to **docker-explorer**.
6. Ensure that the VPC is set to your default VPC.
7. Scroll down and click the "Create Security Group" button.
8. After the security group has been created, find the "Edit inbound rules" button.
9. Click "Add Rule".
10. Set the Port Range to **5432-8000**.
11. In the Source box, start typing 'sg' and select the Security Group you just created.
12. Click the "Save rules" button.

### 5.2 Apply Security Groups to RDS

To apply security groups to RDS, follow these steps:

1. Go to the AWS Management Console and use Find Services to search for RDS.
2. Click "Databases" in the Sidebar and check the box next to your instance.
3. Click the "Modify" button.
4. In Connectivity, add and select the new **docker-explorer** security group.
5. Scroll down and click the "Continue" button.
6. Click the "Modify DB instance" button.

### 5.3 Apply Security Groups to Elastic Beanstalk

To apply security groups to Elastic Beanstalk, follow these steps:

1. Go to the AWS Management Console and use Find Services to search for Elastic Beanstalk.
2. Click "Environments" in the left sidebar.
3. Select the **Docker-explorer-env**.
4. Click "Configuration".
5. In the "Instances" row, click the "Edit" button.
6. Scroll down to EC2 Security Groups and select the **docker-explorer**.
7. Click "Apply" and then "Confirm".
8. After all instances restart and go from No Data to Severe, you should see a green checkmark under Health.

## Section 6: Environment Variables

### 6.1 Set Elastic Beanstalk Environment Variables

To set Elastic Beanstalk environment variables, follow these steps

:

1. Go to the AWS Management Console and use Find Services to search for Elastic Beanstalk.
2. Click "Environments" in the left sidebar.
3. Select **Docker-explorer-env**.
4. In the left sidebar, click "Configuration".
5. Scroll down to the "Updates, monitoring, and logging" section and click "Edit".
6. Scroll down to the "Environment Properties" section and click "Add environment property".
7. Set the following environment variables:
    - PGUSER to postgres
    - PGPASSWORD to postgrespassword
    - In another tab, open the RDS dashboard, click databases in the sidebar, click your instance and scroll to Connectivity and Security. Copy the endpoint.
    - Set the PGHOST key to the endpoint value listed above.
    - Set PGDATABASE to files
    - Set PGPORT to 5432
8. Click the "Apply" button.
9. After all instances restart and go from No Data to Severe, you should see a green checkmark under Health.

# Github Actions

**GitHub Actions is used as the CI/CD tool to automate the build, test, and deployment pipeline.** You can create workflows that build and test every pull request to your repository, or deploy merged pull requests to production.

# Github Actions Setup Guide

## 1. Configure Secrets and Variables

To grant GitHub Actions access to your AWS and Docker Hub accounts, you need to create and store the necessary secrets and variables.

**For AWS Access:**

1. Navigate to your GitHub repository and click on "Settings" at the top.
2. Select "Secrets and Variables" from the left menu.
3. Choose "Actions."
4. Click on "New repository secret."
5. Create a secret named *AWS_ACCESS_KEY* and paste your IAM access key.
6. Create another secret called *AWS_SECRET_KEY* and paste your IAM secret key.

> Note: If you also plan to access Docker Hub, create additional secrets:
> 
> 
> **For Docker Hub Access:**
> 
> 1. Create a secret named *DOCKER_USERNAME* and enter your Docker username.
> 2. Create another secret called *DOCKER_PASSWORD* and enter your Docker password.

## 2. Set Up Workflows

Workflows in GitHub Actions are automated processes defined in a YAML file. Follow these steps to create and configure a workflow for your project.

1. Create a folder named `.github/workflows` in your repository.
2. Inside this folder, create a new file named `deploy.yaml` to define your workflow.
3. Edit `deploy.yaml` and include the following AWS configuration details:
    - Set the *region*. You can find the region code by clicking the region in the toolbar next to your username (e.g., 'us-east-1').
    - Set the *application_name* as the name of your Elastic Beanstalk application.
    - Set the *environment_name* as the name of your Elastic Beanstalk environment.
    - Set the *existing_bucket_name*. You can find this by searching for the S3 Storage service, clicking the link for the elasticbeanstalk bucket that matches your region code, and copying the name (e.g., 'elasticbeanstalk-us-east-1-549018433513').
    - Set *aws_access_key* to `${{ secrets.AWS_ACCESS_KEY }}`.
    - Set *aws_secret_key* to `${{ secrets.AWS_SECRET_KEY }}`.

## 3. Deploy Your App

Deploying your application is now a straightforward process:

1. In your project's root directory, open your terminal and execute the following commands:
    1. `git add .`
    2. `git commit -m "Testing deployment"`
    3. `git push origin master`
2. Access your GitHub Actions Dashboard to monitor the status of your build.
3. Wait for the status to turn into a green checkmark and display "success."
4. Head to your AWS Elastic Beanstalk application, where it should indicate "Elastic Beanstalk is updating your environment."
5. Eventually, you will see a green checkmark under "Health," and your application will be accessible via the external URL provided under the environment name.

By following these steps, you can efficiently set up and automate your deployment process using GitHub Actions.
