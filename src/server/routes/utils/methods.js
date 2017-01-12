const indexMethod = function(model, status=200, authMiddleware) {
    return [
        authMiddleware,
        async (ctx, next) => {
            const list =  await ['model'].find({});

            ctx.status = status;
            ctx.body = await list;
            await next();
        }
    ];
}

const createMethod = function(model, status=201, requireJwtAuth, authMiddleware) {
    return [ 
        authMiddleware,
        async (ctx, next) => {
            const content = await ctx.request.body;
            const toSave = await new ['model'](content);
            const id = await toSave.save();

            ctx.status = status;
            ctx.body = await id;

            await next();
        }
    ];
}

const showMethod = function(model, status=200) {
    return async (ctx, next) => {
        const id = await ctx.params.page;
        const page = await Page.findById(id);

        ctx.status = 200;
        ctx.body = await page;

        await next();
    }
}

const editMethod = function(model, status) {
    return async (ctx, next) => {
        const id = await ctx.params.page;
        const page = await Page.findById(id);

        ctx.status = 200;
        ctx.body = await page;

        await next();
    };
}

const updateMethod = function(model, status=202, requireJwtAuth,authMiddleware) { 
    return [
        authMiddleware,
        async (ctx, next) => {
            const content = await ctx.request.body;
            const id = await ctx.params.page;

            await Page.update({id}, content);
            ctx.status = 202;
            await next();
        }
    ];
}

const removeMethod = function(model, status=202, authMiddleware) {
    return [
        authMiddleware,
        async (ctx, next) => {
            const id = await ctx.params.page;

            await Page.remove({id});
        }
    ];
}

export { indexMethod, createMethod, showMethod, updateMethod, removeMethod };
