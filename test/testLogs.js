import *  as contra from '../routes/controllers/itemController.js';
import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { superoak } from '../deps.js';
import { app } from '../app.js';
import { assertEquals } from "https://deno.land/std@0.119.0/testing/asserts.ts";

/*
Deno.test({
    name: 'Testing idea',
    async fn:() => {
        const request = await superoak(app);
        await request.get('/ideas').expect(200);
    },
    sanitizeOps: false,
    sanitizeResource: false,
});
*/

Deno.test({
    name: 'Testing does log file exist',
    fn: async() => {
        const pathFound = await existsSync("../logs/appi_logs.log")
        assertEquals(pathFound, true)
    },
    sanitizeOps: false,
    sanitizeResource: false,
})

Deno.test({
    name: '\n\nTesting log file content',
    fn: async() => {
        var vast = false;
        const file = await Deno.open('../logs/appi_logs.log');
        //const decoder = new TextDecoder('utf-8');
        const text = await Deno.readTextFile(file);

        console.log(text)
        
        if (text.includes("added")) {
            vast = true;
            console.log("vast variable = " + vast);
            assertEquals(vast, true);
        }
        
    },
    sanitizeOps: false,
    sanitizeResource: false,
});
