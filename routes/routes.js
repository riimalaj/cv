import { Router } from '../deps.js';
import * as item from './controllers/itemController.js';

const router = new Router();

router.get('/', item.showMain);
router.get('/visitors', item.showVisitors)
router.get('/author', item.showImg)


export default router.routes();
