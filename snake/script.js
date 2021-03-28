var CTX = null; 
var vibora = {
	longitud: 1,
	direccion: "d",
	ultimaDireccion: "d",
	murio: true,
	posF : [1],
	posC : [1],
	dibujar : function(){
		var i, l=this.longitud;
		for(i = 0; i < l; i++)
			cuadro(this.posC[i], this.posF[i], "#3498db");
	},
	mover : function(){
		var i, l = this.longitud;
		var ultF = this.posF[l-1];
		var ultC = this.posC[l-1];
		for(i = l-1; i > 0; i--){
			this.posF[i]=this.posF[i-1];
			this.posC[i]=this.posC[i-1];
		}
		if(this.direccion=="d"){//der
			this.posC[0] = this.posC[0] + 1;
			if(this.posC[0]==26) this.posC[0]=1;
		}else if(this.direccion=="a"){
			this.posC[0] = this.posC[0] - 1;
			if(this.posC[0]==0)this.posC[0]=25;
		}else if(this.direccion=="w"){
			this.posF[0] = this.posF[0] - 1;
			if(this.posF[0]==0)this.posF[0]=25;
		}else if(this.direccion=="s"){
			this.posF[0] = this.posF[0] + 1;
			if(this.posF[0]==26)this.posF[0]=1;
		}
		for(i=1;i<l;i++){
			if(this.posF[i]==this.posF[0] && this.posC[i]==this.posC[0]){
				this.murio=true;
				break;
			}
		}
		if(this.posF[0]==comida.posF && this.posC[0]==comida.posC){
			comida.seComio = true;
			this.longitud += 1;
			this.posF.push(ultF);
			this.posC.push(ultC);
			document.getElementById("gameInfo").innerHTML = "Length = " + this.longitud;						
		}
	},
	changeDir: function(key) {
		if(key == 37 && this.ultimaDireccion != 'd')
			this.direccion = 'a';
		if(key == 38 && this.ultimaDireccion != 's')
			this.direccion = 'w';
		if(key == 39 && this.ultimaDireccion != 'a')
			this.direccion = 'd';
		if(key == 40 && this.ultimaDireccion != 'w')
			this.direccion = 's';
	}
}
var comida = {
	seComio: true,
	posF : -1,
	posC : -1,
	dibujar : function(){
		cuadro(this.posC, this.posF, "#e74c3c");
	},
	cambiarPosicion : function(){
		var aux = true, i;
		while(aux){
			this.posF = 1 + Math.floor(Math.random()*25);
			this.posC = 1 + Math.floor(Math.random()*25);
			aux = false;
			for(i=0; i<vibora.longitud; i++)
				if(vibora.posF[i]==this.posF && vibora.posC[i]==this.posC){
					aux = true;
					break;
				}
		}
	}
}
var lapse;
function actualizar(){
	vibora.mover();
	if(comida.seComio){
		comida.cambiarPosicion();
		comida.seComio = false;
	}
	vaciarPantalla();
	comida.dibujar();
	vibora.dibujar();
	if(vibora.murio==false){
		lapse = -1.5 * vibora.longitud + 120; if(lapse < 30) lapse = 30;
		setTimeout(actualizar,lapse);
	}else{
		document.getElementById("gameInfo").innerHTML = "Length = " + vibora.longitud + " | GAME OVER | Press restart!";
		$("#iniciar").show();
	}
	vibora.ultimaDireccion = vibora.direccion;
}

function iniciar(){
	document.getElementById("iniciar").innerHTML = "Restart";
	$("#iniciar").hide();
	vibora.longitud = 1;
	vibora.posF = [1];
	vibora.posC = [1];
	vibora.murio = false;
	comida.posF = comida.posC = -1;
	comida.seComio = true;
	document.getElementById("gameInfo").innerHTML = "Length = " + vibora.longitud;
	vibora.dibujar();
	actualizar();
}

function vaciarPantalla() {
	var l = 500;
	CTX.fillStyle = "#273746";
	CTX.fillRect(0, 0, l, l);
}

function preparar() {
	CTX = document.getElementById("area").getContext("2d")
	vaciarPantalla();
}

function cuadro(x, y, color) {
	var l = 20;
	CTX.fillStyle = color;
	CTX.fillRect(l*(x-1) + 1, l*(y-1) + 1, l-2, l-2);
}

$(document).ready(function() {
	$(document).keydown((ev) => {
		if([37, 38, 39, 40].indexOf(ev.keyCode) > -1) {
			ev.preventDefault(); // prevent scrolling
			vibora.changeDir(ev.keyCode);
		}
	});

	preparar();
});
