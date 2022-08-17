
'use strict'

let isBrowser = typeof window !== 'undefined'
    && ({}).toString.call(window) === '[object Window]';

let isNode = typeof global !== "undefined" 
    && ({}).toString.call(global) === '[object global]';



if (isNode) {
  console.log('node');
  var ethers = require('ethers');
}

function loadScript(url, callback) {
  let body = document.body;
  let script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;

  script.onreadystatechange = callback;
  script.onload = callback;
  script.async = false;

  body.appendChild(script);
}


let isScriptLoaded = 0;
function loadScriptDone() {
	isScriptLoaded += 1;
}

const SCRIPTS = [
  "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js",
	"https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js",
	"https://cdn.jsdelivr.net/npm/rangeslider.js@2.3.3/dist/rangeslider.min.js",
	"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js",
  "https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js",
  "https://cdn.jsdelivr.net/gh/upfinity-main/TheWeb3ProjectAssets/js/web3.min.js",
  "https://cdn.jsdelivr.net/gh/upfinity-main/TheWeb3ProjectAssets/js/detect-provider.min.js",
  "https://cdn.jsdelivr.net/gh/upfinity-main/TheWeb3ProjectAssets/js/ethers.umd.min.js",
];

// for (const script of SCRIPTS) {
// 	loadScript(script, loadScriptDone);
// } 

/////////////////////////////////////////////////////////// consts

const BNBDIV = 10**18;
const CHAINID = 2000;
const UINT256MAX = 2**256 - 1;

const ZEROADR = "0x0000000000000000000000000000000000000000";
const DEADADR = "0x000000000000000000000000000000000000dEaD";

let RPCS = [
  "https://rpc01-sg.dogechain.dog",
  "https://rpc02-sg.dogechain.dog",
  "https://rpc03-sg.dogechain.dog",
];
let PROVIDER;
if (isBrowser) {
  if (window.ethereum) {
    PROVIDER = new ethers.providers.Web3Provider(window.ethereum);
    (async function () {
      let network = await PROVIDER.getNetwork();
      if (network['chainId'] != CHAINID) {
        alert('Network is not DogeChain. Requesting to change network');
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: "0x38",
            rpcUrls: [RPCS[1]],
          }],
        });
      }
    })();
    
  }
}

if (typeof PROVIDER === 'undefined') {
  PROVIDER = new ethers.providers.JsonRpcProvider(RPCS[1], {name: 'dogechain', 'chainId': 2000});
}

const SIGNER = PROVIDER.getSigner();


const ADRS = {};
const ABIS = {};

ADRS['web3'] = "0x333FD139cAeF6Aa31056cC905987b77B1044d259",
ABIS['web3'] = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint)",
  "function allowance(address, address) view returns (uint256)",

  "function approve(address, uint256) returns (bool)",
  "function transfer(address, uint)",

  "function manualRebase()",
  "function toggleExperi()",
  "function setPriceRate(uint)",

  "function _isExperi() view returns (bool)",
  
  "function setBotBlacklists(address[], bool[])",
  "function setLifeSupports(address[], uint[])",
  "function _curcuitBreakerFlag() view returns (uint256)",
  "function _curcuitBreakerTime() view returns (uint256)",



  "event Transfer(address indexed from, address indexed to, uint amount)",
  "event Rebased(uint256 blockNumber, uint256 totalSupply)",
];

ADRS['twep'] = "0x1AEb3f66d96bFaF74fCBD15Dc21798De36F6F933",
ABIS['twep'] = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint)",
  "function allowance(address, address) view returns (uint256)",

  "function approve(address, uint256) returns (bool)",
  "function transfer(address, uint)",

  "function manualRebase()",
  "function toggleExperi()",
  "function setPriceRate(uint)",

  "function _isExperi() view returns (bool)",
  "function _blacklisted(address) view returns (bool)",
	
  "function setBotBlacklists(address[], bool[])",
  "function setLifeSupports(address[], uint[])",
  "function _curcuitBreakerFlag() view returns (uint256)",
  "function _curcuitBreakerTime() view returns (uint256)",



  "event Transfer(address indexed from, address indexed to, uint amount)",
  "event Rebased(uint256 blockNumber, uint256 totalSupply)",
];


