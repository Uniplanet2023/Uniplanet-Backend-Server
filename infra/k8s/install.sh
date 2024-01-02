# kubectl delete pod posts 

kubectl apply -f posts-depl.yaml # Tells kubernetes to process the config

kubectl logs posts

kubectl describe pod posts

# kubectl exec -it posts sh # execute the given command in a running pod (sh is used when you use multiple dockere)

kubectl get deployment

kubectl get pods # same as docker ps

kubectl describe deployment posts-depl

# kubectl delete deployment posts-depl