const canvas = document.getElementById("igraCanvas");
const ctx = canvas.getContext("2d");

let traje = true;
let gameOver = false;
let igraPocela = false;
let pauzirano = false;

let score = 0;
let stitiTajmer = 0;

// dodatna funkcionalnost timer prezivljavanja
let vrijemePocetka = 0;
let ukupnoPauziranoVrijeme = 0;
let pocetakPauze = 0;
let vrijemeKraja = 0;


// dodatna funkcionalnost nickname i izbor boje
let nickname = "Igrac";

let tema = "SVIJETLA";

const temaBtn = document.getElementById("temaBtn");
temaBtn.textContent = (tema == "SVIJETLA") ? "TAMNA" : "SVIJETLA";
temaBtn.addEventListener("click", () => {
  tema = (tema == "SVIJETLA") ? "TAMNA" : "SVIJETLA";
  temaBtn.textContent = (tema == "SVIJETLA") ? "TAMNA" : "SVIJETLA";
  primijeniTemu();
});

// dodatna funkcionalnost za dark/light temu
function primijeniTemu(){
  if(tema === "TAMNA"){
    document.body.style.backgroundColor = "#0E213F";
    document.body.style.color = "#F7F2E8";
  }else{
    document.body.style.backgroundColor = "#fae4c2";
    document.body.style.color = "#0E213F";
  }
}

const dugme = {
  x: 0,
  y: 0,
  w: 220,
  h: 55
};

//dodatna funkcionalnost pause dugme
const pauseDugme = {
  x : 0,
  y : 15,
  w: 90,
  h: 35,
}
function klikNaPause(mx, my){
  return mx >= pauseDugme.x &&  mx <= pauseDugme.x + pauseDugme.w && my >= pauseDugme.y && my <= pauseDugme.y + pauseDugme.h;
}

function klikNaDugme(mx, my){
  return mx >= dugme.x && mx <= dugme.x + dugme.w && my >= dugme.y && my <= dugme.y + dugme.h;
}

const igrac = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  r: 10,
  boja: "red",
  brzina: 4
};

function nacrtajKrug(x, y, r){
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2);
  ctx.fill();
  ctx.strokeStyle = "royalblue";
  ctx.lineWidth = 2;
  ctx.stroke();
}

const mis = {
  x: canvas.width / 2,
  y: canvas.height / 2
};
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mis.x = e.clientX - rect.left;
  mis.y = e.clientY - rect.top;
});

const krugovi = [];

function rand(min, max){
  return Math.random()*(max - min) + min;
}

function napraviKrug(){
  const minR = 6;
  const maxR = Math.max(28, igrac.r * 1.4); 
  const r = rand(minR, maxR);

  const x = rand(r, canvas.width - r);
  const y = rand(r, canvas.height - r);

  let vx = rand(-2, 2);
  let vy = rand(-2, 2);

  if (Math.abs(vx) < 0.4) vx = vx < 0 ? -0.8 : 0.8;
  if (Math.abs(vy) < 0.4) vy = vy < 0 ? -0.8 : 0.8;

  const boja = "rgb(" + Math.floor(rand(50, 255)) + ", " + Math.floor(rand(50, 255)) + ", " + Math.floor(rand(50, 255)) + ")";

  return{ x, y, r, vx, vy, boja};
}
for (let i=0; i<18; i++){
  krugovi.push(napraviKrug());
}

