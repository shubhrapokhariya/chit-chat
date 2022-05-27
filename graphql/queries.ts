import {gql} from '@apollo/client'

export const GET_ALL_POSTS = gql`
query MyQuery   {
  getPostList {
    community_id
    created_at
    id
    title
    image
    username
    body
    # is_published
    # wishlisted
    community {
      created_at
      id
      topic
    }  
    comments {
      id
      post_id
      text
      username
      created_at
    }
    votes {
      post_id
      upvote
      username
      created_at
      id
    }
  }
}
`;

export const GET_ALL_POSTS_BY_TOPIC = gql`
query MyQuery ($topic: String!)  {
  getPostListByTopic(topic:$topic) {
    community_id
    created_at
    id
    title
    image
    username
    body
    # is_published
    # wishlisted
    community {
      created_at
      id
      topic
    }  
    comments {
      id
      post_id
      text
      username
      created_at
    }
    votes {
      post_id
      upvote
      username
      created_at
      id
    }
  }
}
`;

export const GET_POST_BY_POST_ID = gql`
query MyQuery ($post_id: ID!)  {
  getPostListByPostId(post_id:$post_id) {
    community_id
    created_at
    id
    title
    image
    username
    body
    # is_published
    # wishlisted
    community {
      created_at
      id
      topic
    }  
    comments {
      id
      post_id
      text
      username
      created_at
    }
    votes {
      post_id
      upvote
      username
      created_at
      id
    }
  }
}
`;

export const GET_ALL_VOTES_BY_POST_ID = gql`
query MyQuery ($post_id: ID!)  {
  getVotesByPostId(post_id:$post_id) { 
  created_at
  id
   post_id
   upvote
   username
  }
}
`;



export const GET_COMMUNITY_LIST_BY_TOPIC = gql`
query MyQuery($topic:String!){ 
getCommunityListByTopic(topic:$topic){
id
topic
created_at}      
    }
`

export const GET_COMMUNITY_WITH_LIMIT = gql`
query MyQuery($limit: Int!){ 
getCommunityListByLimit(limit:$limit){
id
topic
created_at}      
    }
`




