import express, { json } from 'express';
import { nanoid } from 'nanoid'
import zypdb from './db/index.js';
import urls from './db/schema/url.schema.js';
import { eq } from 'drizzle-orm';

const app = express();
app.use(json())

app.post('/shortcode', async(req, res) => {
    try {
        const {url, code, expireAt} = req.body;
        let shortCode;
        if(code){
            const exist = await zypdb.select().from(urls).where(eq(urls.shortCode, code));
            if(exist.length>0){
                return res.status(409).json({
                    error: "custom alias is already exist"
                })
            }
            shortCode = code;
        } else{
            for(let i = 0; i < 6; i++){
                shortCode = nanoid(6);
                const exist = await zypdb.select().from(urls).where(eq(urls.shortCode, shortCode));
                if(exist.length==0) break;
            }
            if(!shortCode){
                return res.status(501).json({
                    error: "unable to generate short alias"
                })
            }
        }
        const shortURL = `https://zyp.link/${shortCode}`;
        const test = await zypdb.insert(urls).values({
            originalURL: url,
            shortCode,
            expireAt: expireAt ? new Date(expireAt) : null
        })
        return res.status(201).json({
            shortURL
        })
    } catch (err) {
        console.log(`error : ${err.message}`, err);
        return res.status(501).json({
            error: "There is error during creating shortURL"
        })
    }
})

app.get('/:code', async(req, res) => {
    const code = req.params.code;
    try {
        const [result] = await zypdb.select({
            originalURL: urls.originalURL,
            expireAt: urls.expireAt
        }).from(urls).where(eq(urls.shortCode, code));

        if(result){
            if(result.expireAt && result.expireAt < new Date()){
                return res.status(410).send("This short link is expired")
            }
            return res.redirect(result.originalURL)
        }
        return res.status(404).json({
            error: "404 not found"
        })
    } catch (er) {
        console.log(`error : ${er.message}`);
        return res.status(500).json({ error: "there is error from server side"})
    }
})

export default app;