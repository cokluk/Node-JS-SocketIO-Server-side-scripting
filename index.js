var io = require("socket.io")(process.env.PORT || 8443);

const redis = require("redis");  
 
 
const cli = redis.createClient();

const asyncRedis = require("async-redis");    
 
const client = asyncRedis.createClient(); 




console.log("Sunucu başlatıldı");

let date_ob = new Date();
 
let date = ("0" + date_ob.getDate()).slice(-2);
 
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
 
let year = date_ob.getFullYear();




var Player = require("./Modules/player.js");



io.on('connection', async function(socket) {

var player = new Player();
var sPlayerUid = player.id;
player.uids = await client.get("uids");

var val = await client.smembers("online_tr");
player.aktif = val;



 


socket.emit("spawn", player);
 

console.log("baglandi..");

socket.on("set_bilgi", async  function(veri) {

    exp = veri["lvl"];
    id = veri["id"];

 

    cli.set("uid:" + id  + ":exp",  exp);
    
    player.lvl = exp;

    socket.emit("set_bilgi", player);
});

socket.on("bilgi", async  function(veri) {
 

    let date_ob = new Date();
 
    let date = ("0" + date_ob.getDate()).slice(-2);
    
 
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    
   
    let year = date_ob.getFullYear();
    
    var cur_date = date + "/" + month + "/" + year;
    


    email = veri["email"];
    password = veri["password"];

    const value = await client.get("uids");
    const val = value * 2;
    var id = 0;
    
    for (var i = 1; i < val + 1; i++) {
        
        var s = "uid:"+ i +":mail";
        const v = await client.get(s);
 
        if(email == v){
            id = i;
 
            break;
        }
    }
 
    var pw = "uid:"+ id +":panelsifre";
    const pv = await client.get(pw);
    if(password == pv){
 
        player.uid = id;

        var aprs = "uid:" + player.uid  + ":appearance";
        if(aprs != null){
        cli.lrange(aprs, 0, -1, async function(err, reply) {
           
            var main = "uid:" + player.uid  + ":app_us";
            cli.set(main,  reply[0]);
         
        });
        }else {  await client.set("uid:" + player.uid  + ":app_us", "Avaturkey"); }
        var userx = "uid:" + player.uid  + ":app_us";
        player.username = await client.get("uid:" + player.uid  + ":app_us");
        player.gold = await client.get("uid:" + player.uid  + ":gld");
        player.avacoin = await client.get("uid:" + player.uid  + ":avacoin");
        if(player.avacoin == null){ player.avacoin = 30; await client.set("uid:" + player.uid  + ":avacoin", 30);}
        player.lvl = await client.get("uid:" + player.uid  + ":exp");
        player.sifre = await client.get("uid:" + player.uid  + ":panelsifre");
        player.rpt  = await client.get("uid:" + player.uid  + ":rpt");
        player.slvr  = await client.get("uid:" + player.uid  + ":slvr");
        player.p_sifre = await client.get("uid:" + player.uid  + ":panelsifre");
        var cid = await client.get("uid:" + player.uid  + ":clan");
        if(await client.get("clans:" + cid  + ":m:" + player.uid + ":role") != "3"){ cid = null; player.cid = null;  }else { player.cid = cid; }
        if(cid != null){

            player.clan_name = await client.get("clans:" + cid  + ":name");
            player.clan_tag = await client.get("clans:" + cid  + ":tag");
            player.clan_pin = await client.get("clans:" + cid  + ":pin");

        }else {
        
            player.clan_name = "YOK";
        }
        userdate = await client.get("uid:" + player.uid  + ":kutu");
        if(cur_date != userdate){ player.box_kazanc = "kazanc";  }else {player.box_kazanc = "hata";}
    }  
  


    
    socket.emit("bilgi", player);
     
});


socket.on("magaza", async  function(veri) {

    urun = veri["id"];

    var hata = 0;

    var coin = parseFloat(await client.get("uid:" + player.uid  + ":avacoin"));

     
    if(urun == "3"){ 
        if(coin > 5000){
        
        hata = 1;  
        
        coin = coin - 5000;
        await client.set("uid:" + player.uid  + ":avacoin", coin);

        

      }


}else if(urun == "7"){

    if(coin > 15000){
        
        hata = 1;  
        
        coin = coin - 15000;
        await client.set("uid:" + player.uid  + ":avacoin", coin);

        

      }

}else if(urun == "8"){


    if(coin > 20000){
        
        hata = 1;  
        
        coin = coin - 20000;
        await client.set("uid:" + player.uid  + ":avacoin", coin);
 
      }


} else  { 
    if(coin > 350){hata = 1;

    coin = coin - 350;
    await client.set("uid:" + player.uid  + ":avacoin", coin);
    } 
}

    



    if(hata == 1){
        
        player.mgz = urun; 

        if(urun == "1"){}
        if(urun == "2"){}
        if(urun == "3"){  
//PLUS PAKET 1
             await client.set("uid:" + player.uid  + ":plus", "1"); 
             await client.set("uid:" + player.uid  + ":plus_paket", "1"); 
             month = parseFloat(month);
             if(month == 12){  month = 1; }else {   month = month + 1; }
             var bitis_tarihi = date + "/" + month + "/" + year;
             await client.set("uid:" + player.uid  + ":plus_bitis", month); 
 
             month =  ("0" + (date_ob.getMonth() + 1)).slice(-2);
            
            }
        if(urun == "5"){ var hrt = parseFloat(await client.get("uid:" + player.uid  + ":ronfor" ));  hrt = hrt + 500000; await client.set("uid:" + player.uid  + ":ronfor", hrt);   }
        if(urun == "4"){  var crt = parseFloat(await client.get("uid:" + player.uid  + ":crt" ));  crt = crt + 100000; await client.set("uid:" + player.uid  + ":crt", crt);  }
        if(urun == "6"){ var act = parseFloat(await client.get("uid:" + player.uid  + ":act" ));  act = act + 100000; await client.set("uid:" + player.uid  + ":act", act);   }
        
        if(urun == "7"){
//PLUS PAKET 2

await client.set("uid:" + player.uid  + ":plus", "1"); 
await client.set("uid:" + player.uid  + ":plus_paket", "2"); 
 
month = parseFloat(month);
if(month == 12){  month = 1; }else {   month = month + 1; }
var bitis_tarihi = date + "/" + month + "/" + year;
await client.set("uid:" + player.uid  + ":plus_bitis", month); 

month =  ("0" + (date_ob.getMonth() + 1)).slice(-2);

 }

        if(urun == "8"){
//PLUS PAKET 3



await client.set("uid:" + player.uid  + ":plus", "1"); 
await client.set("uid:" + player.uid  + ":plus_paket", "3"); 
 
month = parseFloat(month);
if(month == 12){  month = 1; }else {   month = month + 1; }
var bitis_tarihi = date + "/" + month + "/" + year;
await client.set("uid:" + player.uid  + ":plus_bitis", month); 

month =  ("0" + (date_ob.getMonth() + 1)).slice(-2);


 }

    }else {player.mgz = "hata";}


    player.avacoin = await client.get("uid:" + player.uid  + ":avacoin");

    socket.emit("magaza", player);
});

socket.on("odul", async  function(veri) {

    tip = veri["tip"];

    var coin = parseFloat(await client.get("uid:" + player.uid  + ":avacoin"));
    
    player.odul = null;

    if(tip == "1"){ coin = coin + 60; player.odul = "1"; } 
    if(tip == "2"){ coin = coin + 30; player.odul = "2"; }

    player.avacoin = coin;

    await client.set("uid:" + player.uid  + ":avacoin", coin);
 
    socket.emit("odul", player);
});

socket.on("AC.GNDR", async  function(veri) {
	
	 gonderilen = veri["gonderilen"];
	 miktar = veri["miktar"];
	 
	 var uids = parseFloat(await client.get("uids"));
	 var gonderilen2 = parseFloat(gonderilen);
	 var coin = parseFloat(await client.get("uid:" + player.uid  + ":avacoin"));
	 var coin2 = parseFloat(miktar);
	 if(coin >= coin2){
		 
		 if(gonderilen < uids){
			 
			 var kar_s = parseFloat(await client.get("uid:" + gonderilen  + ":avacoin"));
			 kar_s = kar_s + coin2; 
			 await client.set("uid:" + gonderilen  + ":avacoin", kar_s);
			 var kar_s2 = parseFloat(await client.get("uid:" + player.uid  + ":avacoin"));
			 kar_s2 = kar_s2 - coin2;
			 await client.set("uid:" + player.uid  + ":avacoin", kar_s2);
			 await client.sadd("uid:" + player.uid  + ":ac_transfer", "Transfer eden -> " + player.uid + " Transfer edilen -> " + gonderilen + " Miktar ->" + miktar);
			 player.send = "AC.BSRL";
			 
		 }else { player.send = "AC.BSRZ";}
		 
		 
	 }else { player.send = "AC.BSRZ";}
	 
	 
	 socket.emit("AC.GNDR", player);
	
});


socket.on("promo", async  function(veri) {

    promo = veri["promokod"];

    player.promo_mesaj = "hata";

    hata = 0;

    cli.smembers('offer', async function(err, reply) {

         
        for (i = 0; i < reply.length; i++) {
            
            item = reply[i];
            index = i + 1;
  

            almis_mi = await client.get("uid:" + player.uid + ":promo:" + index);
 
            if(almis_mi == "1"){
                player.promo_mesaj = "hata";
                socket.emit("promo", player);
                break;
            }
            if(almis_mi == null) {

                await client.set("uid:" + player.uid + ":promo:" + index, "1");
                
             
                player.promo_mesaj = await client.get("promo:" + index + ":mesaj");
                tip = await client.get("promo:" + index + ":tip");
                miktar = await client.get("promo:" + index + ":miktar");

                cur = parseFloat(await client.get("uid:" + player.uid  + ":" + tip));

                cur = cur + miktar;
 
                await client.set("uid:" + player.uid  + ":" + tip, cur);

                socket.emit("promo", player);
                break;
            }
           
        }
 
    });


});


socket.on("kutu", async  function(veri) {



    let date_ob = new Date();
 
    let date = ("0" + date_ob.getDate()).slice(-2);
    
 
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    
 
    let year = date_ob.getFullYear();
    
    var cur_date = date + "/" + month + "/" + year;
    
 

oid = veri["oid"];
    if(await client.get("uid:" + player.uid + ":kutu") != cur_date){


        var kazanc = "toka";
        if(oid == "0"){ kazanc = parseFloat(await client.get("uid:" + player.uid + ":avacoin")); kazanc = kazanc + 50;  await client.set("uid:" + player.uid + ":avacoin", kazanc);}
        if(oid == "2"){ kazanc = parseFloat(await client.get("uid:" + player.uid + ":crt")); kazanc = kazanc + 100000;  await client.set("uid:" + player.uid + ":crt", kazanc);}
        if(oid == "3"){kazanc = parseFloat(await client.get("uid:" + player.uid + ":ronfor")); kazanc = kazanc + 500000;  await client.set("uid:" + player.uid + ":ronfor", kazanc);}
        if(oid == "4"){kazanc = parseFloat(await client.get("uid:" + player.uid + ":act")); kazanc = kazanc + 10000;  await client.set("uid:" + player.uid + ":act", kazanc);}
        if(oid == "5"){kazanc = parseFloat(await client.get("uid:" + player.uid + ":act")); kazanc = kazanc + 10000;  await client.set("uid:" + player.uid + ":act", kazanc);}
        if(oid == "6"){ kazanc = "toka";}
        if(oid == "7"){kazanc = parseFloat(await client.get("uid:" + player.uid + ":snowscore")); kazanc = kazanc + 1000;  await client.set("uid:" + player.uid + ":snowscore", kazanc);}

        player.box = kazanc;
        await client.set("uid:" + player.uid + ":kutu", cur_date);
    }else{

        player.box = "hata";

    }
 
    userdate = await client.get("uid:" + player.uid  + ":kutu");
    if(cur_date != userdate){ player.box_kazanc = "kazanc";  }else {player.box_kazanc = "hata";}
    socket.emit("kutu", player);
});

socket.on("itibar", async  function(veri) {
 
    puan = veri["puan"];
    if(puan == null){ player.send = "hata"; } else { player.rpt = puan;  await client.set("uid:" + player.uid  + ":rpt", puan); }
    socket.emit("itibar", player);
});


socket.on("hesap", async  function(veri) {
 
    


    cad = veri["cad"];
    ctag = veri["ctag"];
    nik = veri["nik"]; 
 
    player.clan_tag = cad;
    player.clan_tag = ctag;
    player.username = nik;

    var cid = await client.get("uid:" + player.uid  + ":clan");
    if(await client.get("clans:" + cid  + ":m:" + player.uid + ":role") != "3"){ 
        
      }else {
      
        await client.set("clans:" + player.cid  + ":name", cad);
        await client.set("clans:" + player.cid  + ":tag", ctag);
        
   }
   
  // cli.lrange("uid:" + player.uid  + ":appearance", 0, nik, async function(err, reply) { console.log(reply); });
 
    socket.emit("hesap", player);
 
});



socket.on("gorev", async  function(veri) {

    player.duello = await client.get("uid:" + player.uid + ":duello");
    player.tokalas = await client.get("uid:" + player.uid + ":tokalas");
    player.tekme = await client.get("uid:" + player.uid + ":tekme");
    player.saril = await client.get("uid:" + player.uid + ":saril");
 

    if(player.duello == null){player.duello = 0;}
    if(player.tokalas == null){player.tokalas = 0;}
    if(player.tekme == null){player.tekme = 0;}
    if(player.saril == null){player.saril = 0;}
 



 if(player.duello >= 10){
    player.duello = 0;  
    ac = await client.get("uid:" + player.uid + ":avacoin");
    ac = ac + 150;
    await client.set("uid:" + player.uid + ":avacoin", ac);
    await client.set("uid:" + player.uid + ":duello", 0);
}
   
if(player.tokalas >= 200){
    player.tokalas = 0;  
    ac = await client.get("uid:" + player.uid + ":avacoin");
    ac = ac + 250;
    await client.set("uid:" + player.uid + ":avacoin", ac);
    await client.set("uid:" + player.uid + ":tokalas", 0);
}

if(player.tekme >= 200){
    player.tekme = 0;  
    ac = await client.get("uid:" + player.uid + ":avacoin");
    ac = ac + 250;
    await client.set("uid:" + player.uid + ":avacoin", ac);
    await client.set("uid:" + player.uid + ":tekme", 0);
}

if(player.saril >= 200){
    player.saril = 0;  
    ac = await client.get("uid:" + player.uid + ":avacoin");
    ac = ac + 250;
    await client.set("uid:" + player.uid + ":avacoin", ac);
    await client.set("uid:" + player.uid + ":saril", 0);
}

    socket.emit("gorev", player);

});



socket.on("disconnect", function(){
    console.log("Sunucu bağlantısnı kopardı.");
    socket.broadcast.emit("disconnected", player);
  });


}); 