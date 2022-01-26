# Radium
# Scalable URL Shortner Project Requirement
# Phase I
# Overview
URL shortening is used to create shorter aliases for long URLs. We call these shortened aliases “short links.” Users are redirected to the original URL when they hit these short links. Short links save a lot of space when displayed, printed, messaged, or tweeted. Additionally, users are less likely to mistype shorter URLs.

For example, if we shorten the following URL through TinyURL:

https://babeljs.io/blog/2020/10/15/7.12.0#class-static-blocks-12079httpsgithubcombabelbabelpull12079-12143httpsgithubcombabelbabelpull12143

We would get:

https://tinyurl.com/y4ned4ep

The shortened URL is nearly one-fifth the size of the actual URL.

Some of the use cases for URL shortening is to optimise links shared across users, easy tracking of individual links and sometimes hiding the affiliated original URLs.

If you haven’t used tinyurl.com before, please try creating a new shortened URL and spend some time going through the various options their service offers. This will help you have a little context to the problem we solve through this project.

# Key points
1)Create a group database groupXDatabase. You can clean the db you previously used and reuse that.

2)This time each group should have a single git branch. Coordinate amongst yourselves by ensuring every next person pulls the code last pushed by a team mate. You branch will be checked as part of the demo. Branch name should follow the naming convention project/urlShortnerGroupX

3)Follow the naming conventions exactly as instructed. The backend code will be integrated with the front-end application which means any mismatch in the expected request body will lead to failure in successful integration.
# Models
# Url Model
{ urlCode: { mandatory, unique, lowercase, trim }, longUrl: {mandatory, valid url}, shortUrl: {mandatory, unique} }

# POST /url/shorten
1)Create a short URL for an original url recieved in the request body.
2)The baseUrl must be the application's baseUrl. Example if the originalUrl is http://abc.com/user/images/name/2 then the shortened url should be http://localhost:3000/xyz
3)Return the shortened unique url. Refer this for the response
4)Ensure the same response is returned for an original url everytime
5)Return HTTP status 400 for an invalid request

# GET /:urlCode
1)Redirect to the original URL corresponding
2)Use a valid HTTP status code meant for a redirection scenario.
3)Return a suitable error for a url not found
4)Return HTTP status 400 for an invalid request

# Testing
1)To test these apis create a new collection in Postman named Project 4 Url Shortner
2)Each api should have a new request in this collection
3)Each request in the collection should be rightly named. Eg Url shorten, Get Url etc
4)Each member of each team should have their tests in running state

# Phase II
1)Use caching while creating the shortened url to minimize db calls.
2)Implement what makes sense to you and we will build understanding over the demo discussion.
3)Figure out if you can also use caching while redirecting to the original url from the shortedned url

# Response
  # Successful Response structure
{
  status: true,
  data: {

  }
}
  # Error Response structure
{
  status: false,
  message: ""
}
  # Response samples
   # Url shorten response
{
  "data": {
    "longUrl": "http://www.abc.com/oneofthelongesturlseverseenbyhumans.com",
    "shortUrl": "http://localhost:3000/2WlQej2a",
    "urlCode": "2WlQej2a"
  } 
}
