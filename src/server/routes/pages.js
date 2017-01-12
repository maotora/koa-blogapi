import Router from 'koa-rest-router';
import passport from 'koa-passport';
import Page from './../model/page';

const requireJwtAuth = passport.authenticate('jwt', { session: false });
const api = new Router({prefix: '/api/v1'});

api.resource('pages', {
    
    index: async (ctx, next) => {
        const pagesList =  await Page.find({});

        ctx.status = 200;
        ctx.body = await pagesList;
        await next();
    },
    create: [
        requireJwtAuth,
        async (ctx, next) => {
            const content = await ctx.request.body;
            const page = await new Page(content);
            const id = await page.save();

            ctx.status = 201;
            ctx.body = await id;

            await next();
        }
    ],
    show: async (ctx, next) => {
        const id = await ctx.params.page;
        const page = await Page.findById(id);

        ctx.status = 200;
        ctx.body = await page;

        await next();
    },
    edit: async (ctx, next) => {
        const id = await ctx.params.page;
        const page = await Page.findById(id);

        ctx.status = 200;
        ctx.body = await page;

        await next();
    },
    update: [
        requireJwtAuth,
        async (ctx, next) => {
            const content = await ctx.request.body;
            const id = await ctx.params.page;

            await Page.update({id}, content);
            ctx.status = 202;
            await next();
        }
    ],
    remove: [
        requireJwtAuth,
        async (ctx, next) => {
            const id = await ctx.params.page;

            await Page.remove({id});
            ctx.status = 200;
        }
    ]
});

/*
 * Warning!
 * requireJwtAuth allows every logged in user to manipulate a page.
 * Change this authentication method to only work with posts admins.
 *
*/

export default api;
