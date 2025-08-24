import express, { json } from 'express';
import zypdb from './db/index.js';
import urls from './db/schema/url.schema.js';
import { eq } from 'drizzle-orm';
import clicks from './db/schema/click.schema.js';
import urlRouter from './routes/url.routes.js';
import analyticRouter from './routes/analytics.routes.js';

const app = express();
app.use(json())

app.use('api/v1/url', urlRouter)

app.get('/:alias', async(req, res) => {
    const alias = req.params.alias;
    try {
        const [result] = await zypdb.select({
            urlId: urls.id,
            originalURL: urls.originalURL,
            expireAt: urls.expireAt
        }).from(urls).where(eq(urls.shortCode, alias));

        if(result){
            if(result.expireAt && result.expireAt < new Date()){
                return res.status(410).send("This short link is expired")
            }
            res.redirect(result.originalURL);

            await zypdb.insert(clicks).values({
                urlId: result.urlId,
                ip: req.ip,
                userAgent: req.headers['user-agent'] || null,
                referer: req.headers['referer'] || null
            })
        }
        else{
            return res.status(404).json({
                error: "404 not found"
            })
        }
    } catch (er) {
        console.log(`error : ${er.message}`);
        return res.status(500).json({ error: "there is error from server side"})
    }
})

app.use('/api/v1/analytics/clicks/:alias', analyticRouter)

export default app;