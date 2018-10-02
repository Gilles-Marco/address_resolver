function determineClass(firstAdressByte){
    /* Prend en parametre le premier octet d'une adresse */
    var classe;
    switch(true){
            case firstAdressByte<127:
                classe = 'A';
                break;
            case firstAdressByte<192:
                classe = 'B';
                break;
            case firstAdressByte<224:
                classe = 'C';
                break;
            case firstAdressByte<240:
                classe = 'D';
                break;
            default:
                classe ="E";
                break;
        }

    return classe;
}

function convertAdressToBit(adressSplitInArray){
    /* Prend une adresse splitée au niveau des points */
    var adress_bit = "";
    var byteBinary = "";
    var bufferBin = "";
    for(let i=0;i<4;i++){
        byteBinary = "";
        bufferBin = "";
        byteBinary += parseInt(adressSplitInArray[i]).toString(2);
        if(byteBinary.length<8){
            for(let j=0;j<8-byteBinary.length;j++) bufferBin+="0";
            byteBinary = bufferBin.concat("", byteBinary);
        }
        adress_bit += " "+byteBinary;
    }
    return adress_bit;
}

function bitAdressToDecimal(bitAdress){
    /*Prend une adresse en binaire et la retourne sous forme d'une adresse décimal */
    var adress = "";
    var octet = "";
    
    while(bitAdress.length!=0){
        octet ="";
        let sizeToTake = bitAdress.length-8;
        if(sizeToTake>8) sizeToTake = 8;
        if(sizeToTake<=0) sizeToTake += 8;

        for(let i=0;i<sizeToTake;i++) octet += bitAdress.charAt(i);
        bitAdress = bitAdress.slice(sizeToTake, bitAdress.length);

        adress += parseInt(octet, 2);
        adress += ".";
    }

    //Supprime le dernier point
    adress = adress.slice(0, adress.length-1);
    return adress;
}

function classToNetworkAdress(adressSplitInArray, adressClass){
    var networkAdress;

    if(adressClass=="A"){
        networkAdress = adressSplitInArray[0]+".0.0.0";
    }
    else if(adressClass=="B"){
        networkAdress = adressSplitInArray[0]+"."+adressSplitInArray[1]+".0.0";
    }
    else if(adressClass=="C"){
        networkAdress = adressSplitInArray[0]+"."+adressSplitInArray[1]+"."+adressSplitInArray[2]+".0";
    }
    else{
        //Classe D et E
        networkAdress = adressSplitInArray;
    }

    return networkAdress;
}

function classToBroadcastAdress(adressSplitInArray, adressClass){
    var broadcastAdress = "";

    if(adressClass=="A"){
        broadcastAdress = adressSplitInArray[0]+".255.255.255";
    }
    else if(adressClass=="B"){
        broadcastAdress = adressSplitInArray[0]+"."+adressSplitInArray[1]+".255.255";
    }
    else if(adressClass=="C"){
        broadcastAdress = adressSplitInArray[0]+"."+adressSplitInArray[1]+"."+adressSplitInArray[2]+".255";
    }
    else{
        //Classe D et E
        broadcastAdress = adressSplitInArray;
    }

    return broadcastAdress;
}

function bitAdressToNetworkAdress(adressInBit, netIdLength){
    var networkAdress ="";
    var nb_point = 0;
    var netIdBuffer = netIdLength;
    while(netIdBuffer%4!=0){
            netIdBuffer++;
    }
    for(let i=0;i<netIdBuffer;i++){
        if(i<=netIdLength){
            networkAdress += adressInBit.charAt(i);
        }
        else{
            networkAdress += "0";
        }
    }
    //Complete les 32 bits 
    while(networkAdress.length != 32){
        networkAdress += "0";
    }
    //Conversion de l'adresse binaire en adresse decimal
    networkAdress = bitAdressToDecimal(networkAdress);

    return networkAdress;
}

function bitAdressToBroadcastAdress(adressInBit, netIdLength){
    var broadcastAdress = "";
    
    for(let i=0;i<netIdLength;i++){
        broadcastAdress += adressInBit.charAt(i);
    }

    while(broadcastAdress.length!=32){
        broadcastAdress += "1";
    }

    broadcastAdress = bitAdressToDecimal(broadcastAdress);

    return broadcastAdress;
}

