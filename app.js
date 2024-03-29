import { Application, send } from 'https://deno.land/x/oak/mod.ts';
import routes from './routes/routes.js';
import { configure } from './deps.js';
import { serve } from 'https://deno.land/std@0.113.0/http/server.ts';


configure({
    views: `${Deno.cwd()}/views/`,
});


const app = new Application();

//let port = 80;
if (Deno.args.length > 0) {
    const lastArgument = Deno.args[Deno.args.length - 1];
    port = Number(lastArgument);
}

app.use(routes);

//app.listen(`:${port}`);

export { app };
