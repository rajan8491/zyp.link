import { Router } from "express";
import zypdb from "../db/index.js";
import clicks from "../db/schema/click.schema.js";
import urls from "../db/schema/url.schema.js";
import { eq, count, sql } from 'drizzle-orm';


const analyticRouter = Router({ mergeParams: true });

//total clicks corresponding to url
analyticRouter.get('/url', async(req, res) => {
    try {
        const alias = req.params.alias;
        //first find the url id of short code
        const [url] = await zypdb.select({urlId: urls.id})
        .from(urls)
        .where(eq(urls.shortCode, alias));

        if(!url){
            return res.status(404).json({
                error: "404 not found"
            })
        }
        //now search the total clicks in click table corresponding to urlid
        const [result] = await zypdb
        .select({totalClick: count(clicks.id) })
        .from(clicks)
        .where(eq(clicks.urlId, url.urlId));

        return res.status(200).json(result);

    } catch (error) {
        console.log("error : ",error.message);
        return res.status(500).send('cant fetch total click');
    }

})

analyticRouter.get('/country', async(req, res) => {
    try {
        const alias = req.params.alias;
        //first find the url id of short code
        const [url] = await zypdb.select({urlId: urls.id})
        .from(urls)
        .where(eq(urls.shortCode, alias));

        if(!url){
            return req.status(404).json({
                error: "404 not found"
            })
        }
        //now find clicks by country
        const result = await zypdb
        .select({country: clicks.country, clicks: count(clicks.id)})
        .from(clicks)
        .where(eq(clicks.urlId, url.urlId))
        .groupBy(clicks.country)

        return res.status(200).json({data: result});
    } catch (error) {
        console.log("error : ", error.message);
        return res.status(500).send('error from server on fetching clicks');
    }
})

analyticRouter.get('/daily', async(req, res) => {
    try {
        const alias = req.params.alias;
        //first find the url id of short code
        const [url] = await zypdb.select({urlId: urls.id})
        .from(urls)
        .where(eq(urls.shortCode, alias));

        if(!url){
            return req.status(404).json({
                error: "404 not found"
            })
        }
        
        //now find clicks by day
        const result = await zypdb
        .select({day: sql`DATE(${clicks.createdAt})`, clicks: count(clicks.id)})
        .from(clicks)
        .where(eq(clicks.urlId, url.urlId))
        .groupBy(sql`DATE(${clicks.createdAt})`)
        .orderBy(sql`DATE(${clicks.createdAt})`);

        return res.status(200).json({data: result});
    } catch (error) {
        console.log("error : ", error);
        return res.status(500).send('error from server on fetching clicks');
    }
})

analyticRouter.get('/', async(req, res) => {
    try {
        const alias = req.params.alias;
        //first find the url id of short code
        const [url] = await zypdb.select({urlId: urls.id})
        .from(urls)
        .where(eq(urls.shortCode, alias));

        if(!url){
            return req.status(404).json({
                error: "404 not found"
            })
        }

        const [totalCount] = await zypdb
        .select({totalClick: count(clicks.id) })
        .from(clicks)
        .where(eq(clicks.urlId, url.urlId));
        
        const countryCount = await zypdb
        .select({country: clicks.country, clicks: count(clicks.id)})
        .from(clicks)
        .where(eq(clicks.urlId, url.urlId))
        .groupBy(clicks.country)

        const dayCount = await zypdb
        .select({day: sql`DATE(${clicks.createdAt})`, clicks: count(clicks.id)})
        .from(clicks)
        .where(eq(clicks.urlId, url.urlId))
        .groupBy(sql`DATE(${clicks.createdAt})`)
        .orderBy(sql`DATE(${clicks.createdAt})`);

        return res.status(200).json({
            totalClick: totalCount.totalClick,
            byCountry: countryCount,
            byDay: dayCount
        });
    } catch (error) {
        console.log("error : ", error);
        return res.status(501).send('error from server on fetching clicks');
    }
})


export default analyticRouter;