function classToMask(adressClass){
    var masque;

    if(adressClass=="A") masque ="255.0.0.0";
    else if(adressClass=="B") masque = "255.255.0.0";
    else if(adressClass=="C") masque = "255.255.255.0";
    else masque = "255.255.255.255";
    
    return masque
}

function netIdToMask(netIdLength){
    var masque;
    var bitMask = "";

    for(let i=0;i<netIdLength;i++) bitMask += "1";
    while(bitMask.length!=32) bitMask += "0";
    masque = bitAdressToDecimal(bitMask);

    return masque;
}

function netIdToClass(networkAdress,netIdLength){
    var classe;
    var bufferFirstByte = "";
    var networkAdressInBit = convertAdressToBit(networkAdress.split('.'));
    while(bufferFirstByte<netIdLength && bufferFirstByte.length<8) bufferFirstByte+=networkAdressInBit.charAt(bufferFirstByte.length);
    var firstByte = bitAdressToDecimal(bufferFirstByte);
    classe = determineClass(firstByte);
    return classe;
}

function calculatePlageOne(networkAdress){
    var adresse;
    var bufferAdress = networkAdress.split(".");
    var bufferLastByte = bufferAdress[3]+1;
    var adresse = bufferAdress[0]+"."+bufferAdress[1]+"."+bufferAdress[2]+"."+bufferLastByte;
    return adresse;
}

function calculatePlageTwo(broadcastAdress){
    var adresse;
    var bufferAdress = broadcastAdress.split(".");
    var bufferLastByte = bufferAdress[3]-1;
    var adresse = bufferAdress[0]+"."+bufferAdress[1]+"."+bufferAdress[2]+"."+bufferLastByte;
    return adresse;
}

function classToNetId(classe){
    var net_id;
    if(classe=="A") net_id=24;
    if(classe=="B") net_id=16;
    if(classe=="C") net_id=8;
    if(classe=="D" || classe=="E") net_id=0;

    return net_id; 
}

function resolveAdress(givenAdresse){
    var adresse = givenAdresse.split('/')[0];
    var net_id = givenAdresse.split('/')[1];

    if(net_id===undefined) net_id="";

    var classe;
    var adresse_reseau = "";
    var adresse_broadcast = "";
    var masque = "";
    var adresse_bit = "";
    var plage1 = "";
    var plage2 = "";

    var adresseBuffer = adresse.split(".");
    if(net_id == ""){
        console.log("Sans net-id "+adresse+" "+net_id);
        /* Pas de net id fournit on se fie au classe */
        classe = determineClass(adresseBuffer[0]);

        masque = classToMask(classe);
        net_id = classToNetId(classe);

        adresse_reseau = classToNetworkAdress(adresseBuffer, classe);
        adresse_broadcast = classToBroadcastAdress(adresseBuffer, classe);

        console.log("Adresse",adresse, "Adresse_Reseau", adresse_reseau,"Classe" ,classe,"Adresse_Broadcast" ,adresse_broadcast, "Masque", masque);
        adresse_bit = convertAdressToBit(adresseBuffer);
    }
    else{
        /* On a un net id */
        console.log("Avec net-id "+adresse+" "+net_id);
        //On convertit l'adresse en bit pour les futures opérations avec le net-id
        adresse_bit = convertAdressToBit(adresseBuffer);
        
        //On calcul l'adresse reseau à partir de cette adresse en bit et le net id
        adresse_reseau = bitAdressToNetworkAdress(adresse_bit, net_id);
        //On determine la classe de l'adresse via l'adresse reseau
        classe = netIdToClass(adresse_reseau, net_id);

        //On calcul l'adresse broadcast via l'adresse en bit et le net id
        adresse_broadcast = bitAdressToBroadcastAdress(adresse_bit, net_id);
        //On calcul le masque à partir de l'adresse en bit et du net id
        masque = netIdToMask(net_id);

        console.log("Adresse",adresse, "Adresse_Reseau", adresse_reseau,"Classe" ,classe,"Adresse_Broadcast" ,adresse_broadcast, "Masque", masque);
    }
    
    if(classe != 'E' || classe != "D"){
        plage1 = calculatePlageOne(adresse_reseau);
        plage2 = calculatePlageTwo(adresse_broadcast);
        
    }
    else{
        plage1 = adresse_reseau;
        plage2 = adresse_broadcast;
    }

    return {'adresse':adresse, 'net_id':net_id, 'classe':classe, 'adresse_reseau':adresse_reseau, 'adresse_broadcast':adresse_broadcast, 'masque':masque, 'adresse_bit':adresse_bit, 'plage1':plage1, 'plage2':plage2};
}

