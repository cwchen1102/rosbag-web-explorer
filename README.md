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

# Development

To develop Rosbag Web Explorer on your local machine, please follows the steps:

1. Install Docker
2. Activate all containers by running `docker-compose -f docker-compose-dev.yml up` 
3. Visit `http://localhost/`

# Deployment

To efficiently integrate and deploy code on AWS, GitHub Actions will be used as the CI/CD tool. 

## AWS

AWS provides on-demand delivery of IT resources over the Internet with pay-as-you-go pricing. Instead of buying, owning, and maintaining physical data centers and servers, you can access cloud technology services, such as computing power, storage, and databases.

Here is the AWS services we are going to use:

1. **Identity and Access Management (IAM)** specifies who or what can access services
2. **Elastic Beanstalk (EB)** deploys and scales web applications and services automatically, from capacity provisioning, load balancing, and auto scaling to application health monitoring.
3. **Simple Storage Service** (**S3)** stores and protects data for virtually any use case
4. **Relational Database Service (RDS)** sets up, operates, and scales a relational database in the cloud
5. **Virtual Private Cloud (VPC)** gives full control over the virtual networking environment

Follow the steps to set up AWS services:

[AWS Setup](https://drive.google.com/file/d/1_SQole24pezvTxm_Cu_apKHti3Sz5XXE/view?usp=share_link)

## Github Actions

GitHub Actions is a continuous integration and continuous delivery (CI/CD) platform that allows you to automate your build, test, and deployment pipeline. You can create workflows that build and test every pull request to your repository, or deploy merged pull requests to production.

Follow the steps to set up Github Actions

[Github Actions Setup](https://drive.google.com/file/d/1oOACOmG4SEXDlY6MMLRGHUDokHTQzpY5/view?usp=share_link)