function provjeriGraniceIgraca(krug){
  if (krug.x < krug.r) krug.x = krug.r;
  if (krug.x > canvas.width - krug.r) krug.x = canvas.width - krug.r;
  if (krug.y < krug.r) krug.y = krug.r;
  if (krug.y > canvas.height - krug.r) krug.y = canvas.height - krug.r;
}
function odbijKrugove(krug){
  if(krug.x - krug.r < 0){
    krug.x = krug.r;
    krug.vx *= -1;
  }
  if (krug.x + krug.r> canvas.width){
    krug.x = canvas.width - krug.r;
    krug.vx *= -1;
  }
  if (krug.y - krug.r < 0) {
    krug.y = krug.r;
    krug.vy *= -1;
  }
  if (krug.y + krug.r > canvas.height) {
    krug.y = canvas.height - krug.r;
    krug.vy *= -1;
  }
}
function sudarKrugova(a, b){
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dist = Math.hypot(dx, dy);
  return dist < a.r + b.r;
}
function imaJestivih(){
  return krugovi.some(k => k.r < igrac.r);
}
function updateuj(){
  if(!igraPocela || gameOver || pauzirano) return;
  let dx = mis.x - igrac.x;
  let dy = mis.y - igrac.y;
  let dist = Math.hypot(dx, dy);
  if (dist >= 2) {
  let dirX = dx / dist;
  let dirY = dy / dist;
  igrac.x += dirX * igrac.brzina;
  igrac.y += dirY * igrac.brzina;
  }

 provjeriGraniceIgraca(igrac);

  for(const k of krugovi){
    k.x += k.vx;
    k.y += k.vy;
    odbijKrugove(k);
  }
  for(let i = krugovi.length-1; i >= 0; i--){
    const k = krugovi[i];

    if(sudarKrugova(igrac, k)){
      if(performance.now() < stitiTajmer){
          k.x = rand(k.r, canvas.width - k.r);
          k.y = rand(k.r, canvas.height - k.r);
          continue;
        }else{
      if(igrac.r >= k.r){
        krugovi.splice(i, 1);
        igrac.r += 1;
        score += 1;
        krugovi.push(napraviKrug());
      }else{
          gameOver = true;
          vrijemeKraja = performance.now();
        }
      }
    }
  }
  if(!imaJestivih()){
    const jestiviKrug = napraviKrug();
    jestiviKrug.r = Math.max(4, igrac.r*0.6);

    jestiviKrug.x = rand(jestiviKrug.r, canvas.width -  jestiviKrug.r);
    jestiviKrug.y = rand(jestiviKrug.r, canvas.height - jestiviKrug.r);
    
    const idx = Math.floor(rand(0, krugovi.length));
    krugovi[idx] = jestiviKrug;
  }

}


