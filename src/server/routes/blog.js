import Router from 'koa-rest-router';
import passport from 'koa-passport';
import Blog from './../model/blog';

const requireJwtAuth = passport.authenticate('jwt', { session: false });
const api = new Router({prefix: '/api/v1'});

api.resource('posts', {
    index: async (ctx, next) => {
        const list =  await Blog.find({});

        ctx.status = 200;
        ctx.body = await list;
        await next();
    },
    create: [
        requireJwtAuth,
        async (ctx, next) => {
            const content = await ctx.request.body;
            const post = await new Blog(content);
            const id = await post.save();

            ctx.status = 201;
            ctx.body = await id;

            await next();
        }
    ],
    show: async (ctx, next) => {
        const id = await ctx.params.post;
        const post = await Blog.findById(id);

        ctx.status = 200;
        ctx.body = await post;

        await next();
    },
    edit: async (ctx, next) => {
        const id = await ctx.params.post;
        const post = await Blog.findById(id);

        ctx.status = 200;
        ctx.body = await blog;

        await next();
    },
    update: [
        requireJwtAuth,
        async (ctx, next) => {
            const content = await ctx.request.body;
            const id = await ctx.params.post;

            await Blog.update({id}, content);
            ctx.status = 202;
            await next();
        }
    ],
    remove: [
        requireJwtAuth,
        async (ctx, next) => {
            const id = await ctx.params.post;

            await Blog.remove({id});
            ctx.status = 200;
        }
    ]
});

/*
 * Warning!
 * requireJwtAuth allows every logged in user to manipulate a post.
 * Change this authentication method to only work with posts admins.
 *
*/

export default api;
