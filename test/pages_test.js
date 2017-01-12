import request from 'supertest';
import app from './../dist/server/app';
import Page from './../dist/server/model/page';
import User from './../dist/server/model/user';

const inst = app.listen();

describe('Pages Api', () => {
    
    let a_page = {};
    let a_user = {};

    beforeEach(async () => {
        a_user = { 
            "username": "testing",
            "password": 'newpassword',
            "age": 22,
            "height": 179 
        };

        a_page = { 
            creator: "Test user",
            date: Date.now(),
            hidden: false,
            meta: { viewers: 0 }
        };

        await Page.remove({});
        await User.remove({});
    });

    after(async () => {
        await Page.remove({});
        await User.remove({});
    });
    
    it('Shows list of blog pages', async() => {
        const page = new Page(a_page);
        await page.save();

        await request(inst)
            .get('/api/v1/pages')
            .expect(/Test user/);
    });

    it('Creates a page', async() => {
        const response = await request(inst).post('/api/v1/signup/').send(a_user);
        const { text } = response;

        await request(inst)
            .post('/api/v1/pages')
            .set('authorization', text)
            .send(a_page)
            .expect(201);
    });

    it('Update a page', async() => {
        const page = new Page(a_page);
        const pageId = await page.save();

        const response = await request(inst).post('/api/v1/signup/').send(a_user);
        const { text } = response;

        await request(inst)
            .put(`/api/v1/pages/${pageId}`)
            .set('authorization', text)
            .send(a_user)
            .expect(202);
    });

    it('Deletes a page', async() => {
        const response = await request(inst).post('/api/v1/signup/').send(a_user);
        const { text } = response;
        const page = new Page(a_page);
        const pageId = await page.save();

        await request(inst)
            .del(`/api/v1/pages/${pageId}`)
            .set('authorization', text)
            .expect(200);
    });
});
