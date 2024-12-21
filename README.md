# ShoppingStop
A frontend web app for shopping
For chat functionality

You must do :- 
CREATE A DOCKER CONTAINER WITH PORT 6379 WITH REDIS IMAGE

docker run --name redis-server -p 6379:6379 -d redis

docker ps
EXPECTED CONTAINER INFO
docker exec -it redis-server redis-cli ping
EXPECTED PONG 

docker start redis-server