function crtaj(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = (tema == "TAMNA") ? "#325ca0" : "#F7F2E8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
     for(const k of krugovi){
      ctx.fillStyle = k.boja;
      nacrtajKrug(k.x, k.y, k.r);
    }
    ctx.fillStyle = igrac.boja;
    nacrtajKrug(igrac.x, igrac.y, igrac.r);
    ctx.font = "14px Arial";
    ctx.fillStyle = "#2e579a";
    ctx.textAlign = "center";
    ctx.fillText(nickname, igrac.x, igrac.y - igrac.r - 8);
    ctx.textAlign = "start";
    ctx.fillStyle = "black";
    ctx.font = "12px Audiowide";
    ctx.fillText("VELICINA: " + igrac.r, 10, 20);
    ctx.font = "12px Audiowide";
    ctx.fillText("SCORE: " + score, 10, 40);
    
    let sada = gameOver ? vrijemeKraja : performance.now();
    let proteklo = 0;
    if(igraPocela){
      if(pauzirano){
        proteklo = pocetakPauze - vrijemePocetka - ukupnoPauziranoVrijeme;
      }else{
        proteklo = sada - vrijemePocetka - ukupnoPauziranoVrijeme;
      }
    }
    const sek = Math.max(0, Math.floor(proteklo/1000));
    ctx.fillStyle = (tema == "TAMNA") ? "#f7f2e8" : "#0e213f";
    ctx.font = "12px Audiowide";
    ctx.fillText("VRIJEME: " + sek + "s", 10, 60);
  
    if(!igraPocela || gameOver){
      ctx.fillStyle = "rgba(18, 41, 78, 0.35)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      dugme.x = canvas.width/2 - dugme.w/2;
      dugme.y = canvas.height/2 - dugme.h/2 + 10;

      ctx.fillStyle = "#F4BF98";
      ctx.fillRect(dugme.x, dugme.y, dugme.w, dugme.h);
      ctx.strokeStyle = "#BC8764";
      ctx.lineWidth = 2;
      ctx.strokeRect(dugme.x, dugme.y, dugme.w, dugme.h);

      ctx.textAlign = "center";
      ctx.fillStyle = "#0E213F";
      ctx.font = "24px Audiowide";
      ctx.fillText(!igraPocela ? "START" : "RESTART", canvas.width/2, dugme.y + 36);
      ctx.font = "20px Audiowide";
      ctx.fillText(!igraPocela ? "Klikni START za početak igre" : "GAME OVER. Klikni RESTART za novu igru", canvas.width/2, dugme.y + 85);
      
      if(gameOver){
        const prezivljeno = Math.max(
          0,
          Math.floor((vrijemeKraja - vrijemePocetka - ukupnoPauziranoVrijeme) /1000)
        );
        ctx.fillStyle = "#edeff1";
        ctx.font = "22px Audiowide";
        ctx.textAlign = "center";
        ctx.fillText(
          "Preživjeli ste: " + prezivljeno + "s",
          canvas.width / 2,
          canvas.height / 2 + 90
        );
      }

      ctx.textAlign = "start";
      proteklo = 0;
    }
    if(igraPocela && !gameOver){
      pauseDugme.x = canvas.width - pauseDugme.w -10;
      ctx.fillStyle = "#F4BF98";
      ctx.fillRect(pauseDugme.x, pauseDugme.y, pauseDugme.w, pauseDugme.h);

      ctx.strokeStyle = "#BC8764";
      ctx.lineWidth = 2;
      ctx.strokeRect(pauseDugme.x, pauseDugme.y, pauseDugme.w, pauseDugme.h);

      ctx.fillStyle = (tema === "TAMNA") ? "#F7F2E8" : "#0E213F";
      ctx.font = "14px Audiowide";
      ctx.textAlign = "center";
      
      ctx.fillText(pauzirano ? "NASTAVI" : "PAUZIRAJ", 
        pauseDugme.x + pauseDugme.w / 2, 
        pauseDugme.y + 23
      );
      ctx.textAlign = "start";
    }
    if(pauzirano){
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0E213F";
      ctx.font = "36px Audiowide";
      ctx.textAlign = "center";
      ctx.fillText("PAUZIRANO", canvas.width/2, canvas.height/2);
      ctx.textAlign = "start";
    }

  }
canvas.addEventListener("click", function(e){
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  if(igraPocela && !gameOver && klikNaPause(mx, my)){
    if(!pauzirano){
      pauzirano = true;
      pocetakPauze = performance.now();
    }else{
      pauzirano = false;
      ukupnoPauziranoVrijeme += performance.now() - pocetakPauze;
      pocetakPauze = 0;
    }
    return;
  }
  if(!klikNaDugme(mx, my)) return;

  if(!igraPocela){
    const nickEl = document.getElementById("nickInput");
    const bojaEl = document.getElementById("bojaInput");
    const uputaEl = document.getElementById("uputa");

    nickname = nickEl.value || "Igrac";
    igrac.boja = bojaEl.value || igrac.boja;

    vrijemePocetka = performance.now();
    ukupnoPauziranoVrijeme = 0;
    pocetakPauze = 0;

    nickEl.style.display = "none";
    bojaEl.style.display = "none";
    uputaEl.style.display = "none";
    
    igraPocela = true;
    restart();
    return;
  }
  if(gameOver){
    vrijemePocetka = performance.now();
    ukupnoPauziranoVrijeme = 0;
    pocetakPauze = 0;
    restart();
  }


});
function restart(){
  gameOver = false;
  pauzirano = false;
  score = 0;
  vrijemeKraja = 0;
  stitiTajmer = performance.now() + 600;
  igrac.x = canvas.width / 2;
  igrac.y = canvas.height / 2;
  igrac.r = 10;
  
  krugovi.length = 0;
  for (let i=0; i<18; i++){
    krugovi.push(napraviKrug());
  }
}
function igraLoop(){
  if(!traje) return;

  updateuj();
  crtaj();
  requestAnimationFrame(igraLoop);
}
igraLoop();
