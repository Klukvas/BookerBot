import App from "./core/server"
import moment from "moment";
moment.tz.setDefault('UTC');


const app = new App()
app.listen()