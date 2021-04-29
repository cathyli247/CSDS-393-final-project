### Run the server:

- **run react:**    
cd frontend     
npm start       

- **run django:**            
cd backend          
python3 manage.py makemigrations     
python3 manage.py migrate    
python3 manage.py runserver

***

### Url:
**admin-panel/**
- admin-panel/ posts/ (list all posts)
- admin-panel/ posts/view/\<slug\>/ (get all details(fields) of a single post)
- admin-panel/ users/.      
  - POST  (create a new user with pk and data).    
  - GET (get with pk)
- admin-panel/ users/detail/ 
  - GET (get a single user by pk)
  - PATCH (update a single user with new data and pk)
  - DELETE (delete a single user by pk)
- admin-panel/ comments/list/all/ (get all comments)
- admin-panel/ comments/detail/\<pk\>/ (get a single detailed comment by pk)
- admin-panel/ comments/list/\<slug\>/ (get a single detailed comment by id)

**auth/**
- auth/ ^password/reset/$ [name='rest_password_reset']
- auth/ ^password/reset/confirm/$ [name='rest_password_reset_confirm']
- auth/ ^login/$ [name='rest_login']
- auth/ ^logout/$ [name='rest_logout']
- auth/ ^user/$ [name='rest_user_details']
- auth/ ^password/change/$ [name='rest_password_change']
- auth/registration/
  
**dashboard/**
- dashboard/ create-new-post/
  - POST (create a new post with data and pk)
- dashboard/ post-list/
  - GET (get all posts of a single author)
- dashboard/ update-post/
  - POST (update a single post with new data and pk)
- dashboard/ delete-post/
  - DELETE (delete a single post with pk)

**comments/**
- comments/ \<slug\>/
  - GET (get the data of a single comment with id)
- comments/ create/\<slug\>/
  - POST (create a new comment with pk)
- comments/ delete/\<slug\>/
  - DELETE (delete a comment with id)
 
**register/**

***
Pk: primary key       

Comment’s pk: post     
Post’s pk: author(user)     

Example json for post:
{'slug': 2, 'title': '', 'body': '', ‘short_description': ‘’, 'author': 'aaa', ‘is_published': True, ‘created_on‘: ‘’, ‘published_on’:’’, ‘last_edited’:’’}
