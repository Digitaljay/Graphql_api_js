const express = require('express')
const mongoose = require('mongoose')
const config = require("config");
const db = config.get("mongoURI");
const {ApolloServer, gql} = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID
    name: String
    surname: String
    email: String
    avatar: String
  }

  type Post {
    id: ID
    authorId: ID
    title: String
    content: String
    published: String
  }

  type Comment {
    id: ID
    authorId: ID
    postId: ID
    replyTo: ID
    content: String
    published: String
  }
  type Query {
    rUser(id: Int): User
    rPost(id: Int): Post
    rComment(id: Int): Comment
  }

  type Mutation {
    cUser(name: String, surname: String, email: String, avatar: String): User
    dUser(id: ID): User
    uUser(id: ID, name: String, surname: String, email: String, avatar: String): User

    cPost(authorId: ID, title: String, content: String): Post
    dPost(id: ID, authorId: ID): Post
    uPost(id: ID, authorId: ID, title: String, content: String): Post

    cComment(authorId: ID, postId: ID, replyTo: ID, content: String): Comment
    dComment(id: ID, authorId: ID): Comment
    uComment(id: ID, authorId: ID, content: String): Comment
  }
`;

const User = require('./objects/user')
const Post = require('./objects/post')
const Comment = require('./objects/comment')

const resolvers = {
    Query: {
        rUser: async (parent, {id}, context, info) => {
            const user = await User.findOne({_id: id})
            if (user) return user
        },
        rPost: async (parent, {id}, context, info) => {
            const post = await Post.findOne({_id: id})
            if (post) return post
        },
        rComment: async (parent, {id}, context, info) => {
            const comment = await Comment.findOne({_id: id})
            if (comment) return comment
        },
    },
    Mutation: {
        cUser: async (parent, {name, surname, email}, context, info) => {
            const newUser = User({
                _id: (Math.random() * 100).toFixed(0),
                name: name,
                surname: surname,
                email: email,
            })
            await newUser.save((err) => {
                if (err) {
                    return console.log(err)
                }
            })
            return newUser
        },
        uUser: async (parent, {id, name, surname, email, avatar}, context, info) => {
            const user = await User.findOne({_id: id})
            await User.updateOne({_id: id}, {
                name: name ? name : user.name,
                surname: surname ? surname : user.surname,
                email: email ? email : user.email,
                avatar: avatar ? avatar : user.avatar
            })
            let updatedUser = await User.findOne({_id: id})
            return updatedUser

        },
        dUser: async (parent, {id}, context, info) => {
            const userToDelete = await User.findOne({_id: id})
            const userCopy = userToDelete
            if (userToDelete) {
                await userToDelete.delete((err) => {
                    if (err) return console.log(err)
                })
                return userToDelete
            }
        },
        cPost: async (parent, {authorId, title, content}, context, info) => {
            const newPost = Post({
                _id: (Math.random() * 100).toFixed(0),
                authorId: authorId,
                title: title,
                content: content
            })

            await newPost.save((err) => {
                if (err) return console.log(err)
            })
            return newPost
        },
        dPost: async (parent, {id, authorId}, context, info) => {
            const post = await Post.findOne({_id: id, authorId: authorId})
            const postCopy = post
            if (post) {
                await post.delete((err) => {
                    console.log(err)
                })
                return postCopy
            }
        },
        uPost: async (parent, {id, authorId, title, content}, context, info) => {
            const post = await Post.findOne({_id: id, authorId: authorId})
            console.log(post)
            await Post.updateOne({_id: id}, {
                title: title ? title: post.title,
                content: content ? content: post.content
            })
            let updatedPost = await Post.findOne({_id: id, authorId: authorId})
            return updatedPost
        },
        cComment: async (parent, {authorId, postId, content, replyTo}) => {
            const comment = new Comment({
                authorId: authorId,
                postId: postId,
                content: content,
                replyTo: replyTo ? replyTo : 0
            })

            await comment.save((err) => {
                if (err) return console.log(err)
            })
            return comment
        },
        dComment: async (parent, {id, authorId}) => {
            const comment = await Comment.findOne({_id: id, authorId: authorId})
            let commentCopy = comment
            if (comment) {
                await comment.delete((err) => {
                    console.log(err)
                })
                return commentCopy
            }
        },
        uComment: async (parent, {id, authorId, content}) => {
            await Comment.updateOne({_id: id, authorId: authorId}, {
                content: content
            })
            const updatedComment = await Comment.findOne({_id: id, authorId:authorId})
            return updatedComment
        }
    }
}

async function run() {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
        })

        const server = new ApolloServer({typeDefs, resolvers});
        server.listen().then(({url}) => {
            console.log(`Server ready at ${url}`);
        });

    } catch (e) {
        console.log(e);
    }
}

run()
