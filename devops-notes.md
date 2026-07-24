Problem: Frontend couldn't create tasks.
Cause: CORS configuration didn't allow the frontend origin.
Solution: Updated CORSMiddleware configuration and rebuilt the containers.

# Task Platform -- Challenges & Solutions

## 1. Docker image download timeout

### Problem

Docker failed to download the Node base image during the frontend build.

``` text
DeadlineExceeded
failed to resolve source metadata
context deadline exceeded
```

### Root Cause

Docker Desktop could not reach Docker Hub due to a network/connectivity
issue.

### Solution

-   Restarted Docker Desktop.
-   Verified Docker Hub connectivity.
-   Rebuilt the image successfully.

### Skills

-   Docker troubleshooting
-   Container image management
-   Network debugging

------------------------------------------------------------------------

## 2. Frontend could not create tasks

### Problem

The React application loaded correctly, but clicking **Create Task**
returned:

``` text
400 Bad Request
```

### Root Cause

The frontend API endpoint and FastAPI CORS configuration were
inconsistent after containerization.

### Solution

-   Corrected the API URL.
-   Fixed the FastAPI CORS configuration.
-   Rebuilt the frontend and backend containers.

### Skills

-   REST API debugging
-   CORS
-   Frontend/backend integration

------------------------------------------------------------------------

## 3. Frontend container continuously restarted

### Problem

Frontend Pods failed readiness/liveness probes and entered a restart
loop.

### Root Cause

The frontend Deployment was accidentally using the backend image
(Uvicorn) instead of the Nginx image.

### Solution

-   Rebuilt the frontend image.
-   Tagged it with a new version.
-   Loaded the correct image into Kind.
-   Updated the Deployment.

### Skills

-   Docker images
-   Kubernetes Deployments
-   Health probes

------------------------------------------------------------------------

## 4. Backend could not connect to PostgreSQL

### Problem

``` text
could not translate host name "postgres"
```

### Root Cause

The PostgreSQL Service was missing, so Kubernetes DNS could not resolve
the hostname.

### Solution

-   Created the PostgreSQL Service.
-   Verified selectors and endpoints.
-   Restarted the backend Deployment.

### Skills

-   Kubernetes Services
-   Cluster DNS
-   Networking

------------------------------------------------------------------------

## 5. Missing Kubernetes Secret

### Problem

Pods failed because `postgres-secret` could not be found.

### Root Cause

The Secret was missing from the `task-platform` namespace.

### Solution

-   Created the Secret.
-   Applied it to the correct namespace.
-   Restarted the workloads.

### Skills

-   Kubernetes Secrets
-   Namespace management

------------------------------------------------------------------------

## 6. Missing ConfigMap

### Problem

The application failed because `task-platform-config` was missing.

### Root Cause

The ConfigMap had not been deployed.

### Solution

-   Created the ConfigMap.
-   Applied it.
-   Restarted the backend.

### Skills

-   ConfigMaps
-   Externalized configuration

------------------------------------------------------------------------

## 7. Missing Services

### Problem

Pods were healthy but could not communicate.

### Root Cause

Frontend, backend, and PostgreSQL Services had not been created.

### Solution

-   Created ClusterIP Services.
-   Verified endpoints.

### Skills

-   Service discovery
-   Internal networking

------------------------------------------------------------------------

## 8. Kind could not use locally built images

### Problem

Deployments failed because the images existed only on the host Docker
daemon.

### Root Cause

Kind uses its own container runtime.

### Solution

``` bash
kind load docker-image task-platform-backend:latest --name kind
kind load docker-image task-platform-frontend:latest --name kind
```

### Skills

-   Kind
-   Local Kubernetes development
-   Image management

------------------------------------------------------------------------

## 9. Ingress routing

### Problem

The application was not reachable through a single endpoint.

### Root Cause

Ingress configuration and local routing were incomplete.

### Solution

-   Installed Traefik.
-   Created the Ingress resource.
-   Configured routing rules.
-   Verified Services and endpoints.
-   Updated local hosts configuration.

### Skills

-   Kubernetes Ingress
-   Reverse proxy
-   HTTP routing

------------------------------------------------------------------------

## 10. Health probe failures

### Problem

Pods continuously restarted.

### Root Cause

The probes targeted a container that was not serving the expected
application.

### Solution

-   Corrected the deployed image.
-   Verified readiness and liveness probes.

### Skills

-   Readiness probes
-   Liveness probes
-   Kubernetes troubleshooting

------------------------------------------------------------------------

# Final Outcome

Successfully deployed a production-style cloud-native application
consisting of:

-   React frontend
-   FastAPI backend
-   PostgreSQL database

Running on Kubernetes using:

-   Docker
-   Kind
-   Deployments
-   StatefulSets
-   Services
-   ConfigMaps
-   Secrets
-   Persistent storage
-   Traefik Ingress
-   Health probes
-   Resource requests and limits

These issues provided hands-on experience debugging real-world
Kubernetes and container orchestration problems.