ADRS['wweb3'] = "0xE6664F3C20d503beAf78B5B4B059a388fbE9B75f";
ABIS['wweb3'] = [
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint)",
  "function allowance(address, address) view returns (uint256)",
  
  "function approve(address, uint256) returns (bool)",
  "function transfer(address, uint)",
  
  "function deposit(uint)",
  "function withdraw(uint)",
];

ADRS['pweb3'] = "0x877c8140a936ee49cA1DFBaFA58bE6AcB555e569";
ABIS['pweb3'] = [
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint)",
  "function allowance(address, address) view returns (uint256)",
  
  "function approve(address, uint256) returns (bool)",
  "function transfer(address, uint)",
];

ADRS['xweb3'] = "0x0f995Dc1200f03127502b853d9e18F50733df4E4";
ABIS['xweb3'] = [
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint)",
  "function allowance(address, address) view returns (uint256)",
  
  "function buyPay() payable",
  "function buy(address, uint)",
	"function claim()",
  "function _lastClaim(address) view returns (uint)",

  "function approve(address, uint256) returns (bool)",
  "function transfer(address, uint)",
];

ADRS['wusd'] = "0x0F42185278864e22e9b2Cc0bac43A17D5c7a6A16";
ABIS['wusd'] = [
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint)",
  "function allowance(address, address) view returns (uint256)",
  
  "function wusdToBusd(uint amount)",
  "function busdToWusd(uint amount)",
  


  "function approve(address, uint256) returns (bool)",
  "function transfer(address, uint)",

  "function getWusdPriceX10000() view returns (uint)",
  "function getSwapAmount(address, uint) view returns (uint)",
  "function swap(address, uint)",
];


ADRS['lock'] = "0xDEF348ebAff60614baF88E9AAAAC1FAaf2113601";
ABIS['lock'] = [
  "function stake(uint256, uint256)",
  "function unstake()",
  "function emergencyUnstake()",
  "function claimReward()",

  "function _amounts(address) view returns (uint256)",
  "function _durations(address) view returns (uint256)",
  "function _rewards(address) view returns (uint256)",
  "function _unlockTimes(address) view returns (uint256)",
  "function _lastClaims(address) view returns (uint256)",
  

  "function calculateReward(uint256, uint256) view returns (uint256)",

  "function stakeMulti(uint, uint256, uint256)",
  "function unstakeMulti(uint)",
  "function emergencyUnstakeMulti(uint)",
  "function claimRewardMulti(uint)",

  "function _amountsMulti(uint, address) view returns (uint256)",
  "function _durationsMulti(uint, address) view returns (uint256)",
  "function _rewardsMulti(uint, address) view returns (uint256)",
  "function _unlockTimesMulti(uint, address) view returns (uint256)",
  "function _lastClaimsMulti(uint, address) view returns (uint256)",
  

  "function _wusdStakedAmount(uint, address) view returns (uint256)",
  "function _wusdStakedTime(uint, address) view returns (uint256)",
  
  "function stakeWusd(uint, uint)",
  "function unstakeWusd(uint)",
  "function calWusdReward(uint, uint, uint) view returns (uint)",

  "function calculateRewardMulti(uint, uint256, uint256) view returns (uint256)"

];

ADRS['jackpot'] = "0x59E4a7C380e9AA63f24873EBD185D13B0ee76Dba";
ABIS['jackpot'] = [
  "function _lastBuyer() view returns (address)",
  "function _lastBuyTime() view returns (uint256)",
  "function _topBuyer() view returns (address)",

  "function _lastWinner() view returns (address)",
  "function _lastWinnerAmount() view returns (uint256)",
  "function _lastWinnerTime() view returns (uint256)",

  "function _topWinner() view returns (address)",
  "function _topWinnerAmount() view returns (uint256)",
  "function _topWinnerTime() view returns (uint256)",

  "function _dailyPrizeTime() view returns (uint256)",
  "function _dailyBuyAmounts(address) view returns (uint256)",
  
  "event Jackpot(uint256, address, uint256)",
];

