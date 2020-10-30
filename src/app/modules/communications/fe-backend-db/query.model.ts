import { UserProfile,logStat} from "../fe-backend-db/membership/user.model";

class queryManager{
    genQuery(req : string, stat : logStat){
        switch (stat) {
            case (logStat.email):{
                return "email" + req;
            }

            case(logStat.google):{
                return "googlee" +  req;
            }
        }
    }
}