function sameNetwork(adresse1, adresse2){
    if(adresse1==adresse2) return true;
    return false;
}

document.getElementById('dump_button').onclick = function(){
    /* reset de l'affichage s'il y a eu une autre demande avant */
    document.getElementById('dump_area').innerHTML = "";

    var adresse = document.getElementById('dump_adress').value;
    if(adresse!=""){
        var adresse = adresse.split(',');
        var groupe = [];

        var color = ["Aqua", "Aquamarine", "Bisque", "Black", "Blue", "Brown", "BurlyWood", "BlueViolet", "Chocolate", "Chartreuse", "CadetBlue", "Coral", "CornflowerBlue", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGreen", "DarkKhaki", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DeepPink", "FireBrick", "Gold", "Green", "GreenYellow", "IndianRed", "LawnGreen", "LighGreen", "LightSalmon", "LightPink", "Maroon", "Magenta", "MediumSeaGreen", "MediumSlateBlue", "MediumTurquoise", "MidnightBlue", "Olive", "OliveDrab", "Orange", "PaleVioletRed", "Red", "Purple", "SandyBrown", "Sienna", "YellowGreen"];

        /* On nettoie les adresses des espaces */
        for(let i=0;i<adresse.length;i++){
            adresse[i] = adresse[i].replace(" ", "");
        }

        /*
            Calcul et groupe les adresses de même reseau ensemble
        */
        for(let i=0;i<adresse.length;i++){
            var result = resolveAdress(adresse[i]);
            var hasAGroup = false;
            for(let j=0;j<groupe.length;j++){
                if(groupe[j][0].adresse_reseau==result.adresse_reseau){
                    groupe[j].push(result);
                    hasAGroup = true;
                }
            }
            if(hasAGroup==false) groupe.push([result]);
        }
        /* 
            Affiche les resultats
        */

        for(let i=0;i<groupe.length;i++){
            let adresse_reseau = groupe[i][0].adresse_reseau;
            document.getElementById('dump_area').innerHTML += "<div class='groupe' id='groupe"+i+"'><h2><font color='"+color[i]+"'>"+adresse_reseau+"</font></h2><br/></div>";
            for(let j=0;j<groupe[i].length;j++){
                let adresse = `<h3 class="adresse">Adresse : ${groupe[i][j].adresse}</h3>`;
                let adresse_reseauBuf = `<label class="resultat">Adresse réseau : ${adresse_reseau}</label>`;
                let adresse_broadcast = `<label class="resultat">Adresse broadcast : ${groupe[i][j].adresse_broadcast}</label>`;
                let adresse_bit = `<label class="resultat">Adresse binaire : ${groupe[i][j].adresse_bit}</label>`;
                let masque = `<label class="resultat">Masque : ${groupe[i][j].masque}</label>`;
                let plage= `<label class="resultat">Plage d'adresses [${groupe[i][j].plage1};${groupe[i][j].plage2}]</label>`;
                let classe = `<label class="resultat">Classe : ${groupe[i][j].classe}</label>`;
                let net_id = `<label class="resultat">Net-id : ${groupe[i][j].net_id}</label>`;

                document.getElementById(`groupe${i}`).innerHTML += `${adresse}</br>${net_id}</br>${adresse_reseauBuf}</br>${adresse_broadcast}</br>${plage}</br>${masque}</br>${classe}</br>${adresse_bit}</br><br/>`;
            }
        }
    }
    
}