ADRS['miner'] = "0x6f17D0DCc709Ee57b9d8bB9846Ad740032dB8661";
ABIS['miner'] = [
  "function Hire(address, address, uint)",
  "function HirePay(address) payable",
  "function HireMore(address)",
  "function Receive()",
	
  "function balanceOf(address) view returns (uint)",
  "function totalSupply() view returns (uint)",
  "function DAIMONDS_TO_HIRE_MINER() view returns (uint)",
  "function _lastHire(address) view returns (uint)",
  
  "function _amounts(address) view returns (uint256)",
  "function _returns(address) view returns (uint256)",
  "function _miners(address) view returns (uint256)",
  "function _daimonds(address) view returns (uint256)",
  "function _tDaimonds() view returns (uint256)",
	"function _investTimes(address) view returns (uint256)",
  "function getRateX10000(address) view returns (uint256)",
  "function calculateWusdRewards(address) view returns (uint256)",
  "function calculateWusdAmount(address, uint) view returns (uint256)",
  "function getMyDaimonds(address) view returns (uint256)",
  
];

ADRS['lottery'] = "0xBBB14B63B5011ADb225973df6e2E4B27B6cC717e";
ABIS['lottery'] = [
  "function betSingle(uint[])",

  "function scratch()",
  "event SingleBetDone(uint)",

];



ADRS['factory'] = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73";
ABIS['factory'] = [
  "function getPair(address, address) view returns (address)",
];


ADRS['router'] = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
ABIS['router'] = [
  "function getAmountsOut(uint, address[]) view returns (uint[])",
  "function swapExactETHForTokensSupportingFeeOnTransferTokens(uint, address[], address, uint) payable",
  "function swapExactTokensForETHSupportingFeeOnTransferTokens(uint, uint, address[], address, uint)",
];


ADRS['nft'] = "0x933D6472131545BC742Cde7d051a443eA0683a85";
ABIS['nft'] = [
  "function tokenURI(uint) view returns (string)",
  "function _ownedTotalItemCount(address) view returns (uint)",
  "function tokenOfOwnerByIndex(address, uint) view returns (uint)",
  "function _itemById(uint) view returns (uint)",
	
  "function hallOfFame()",
  "function getArmyBox()",

  "event MintedNFT(uint, address, uint)",
];

const CONTS = {};
const SIGNS = {};
const INTFS = {};

for (let name in ABIS) {
  CONTS[name] = new ethers.Contract(ADRS[name], ABIS[name], PROVIDER);
  SIGNS[name] = CONTS[name].connect(SIGNER);
  INTFS[name] = new ethers.utils.Interface(ABIS[name]);
}

ABIS['token'] = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint)",
  "function allowance(address, address) view returns (uint)",
  
  "function transfer(address, uint)",
  "function approve(address, uint256) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
];
ADRS['wbnb'] = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
ADRS['busd'] = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
ADRS['cake'] = "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82";
for (let name of ['busd', 'cake']) {
  CONTS[name] = new ethers.Contract(ADRS[name], ABIS['token'], PROVIDER);
  SIGNS[name] = CONTS[name].connect(SIGNER);
  INTFS[name] = new ethers.utils.Interface(ABIS['token']);
}
 
ABIS['pair'] = [
  "function token0() view returns (address)",
  "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
];

ADRS['pairweb3'] = '0x9f7d235b7d3f4403133A559b0968361687e4fC62';
ADRS['pairtwep'] = '0xd41E2A8E3aEf1649b1DF2C4C7b29BE18324df55E';
ADRS['pairbusd'] = '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16';
ADRS['paircake'] = '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0';

for (let name of ['web3', 'twep', 'busd', 'cake']) {
  CONTS[`pair${name}`] = new ethers.Contract(ADRS[`pair${name}`], ABIS['pair'], PROVIDER);
  SIGNS[`pair${name}`] = CONTS[`pair${name}`].connect(SIGNER);
  INTFS[name] = new ethers.utils.Interface(ABIS[`pair`]);
}

async function READ_TX_MORE(adr, name, method, params, suffixs, args) {
  ADRS[name] = adr;
  if (!(name in ABIS)) {
    ABIS[name] = [];
  }

  if (name in CONTS) {
    if (!(method in CONTS[name])) {
      let abiStr = `function ${method}${params} ${suffixs}`;
      ABIS[name].push(abiStr);
    }
  }
  
  CONTS[name] = new ethers.Contract(ADRS[name], ABIS[name], PROVIDER);
  SIGNS[name] = CONTS[name].connect(SIGNER);
  INTFS[name] = new ethers.utils.Interface(ABIS[name]);
  
  let result = CONTS[name][method](...args);
  return result;
}

