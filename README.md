Description
link to the hosted version - https://pen-nc-news.onrender.com/
This project is CRUD API, with following endpoints:
'/api/' - get description of endpoints
'/api/topics' - get array of topics
'/api/articles/:article_id' - get article by id
'/api/articles' - get array of articles
'/api/articles/:article_id/comments' - get all comments for article by id
'/api/articles/:article_id/comments' - post comments for article by id, accepting username, body they are require
'/api/articles/:article_id' - patch article by id, accepting inc_votes which you need pass value
'/api/comments/:comment_id' - delete commets by id
'/api/users' - get array of users

In order to clone on you machine, paste following command in your terminal, there is link on git repo
"git clone https://github.com/PENbDM/nc-coders-project"

What you need prepare to make it work on your machine if you clone it:
create .env.development, put there "PGDATABASE=nc_news"
The minimum versions of Node.js is "21.6.0", and Postgres is "^8.7.3"