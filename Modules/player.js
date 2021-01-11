var shortid = require("shortid");

module.exports = class Player  {

    constructor(){
        this.username = "";
        this.id = shortid.generate();
        this.uid = "";
        this.uids = "";
        this.aktif = "";
        this.gold  = "";
        this.avacoin = "";
        this.lvl = "";
        this.sifre = "";
        this.rpt = "";
        this.slvr = "";
        this.mgz = "";
        this.odul = "";
        this.promo_mesaj = "";
        this.box = "";
        this.box_kazanc = "";
        this.send = "";


        //CLAN
        this.clan_name = "";
        this.clan_tag = "";
        this.p_sifre = "";
        this.clan_role = "";
        this.clan_pin = "";

        //GOREV
        this.duello = "";
        this.tokalas = "";
        this.tekme = "";
        this.saril = "";

    }

 

}