// our token launch time: 2022.03.22 02:30:03 PM UTC
// https://bscscan.com/tx/0x3745eb92a39460e840aa5503872f7c2fe513f061e8e0e7c59b35fad7841b2896

// v2 launch time: Jul-18-2022 03:00:20 PM +UTC
// https://bscscan.com/tx/0x4eb05c11e733d47e2fe5ca6206ea371c641281200dbebf2012e60cefdc34d441
const STARTBLOCK = 19661447; 

let CURBLOCK;
async function getCurBlock() {
	let curBlock = await PROVIDER.getBlockNumber();
  
  return curBlock;
}
(async () => {
	CURBLOCK = await getCurBlock();
})();

////////////////////////////////// base

function INT(v, n=0) {
  if (n == 0) {
    return parseInt(v);
  }
  
  return parseInt(v * 10**n) / 10**n;
}

function STR(s) {
	return String(s);
}
function ROUND(v, n=0) {
  return v.toFixed(n);
}

function BNB(value, n=4) {
  value = INT(value);
  return ROUND(value / BNBDIV, n);
}

function WRAP(v) {
	return "[" + v + "]";
}

function COMMA(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function SHORTADR(adr, x=true, n=4) {
  let shortAdr = '';
  if (x) {
    shortAdr += adr.slice(0, 2);
  }
  shortAdr += adr.slice(2, 2 + n) + '..' + adr.slice(-n);
  return shortAdr;
}

function KEYS(dict) {
	return Object.keys(dict);
}

function NOW() {
  return Date.now();
}

function ADELAY(milSec) {
  return new Promise(r => setTimeout(r, milSec));
}
  
function DELAY(milSec) {
  var start = new Date().getTime();
  var end = 0;
  while ((end - start) < milSec) {
    end = new Date().getTime();
  }
}

function UPDATETICK(ticks) {
  return ticks - 1;
}


let F = {};
let V = [];
let P = {};
let VIdx = 0;
async function gV(k) {
  if (!(k in V[VIdx])) {
    if (!(k in F)) {
      alert(k);
      return [true, null];
    }

    if (!(k in P)) {
      P[k] = null;  
    }

    V[VIdx][k] = await F[k](P[k]);
  }

  return V[VIdx][k];  
}


///////////////////////////////// html

const BNBICONURL = "images/bnb-icon.png";
const BUSDICONURL = "images/busd.png";
const TOKENICONURL = "images/logos/TWEP/TWEP.png";

function HREF(link, txt) {
	return `<a href="${link}">${txt}</a>`;
}

function IMG(src) {
	return `<img src="${src}" style="width: 100%;">`;
}

function makeElem(elemType, elemId = null, elemClass = null) {
  let elem = document.createElement(elemType);
  if (elemId) {
    elem.setAttribute('id', elemId);
  }
  if (elemClass) {
    elem.setAttribute('class', elemClass);
  }

  return elem;
}
if (isBrowser) {
  let nullDiv = makeElem('div', 'NULL', null);
  nullDiv.style.width = '1px';
  nullDiv.style.display = 'none';
  document.body.append(nullDiv);
}

function select(el, all=false) {
  el = el.trim();
  let elms = [...document.querySelectorAll(el)];
  if (elms.length == 0) {
    elms = [document.querySelector('#NULL')]; // how to erase inner?
  }

  if (all) {  
    return elms;
  }

  return elms[0];
}

function isExist(el) {
  let els = select(el, true);
  if (els == null) {
    return null;
  }

  if (els.id == 'NULL') {
    return null;
  }

  return els;
}
function displayText(el, text) {
  let els = isExist(el);
  if (els == null) {
    return;
  }
  
  for (var idx = 0; idx < els.length; idx++) {
    els[idx].innerHTML = text;
  }
}

function setClass(target, cls, on=true) {
  if (on) {
    select(target).classList.add(cls);
  } else {
    select(target).classList.remove(cls);
  }
}


async function getUrlData(url) {
  let v = await fetch(url);
  v = await v.json();
  return v;
}

function setCookie(name, value, expDays) {
  let date = new Date();
  date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + "; " + expires + "; path=/";
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}




function copy(value) {
  const input = document.createElement('textarea');
  input.value = value;
	document.body.appendChild(input);

  var isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);

  if (isiOSDevice) {

    var editable = input.contentEditable;
    var readOnly = input.readOnly;

    input.contentEditable = true;
    input.readOnly = false;

    var range = document.createRange();
    range.selectNodeContents(input);

    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    input.setSelectionRange(0, 999999);
    input.contentEditable = editable;
    input.readOnly = readOnly;

  } else {
    // document.body.appendChild(input);
    input.select();

  }

  document.execCommand('copy');
  //if (!isiOSDevice) {
    document.body.removeChild(input);
  //}
}

