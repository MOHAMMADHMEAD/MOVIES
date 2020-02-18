import { Server } from "hapi";
import Routs from "./routs"
import config from "./config";
import mongoose from 'mongoose';
import Hapi   from '@hapi/hapi';
import {generateData} from "./Models/Movie/Controller"

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});
const init = async () => {
    mongoose.connect(config.db, async (err) => {
            if (err) {
                console.log(`[MongoDB] Failed to connect. ${err}`);
            } else {
                console.log(`[MongoDB] connected: ${config.db}`);
                await server.start();
                console.log('Server running on %s', server.info.uri);
                generateData();
                // initialize api
                server.route(Routs);
            }
        }
    );
};

init();

module.exports = {server:server};
