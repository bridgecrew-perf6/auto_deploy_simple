Steps:
0. Checkout your git repo from the server (I use /var/www/carbonite)
1. Upload both of these files to the same directory on your server
2. chmod +x restart_node.sh
3. node github_post_commit.js &
4. In the github admin for your repo, set a post commit hook to the url http://<your host>:8080/
5. Make a commit to your repo
6. Point a browser at http://<your host>:8080/ and you should see the commit