function swapComma(id, isOn) {
  var $input = $( "#" + id );
  
  if (isOn == false) {
    $input.off("keyup");
    return;
  } 
  
  $input.on( "keyup", function( event ) {
   
      // 1.
      var selection = window.getSelection().toString();
      if ( selection !== '' ) {
          return;
      }
   
      // 2.
      if ( $.inArray( event.keyCode, [38,40,37,39] ) !== -1 ) {
          return;
      }
    
      // 3
      var $this = $( this );
      var input = $this.val();
   
      // 4
      var input = input.replace(/[\D\s\._\-]+/g, "");
   
      // 5
      input = input ? parseInt( input, 10 ) : 0;
   
      // 6
      $this.val( function() {
          return ( input === 0 ) ? "" : input.toLocaleString( "en-US" );
      });

  } );
}


let inputHandlerBuy = function (e) {
  (async function () {
    valueIn = e.target.value;
    valueIn = valueIn.replace(/,/g, '');
    result = select('#buy-output');
    if (valueIn == 0) {
      result.value = 0;
      return;
    }

    valueIn = ethers.utils.parseEther(valueIn);
    valueOut = valueIn.mul(3330000);

    valueOut_ = ethers.utils.formatEther(valueOut);
    valueOut_ = parseInt(valueOut_);
    valueOut_ = numberWithCommas(valueOut_);
    result.value = valueOut_;

  })();
}

let popupSettings = {
  placement: 'bottom',
  boundary: 'window',
};

function spin(target, on) {
  let elm = select(target + ' button');
  if (on) {
    elm.innerHTML = '<span class="spinner"></span>' + elm.innerHTML;
    elm.classList.add('spin');
  } else {
    elm.classList.remove('spin');
  }
}


function getTimeStr(t, d=true, h=true, m=true, s=true) {
  let ds = INT((t % (60*60*24*365)) / (60*60*24));
  let hs = INT((t % (60*60*24)) / (60*60));
  let ms = INT((t % (60*60)) / (60));
  let ss = INT((t % (60)) / (1));
  
  let timeStr = '';
  if (d) {
    timeStr += ` ${ds}d`;
  }
  if (h) {
    timeStr += ` ${hs}h`;
  }
  if (m) {
    timeStr += ` ${ms}m`;
  }
  if (s) {
    timeStr += ` ${ss}s`;
  }
  return timeStr;
}

