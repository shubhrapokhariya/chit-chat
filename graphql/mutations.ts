import {gql} from '@apollo/client'

export const ADD_POST = gql`
mutation MyMutation(
    $body: String!
    $image: String!
    $community_id:ID!
    $title: String!
    $username:String!
    # $is_published:Boolean!
    # $wishlisted:Boolean!
){
    insertPost(
        body:$body
        image:$image
        community_id:$community_id
        title:$title
        username:$username
        # is_published:$is_published
        # wishlisted:$wishlisted
    )
    {
        username
        title
        body
        created_at
        id
        image
        community_id
        # is_published
        # wishlisted
    }
}`

export const ADD_COMMUNITY = gql`
mutation MyMutation($topic: String!){
    insertCommunity(topic:$topic){
        id
        topic
        created_at
        
    }
}`

export const ADD_COMMENT = gql`
mutation MyMutation($post_id: ID!, $username: String!, $text:String!){
    insertComment(post_id:$post_id, text:$text, username:$username){
        id
        post_id
        created_at
        text
        username
    }
}`

export const ADD_VOTE = gql`
mutation MyMutation($post_id: ID!, $username: String!, $upvote:Boolean!){
    insertVote(post_id:$post_id, upvote:$upvote, username:$username){
        id
        post_id
        created_at
        upvote
        username
    }
}`

export const DELETE_VOTES = gql`
mutation MyMutation($post_id: ID!){
    deleteVotes(post_id:$post_id){
        post_id       
        username    
    }
}`

export const DELETE_COMMENTS = gql`
mutation MyMutation($post_id: ID!){
    deleteComments(post_id:$post_id){
        post_id       
        username 
       
    }
}`

export const DELETE_POST = gql`
mutation MyMutation($id: ID!){
    deletePost(id:$id){      
        title
        username     
    }
}`


