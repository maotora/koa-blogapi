import Router from 'koa-rest-router';
import User from './../model/user';
import formurlencoded from 'form-urlencoded';
import passport from 'koa-passport';
import { signUp } from './../controllers/auth';

const requireJwtAuth = passport.authenticate('jwt', {session: false});
const api = new Router({prefix: '/api/v1'});

api.resource('users', {

    index: [
        requireJwtAuth,
        async (ctx, next) => {
            const userList = await User.find({});

            ctx.status = 200;
            ctx.body = userList;
            await next(); 
        }
    ],

    show: async (ctx, next) => {
        const userId = await ctx.params.user;
        const user = await User.findById(userId);

        ctx.status = 200;
        ctx.body = user; 

        await next(); 
    },

    create:[
        signUp,
        async (ctx, next) => {
            const token = await ctx.request.body;
            await next(); 
        }
    ],

    edit: (ctx, next) => {
        ctx.body = "Performs exactly like show.. so nope!\n"; return next(); 
    },

    update: async (ctx, next) => {
        const id = await ctx.params.user;

        await User.update({id}, ctx.request.body);
        ctx.status = 202;
        ctx.response.redirect(`${id}`);

        return next(); 
    },

    remove: async (ctx, next) => {
        const id = await ctx.params.user;
        await User.remove({id});

        ctx.status = 202;
        await next();
    }

});

export default api;