///////////////////////////////// mouse
function distanceBetween(point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

function angleBetween(point1, point2) {
  return Math.atan2( point2.x - point1.x, point2.y - point1.y );
}

// Only test every `stride` pixel. `stride`x faster,
// but might lead to inaccuracy
function getFilledInPixels(stride) {
  if (!stride || stride < 1) { stride = 1; }
  
  var pixels   = ctx.getImageData(0, 0, canvas.width, canvas.height),
      pdata    = pixels.data,
      l        = pdata.length,
      total    = (l / stride),
      count    = 0;
  
  // Iterate over all pixels
  for(var i = count = 0; i < l; i += stride) {
    if (parseInt(pdata[i]) === 0) {
      count++;
    }
  }
  
  return Math.round((count / total) * 100);
}

function getMouse(e, canvas) {
  var offsetX = 0, offsetY = 0, mx, my;

  if (canvas.offsetParent !== undefined) {
    do {
      offsetX += canvas.offsetLeft;
      offsetY += canvas.offsetTop;
    } while ((canvas = canvas.offsetParent));
  }

  mx = (e.pageX || e.touches[0].clientX) - offsetX;
  my = (e.pageY || e.touches[0].clientY) - offsetY;

  return {x: mx, y: my};
}

let isDrawing = false;
let lastPoint;
function handleMouseDown(e) {
  isDrawing = true;
  lastPoint = getMouse(e, canvas);
}

function handleMouseMove(e) {
  if (!isDrawing) { return; }
  
  e.preventDefault();

  var currentPoint = getMouse(e, canvas),
      dist = distanceBetween(lastPoint, currentPoint),
      angle = angleBetween(lastPoint, currentPoint),
      x, y;
  
  for (var i = 0; i < dist; i++) {
    x = lastPoint.x + (Math.sin(angle) * i) - 25;
    y = lastPoint.y + (Math.cos(angle) * i) - 25;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.drawImage(brush, x, y);
  }
  
  lastPoint = currentPoint;
  handlePercentage(getFilledInPixels(32));
}

function handleMouseUp(e) {
  isDrawing = false;
}

///////////////////////////////// web3

function DOGE(type, txt) {
  return ` https://explorer.dogechain.dog/${type}/${txt}`;
}

function BIGINT(v) {
  return BigInt(v);
}

function BIG(s, decimals=18) {
  try {
    if (decimals == 18) {
      return ethers.utils.parseEther(s);
    } else {
      return ethers.utils.parseUnits(s, decimals);
    }
  } catch (e) {
    alert(e);
  }
}
 
function ETH(big, decimals=18) {
	if (decimals == 18) {
  	return ethers.utils.formatEther(big);
  } else {
  	return ethers.utils.formatUnits(big, decimals);
  }
}
 

 
function ADR(address, popup=true) {
  let checksumAdr;
  try {
    checksumAdr = ethers.utils.getAddress(address);
  } catch (e) {
    let eStr = 'Wrong Format Address: [' + address + ']';
    console.log(eStr);
    if (popup) {
      alert(eStr);
    }
    
    return '';
  }
  return checksumAdr;
}

async function getBalance(adr) {
	let balance = await PROVIDER.getBalance(adr);
 
  return balance;
}

async function getPrice(name) {
  let r = await CONTS[`pair${name}`].getReserves();
  let t0 = await CONTS[`pair${name}`].token0();

  if (t0 == ADRS[name]) {
    r = [r[1], r[0]]; // BNB, adr
  }

  return r[0] / r[1]; // BNB / adr
}



let CURADR = null;
async function getCurAdr() {
	try {
  	CURADR = await SIGNER.getAddress();
  } catch (err) {
  	console.log('not connected yet');
    CURADR = null;
  }
}



function displayAccountInformation() {
  let shortAdrStr = SHORTADR(CURADR);
  
  displayText('.connect-wallet', shortAdrStr);
	
  getBalance(CURADR)
  .then((res) => {
    displayText('#balance-number', BNB(res, 4));
  });

  return;
}



async function handleAccountsChanged(accounts) {
  if (accounts.length == 0) {
    displayText("connectResult", 'Please Connect Metamask');
    return;
  }
  
  if (accounts.length == 0) {
    console.log('no acount');
    CURADR = null;
    return;
  }
  CURADR = ADR(accounts[0]);
  displayAccountInformation();
}

async function conn(func=null, popup=false) {
	try {
  	/* CURADR = await PROVIDER.send("eth_requestAccounts", []) */;
    let accounts = await ethereum.request({ method: 'eth_requestAccounts' }); // eth_requestAccounts
    await handleAccountsChanged(accounts);
    await runPersonal();
    if (func != null) {
      await func();
    }
    
  } catch (err) {
    if (err == 'ReferenceError: ethereum is not defined') {
      alert('Use Dapp to connect wallet!');
      return;
    }
    
    console.log(err);
    if ('message' in err) {
      err = err['message'];
    }
  	
    if (popup) {
    	alert(JSON.stringify(err));
    }    
  }
}

async function runGlobal() { // dummy
}

async function runAnon() { // dummy
}

async function runPersonal() { // dummy
}

async function runLast() {
  $(document).ready(function() {
    $('[data-bs-toggle="tooltip"]').tooltip(popupSettings);
    $('[data-bs-toggle="tooltip"]').on('shown.bs.tooltip', function () {
      // MathJax.Hub.Queue(
      //   ["Typeset",MathJax.Hub,document],
      //   function () {                
      //     $("#thingToHaveMathJaxToolTip").attr("title",$("#toolTipText").html());
      //   ]
      // );
    });
  });
}

function handleChainChanged(_chainId) {
  // Reload the page
  window.location.reload();
}





////////////////////////////////// tx

async function ERR(err, popup=true) {
  let result = err;

  if (!('code' in err)) {
    alert('no code:' + err);
    return result;
  }

  if (err['code'] == -32603) {
    if (!('data' in err)) {
      alert('no data:' + err);
      return result;
    }

    let data = err['data'];
    if (!('code' in data)) {
      alert('no code data:', err);

      return result;
    }

    if (data['code'] == 3) {
      let msg = data['message'];
      result = msg;
      alert('C:' + result);
      return result;
    }

    if (data['code'] == -32000) {
      let msg = data['message'];
      result = msg;
      alert('D:' + result);
      return result;
    }
  }

  return result;
}

async function SIGN(name, msg, bin=false) {
	if (bin == true) {
  	msg = ethers.utils.arrayify(msg);
  }
  return await SIGNS[name].signMessage(msg);
}
 
 
async function SEND_ETH(from=ADRS["fund"], to=ADRS["fund"], value='0.0', popup=true) {
	const data = {
  	from: from,
  	to: to,
    value: BIG(value),
    /* nonce: window.ethersProvider.getTransactionCount(send_account, "latest"),
        gasLimit: ethers.utils.hexlify(gas_limit), // 100000
        gasPrice: gas_price, */
  };
  
  try {
  	let result = await SIGNER.sendTransaction(data);
    console.log('result', result);
    return [ false, result ];
  } catch (err) {
  	err = await ERR(err, popup);
    return [ true, err ];
  }
}
 
async function READ_TX(name, method, args, from="0xe7F0704b198585B8777abe859C3126f57eB8C989", popup=true) {
	const overrides = {
  	from: from,
  };
 
  try {
  	let result = await CONTS[name][method](...args, overrides);
    return [ false, result ];
  } catch (err) {
  	err = await ERR(err, popup);
    return [ true, err ];
  }
 
}
 
async function GAS(name, method, args, value=null, popup=true, overrides=null) {
  if (overrides == null) {
    overrides = {};  
    overrides['from'] = CURADR;
  }

  
  if (value != null) {
    overrides['value'] = BIG(value);
  }

  let result;
  try {
    result = await CONTS[name].estimateGas[method](...args, overrides);
    console.log('result', result);
    return [ false, result ];
  } catch (err) {
    result = await ERR(err, popup);
    return [ true, result ];
  };
}

async function SEND_TX(name, method, args, value=null, check=true, popup=true, overrides=null) {
  if (overrides == null) {
    overrides = {};
    overrides['gasLimit'] = 1000000;
    overrides['from'] = CURADR;
  }

  if (value != null) {
    overrides['value'] = BIG(value);
  }

  if (check == true) {
    let [res, data] = await GAS(name, method, args, value, popup, overrides);
    if (res == true) {
      console.log(data);
      return [ true, data ];
    } 

    // use gas result
    console.log('gas', res, INT(data));
    overrides['gasLimit'] = INT(data * 1.3);
  }

  try {
    let result;
    result = await SIGNS[name][method](...args, overrides);
    console.log('hash', result['hash']);
    console.log('result', result);
    return [ false, result ];

    // if (wait == true) {
    //   let txResult = await result.wait();
    //   console.log('txResult', txResult);
    //   return [ false, txResult ];
    //   // event, eventSignature
    // } else {
    	
    // }
    /* console.log(tx.hash); */
    // wait()
    // receipt.events
  } catch (err) {
    err = await ERR(err, popup);
    return [ true, err ];
  }
}


let buyTxhashData;
async function privateBuy() {
	let buyAmount = select('#buy-input').value;
  let { res, data } = await SEND_ETH(CURADR, ADRS['fund'], buyAmount);
  if (res == true) {
  	// err
    return [ true, data ];
  }
  
  let buyResult = select('#buy-result');
  buyResult.innerHTML = 'Success';
  let buyTxhash = select('#buy-txhash');
  buyTxhash.innerHTML = HREF(BSC('tx', data.hash), SHORTADR(data.hash));
  buyTxhashData = data.hash;  
}


(async () => {
  if (isBrowser) {
    if (window.ethereum) {
      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);
    }
  }

  // do global
 
  // do personal

  console.log('done');
})();
