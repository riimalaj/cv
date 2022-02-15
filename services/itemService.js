import { client } from '../database/db.js';

//const databaseUrl = Deno.env.get("DATABASE_URL");
debugger;

const tarkistaHuoltoId = async (response) => {
    console.log(tarkistaHuoltoId);
    await client.connect();
    const res = await client.queryArray(
        'SELECT huolto_id FROM huoltorekisteri ORDER BY huolto_id DESC LIMIT 1'
    );
    await client.end();
    console.log('Viimeisin huolto_id: ', res.rows[0]);
    return res.rows[0];
};

const huoltoKantaan = async (
    tyyppi,
    huolto,
    hetki,
    sijainti,
    huomiot,
    huoltopvm,
    osa,
    kulu
) => {
    console.log('Syötetään huolto, itemservice');
    console.log('tyyppi:', tyyppi);
    console.log('huolto:', huolto);
    console.log('hetki:', hetki);
    console.log('sijainti:', sijainti);
    console.log('huomiot:', huomiot);
    console.log('huoltopvm:', huoltopvm);
    console.log('osa:', osa);
    console.log('kulu:', kulu);

    console.log('service huomiot:', huomiot);
    //huoltorekisteri: huolto_id	valine	huolto	hetki	paikka	tehty	kirjattu	huomio
    //hankinnat: hankinta_id	osa	kulu	hpaikka	huolto_id
    // Jos kysymyksessä osien hankinta sitten huoltorekisteriin + hankitoihin (hankinnat). Pitää varmistaa, että menee sama huolto_id
    const huoltoid = await tarkistaHuoltoId();
    let huolto_id = parseInt(huoltoid) + 1;
    console.log(huolto_id);

    if (huolto === 'Hankinta') {
        console.log(
            'itemService, Hankinta if, Next to insert huoltorekisteri and fill hankinnat'
        );
        await client.connect();
        await client.queryArray(
            'INSERT INTO huoltorekisteri (huolto_id, valine, huolto, tehty, huomio) VALUES($1, $2, $3, $4, $5)',
            huolto_id,
            tyyppi,
            huolto,
            huoltopvm,
            huomiot
        );
        await client.end();

        await client.connect();
        await client.queryArray(
            'INSERT INTO hankinnat (huolto_id, osa, kulu) VALUES($1, $2, $3)',
            huolto_id,
            osa,
            kulu
        );
        await client.end();
    } else {
        console.log('Ei hankinta, täytetään huoltorekisteri');
        await client.connect();
        await client.queryArray(
            'INSERT INTO huoltorekisteri (huolto_id, valine, huolto, hetki, paikka, tehty, huomio) VALUES($1, $2, $3, $4, $5, $6, $7)',
            huolto_id,
            tyyppi,
            huolto,
            hetki,
            sijainti,
            huoltopvm,
            huomiot
        );
        await client.end();
    }
    console.log('insert executed');
    //await huolot();
};

const huolot = async () => {
    console.log('Huoltojen haku');
    await client.connect();
    const res = await client.queryArray(
        'SELECT * FROM huoltorekisteri ORDER BY huolto_id DESC'
    );
    await client.end();
    console.log('Huolot -> ' + res.rows);
    return res.rows;
};

const haeSumma = async () => {
    await client.connect();
    const resp = await client.queryArray(
        'SELECT huoltorekisteri.valine, SUM(hankinnat.kulu) FROM huoltorekisteri JOIN hankinnat ON huoltorekisteri.huolto_id = hankinnat.huolto_id GROUP BY valine'
    );
    await client.end();
    console.log('haeSummat res paluttu: ', resp.rows);
    return resp.rows;
};

const haeHankinnat = async () => {
    console.log('Hankintojen haku');
    await client.connect();
    const res = await client.queryArray(
        "SELECT huoltorekisteri.valine, hankinnat.osa, hankinnat.kulu, huoltorekisteri.tehty FROM huoltorekisteri LEFT JOIN hankinnat ON hankinnat.huolto_id = huoltorekisteri.huolto_id WHERE huoltorekisteri.huolto = 'Hankinta'"
    );
    await client.end();
    console.log('Hankinnat: ', res.rows);
    return res.rows;
};

export { tarkistaHuoltoId, huoltoKantaan, huolot, haeHankinnat, haeSumma };
