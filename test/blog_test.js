import request from 'supertest';
import app from './../dist/server/app';
import Post from './../dist/server/model/blog'; 
import User from './../dist/server/model/user'; 

const inst = app.listen();

describe('Blog Api', () => {
    let a_post = {};
    let a_user = {};

    beforeEach(async () => {
        a_user = { 
            "username": "testing",
            "password": 'newpassword',
            "age": 22,
            "height": 179 
        };

        a_post = { 
            title: 'Blog post',
            author: 'Test User',
            content: 'Awesome blog post!',
            date: Date.now(),
            comments: [ 
                {
                    body: "Aweomse comment!",
                    date: Date.now() 
                }, 

                {
                    body: "Another Awesome comment!",
                    date: Date.now() 
                }, 
            ],
            hidden: false,
            categories: ["Awesome!", "Test", "More!"],
            meta: {
                favs: 0,
                votes: 0,
                tags: ["test", "something"]
            },
        };

        await Post.remove({});
        await User.remove({});
    });

    after(async () => {
        await Post.remove({});
        await User.remove({});
    });
    
    it('Shows list of blog posts', async() => {
        const post = new Post(a_post);
        await post.save();

        await request(inst)
            .get('/api/v1/posts')
            .expect(/Blog post/)
            .expect(200);
    });

    it('Creates a blog post', async() => {
        const response = await request(inst).post('/api/v1/signup/').send(a_user);
        const { text } = response;

        await request(inst)
            .post('/api/v1/posts')
            .set('authorization', text)
            .send(a_post)
            .expect(201);
    });

    it('Update a blog post', async() => {
        const response = await request(inst).post('/api/v1/signup/').send(a_user);
        const { text } = response;
        const post = new Post(a_post);
        const postId = await post.save();

        await request(inst)
            .put(`/api/v1/posts/${postId}`)
            .set('authorization', text)
            .send(a_post)
            .expect(202);
    });

    it('Deletes a blog post', async() => {
        const response = await request(inst).post('/api/v1/signup/').send(a_user);
        const { text } = response;
        const post = new Post(a_post);
        const postId = await post.save();

        await request(inst)
            .del(`/api/v1/posts/${postId}`)
            .set('authorization', text)
            .expect(200);
    });
});
