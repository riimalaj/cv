import { Context } from 'https://deno.land/x/oak@v9.0.1/mod.ts';
import * as itemServices from '../../services/itemService.js';
import { renderFile } from '../../deps.js';
import {
    ensureDir,
    ensureFile,
    ensureFileSync,
} from 'https://deno.land/std/fs/mod.ts';
import { format } from 'https://deno.land/std@0.91.0/datetime/mod.ts';
import * as getIp from 'https://deno.land/x/get_ip@v2.0.0/mod.ts';
import { readLines } from 'https://deno.land/std/io/mod.ts';
import * as path from 'https://deno.land/std/path/mod.ts';
import { readline } from 'https://deno.land/x/readline@v1.1.0/mod.ts';
import { getNetworkAddr } from 'https://deno.land/x/local_ip/mod.ts';
import { getPublicIpv4 } from 'https://deno.land/x/masx200_get_public_ip_address/mod.ts';
import { config, parse} from 'https://deno.land/x/dotenv/mod.ts';

var check = false;

const netAddr = await getNetworkAddr();

var log = [];
var temp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
var tDate = temp.replace(' ', '_').replace(':', '');
console.log('Dataa tiedostoon logs/appi_logs_' + tDate + '.log');
console.log('Your local network address, ', netAddr);
const publicIp = await getPublicIpv4();
console.log('Your public ip:', publicIp);
console.log(config({export:true}))
const IP_KEY = Deno.env.get("IPKEY");
console.log("IP_KEY:", IP_KEY)

let loc = {
    ip: '',
    continent_name: '',
    country: '',
    city: '',
    region: '',
    zip: '',
};

const paivitaNettiData = async () => {
    check = true;
    const locationRes = await fetch(
        `http://api.ipstack.com/${publicIp}?access_key=${IP_KEY}`
    )
        .then((res) => res.json())
        .then((data) => {
            (loc.ip = data.ip),
                (loc.continent = data.continent_name),
                (loc.country = data.country_name),
                (loc.region = data.region_name),
                (loc.city = data.city),
                (loc.zip = data.zip);
        });

    console.log(loc);
    let dupCheckResp = await itemServices.checkDup(loc.ip);
    console.log('dupCheckResp:', dupCheckResp);
    if (dupCheckResp < 1 && loc.ip != '3.75.158.163') {
        const netUpdateResp = await itemServices.updateTracker(loc);
    } else {
        console.log("Allready there, so let's not duplicate.");
    }
};

if (check === false) {
    paivitaNettiData();
}

const showImg = async (ctx, next) => {
    const imageBuf = await Deno.readFile('./static/RiimalaJouni.jpg');
    ctx.response.body = imageBuf;
    ctx.response.headers.set('Content-Type', 'image/jpg');
    next();
};

const showMain = async ({ response }) => {
    response.body = await renderFile('../views/cv.eta', {
        pvm: new Date().toLocaleDateString(),
        status: 200,
    });
};

const showVisitors = async ({ response }) => {
    console.log('Fetching visitors');
    response.body = await renderFile('../views/visitors.eta', {
        visitors: await itemServices.getVisitors(),
    });
};

const showLogFile = async ({ response }) => {
    console.log('itemController, showLogFile');
    const data = await Deno.readTextFile('logs/appi_logs.log');
    console.log(data);
    response.body = await renderFile('../views/logReader.eta', {
        content: data,
        newLine: '\n',
    });
};

//https://deno.land/x/readline@v1.1.0
const showLogFileNotWorking = async ({ response }) => {
    console.log('showLogFile');
    const f = await Deno.open('logs/appi_logs.log');
    for await (const line of readline(f)) {
        response.body = await renderFile('../views/logReader.eta', {
            content: `${new TextDecoder().decode(line)}`,
        });
    }
    f.close();
};

const loggaus = async (log) => {
    console.log('loggaus funktioata kutsuttu');
    ensureDir('./logs').then(() => {
        let location = './logs/appi_logs.log';

        for (let i of log) {
            console.log(i);
            Deno.writeTextFile(location, i + '\n\n', { append: true });
        }
    });
};

export {
    showImg,
    paivitaNettiData,
    showMain,
    showLogFile,
    loggaus,
    showVisitors,
};
