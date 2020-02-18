import MoviesRouts from './Models/Movie/Routs'
import ActorsRouts from './Models/Actor/Routs'
import DirectorsRouts from './Models/Director/Routs'
import HelperRouts from "./HelperRouts"

function combindRouts() {
    return MoviesRouts
        .concat(ActorsRouts).concat(HelperRouts).concat(DirectorsRouts)
}

export default combindRouts();
