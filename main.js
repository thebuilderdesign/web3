'use strict'


const GENDERS = ['female', 'male'];
const PARTS = ['bg', 'wings', 'skin', 'eyes', 'dress', 'mask', 'hair', 'horn', 'wig'];
const SHORTGRADES = {'c': 'common', 'r': 'rare', 'e': 'epic', 'l': 'legendary'};
const GRADES = Object.values(SHORTGRADES);
const ITEMGRADES = {
    'female': {
        'bg': ['c', 'l', 'c', 'c', 'r', 'r'],
        'wings': [],
        'skin': ['c', 'c', 'c', 'c', 'c', 'c'],
        'eyes': ['r', 'c', 'r', 'r'],
        'dress': ['e', 'e', 'e', 'e'],
        'mask': ['c', 'e', 'c', 'c', 'c'],
        'hair': ['e', 'r', 'e', 'e', 'r'],
        'horn': ['l', 'l'],
        'wig': [],
    },
    'male': {
        'bg': ['c', 'c', 'r', 'c', 'r', 'c'],
        'wings': ['l'],
        'skin': ['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
        'eyes': ['c', 'r', 'r', 'e'],
        'dress': ['e', 'e', 'e'],
        'mask': ['c', 'l', 'c', 'r'],
        'hair': ['r', 'l', 'r', 'r'],
		'horn': ['e', 'e', 'e', 'e'],
        'wig': ['l'],
    }
}

const ITEMINFOS = [];
for (const [idx, gender] of Object.entries(GENDERS)) {
    for (const [idy, part] of Object.entries(PARTS)) {
        if (!(gender in ITEMGRADES)) {
            continue;
        }
        if (!(part in ITEMGRADES[gender])) {
            continue;
        }
        for (var idz = 0; idz < ITEMGRADES[gender][part].length; idz++) {
			let itemImgPath = `${gender}-${part}-${idz+1}-t.png`;
			let gradeKey = ITEMGRADES[gender][part][idz];
            ITEMINFOS.push([itemImgPath, SHORTGRADES[gradeKey]]);
        }
    }
}


function getItemCard(itemInfo) {
	let imgFileName = itemInfo[0];
    let [gender, part, num, _] = imgFileName.split('-');
    let imgName = part;
    let grade = itemInfo[1];

    let htmlStr = `<div class="card clip-corners text-white"> \
        <img src="images/${imgFileName}" class="card-img" alt="..."> \
        <div class="card-img-overlay bg-blur mt-auto" style="height: 32%; background-color: rgba(0, 0, 0, 0.42);"> \
        <div class="d-flex flex-column align-items-center justify-content-center h-100 w-100"> \
        <h2 class="d-flex align-items-center"> \
        ${imgName} \
        <span id="${grade}-stars" class="d-flex"></span> \
        </h2> \
        <span id="${grade}-stat"></span> \
        </div> \
        </div> \
        </div>
        `;
    
    return htmlStr;
}

const PERCENTAGES = ['80%', '8%', '0.8%', '0.1%'];


function displayAll() {
    let elms;
    for (const [idy, grade] of Object.entries(GRADES)) {
        elms = select(`#${grade}-stars`, true);
        for (const elm of elms) {
            let htmlStr = '';
            for (var idx = 0; idx < INT(idy) + 1; idx++) {
                htmlStr += `<img src='images/star.png' alt='star'></img>`;    
            }
            elm.innerHTML = htmlStr;
        }

        elms = select(`#${grade}-stat`, true);
        let tags = `bg-${grade} fw-bold px-4 py-2 rounded-pill me-3`.split(' ');
        for (const elm of elms) {
            for (const tag of tags) {
                elm.classList.add(tag);
            }
            elm.setAttribute('data-bs-toggle', 'tooltip');
            elm.setAttribute('data-bs-html', true);
            let tooltipStr = `Drop Rate <br/> \
            ${PERCENTAGES[idy]} <span id='${grade}-bonus' class='text-error'>+0%</span>`;
            elm.setAttribute('title', tooltipStr);
            let htmlStr = `${grade}`;
            elm.innerHTML = htmlStr;
        }
    }
	
    let descStr = ` \
    By holding each 1% of total supply, <br/> \
    -10% to common, <br/> \
	+9% to rare, <br/> \
    +0.9% to epic, <br/> \
    +0.1% to legendary, <br/> \
    `;
    select('#rateDesc').setAttribute('title', descStr);
}

$(document).ready(function () {  

    const slideTrack = select('#slide-track');

    for (var idx = 0; idx < 8; idx++) {
        {
            let div = makeElem('div', '', 'slide');
            {
                let img = makeElem('img');
                img.src = "images/star-icon.png";
                img.alt = "";
                div.append(img);
            }
            slideTrack.append(div);
        }
        {
            let div = makeElem('div', '', 'slide');
            {
                let img = makeElem('img', null, 'img-fluid');
                img.src = "images/mystery-box-sm.png";
                img.alt = "mystery-box";
                div.append(img);
            }
            slideTrack.append(div);
        }
        {
            let div = makeElem('div', '', 'slide');
            {
                let img = makeElem('img');
                img.src = "images/star-icon.png";
                img.alt = "";
                div.append(img);
            }
            slideTrack.append(div);
        }
        {
            let div = makeElem('div', '', 'slide');
            {
                let span = makeElem('span', null, 'text-uppercase text-info');
                span.innerHTML = "Mystery Box";
                div.append(span);
            }
            slideTrack.append(div);
        }
    }
    runScroll();
    displayAll();
});


function getSpinHtml() {
    return `<div class="spinner-border mx-2" role="status"></div>`;
}

// if click, run transaction while viewing loading
// if done, show result based on the things got
async function purchaseBox(boxCount) {
    select('#connectWalletStatus').innerHTML = "Confirm in dapp";
    select('#connectWalletStatus').innerHTML += getSpinHtml();
    let [res, data] = await SEND_TX('edoge', 'manualRebase', []);
    if (res == true) {
        select('#connectWalletStatus').innerHTML = "User Rejected";
        return;
    }
    let result = data;
    select('#connectWalletStatus').innerHTML = "Waiting for result";
    select('#connectWalletStatus').innerHTML += getSpinHtml();
    let txResult = await result.wait();
    // let hash = (await PROVIDER.getBlockWithTransactions(17454309))['transactions'][145]['hash'];
	// (await (await PROVIDER.getBlockWithTransactions(17454309))['transactions'][145].wait())['logs']
    
    // txResult['events']
    console.log(txResult['events']);

    const acheived = select('#acheived');
    for (const [idy, itemInfo] of Object.entries(ITEMINFOS.slice(0, boxCount))) {
        let div = makeElem('div', null, 'col my-4');

        let htmlStr = getItemCard(itemInfo);
        div.innerHTML = htmlStr;
        acheived.append(div);
    }
    runScroll();
    displayAll();
    select('#purchaseBoxModal').classList.add('show');
    select('#showResult').click();
}




try {
    let connectWalletModal = select('#connectWalletModal');
    let forMysteryBtn = select("#forMysteryBtn");

    connectWalletModal.addEventListener('show.bs.modal', async function (event) {
        let button = event.relatedTarget;

        let boxCount = INT(select('#boxCount').innerHTML);
		
        let cost;
        if (targetCurrency == 'DOGE') {
            cost = 10 / (await gV('dogePrice')) * boxCount;
        } else {
            cost = 10 / (await gV('price')) * boxCount;
        }
        cost = ROUND(cost, 5);
        select('#showDetails').innerHTML = `Cost: ${cost} ${targetCurrency}`; // blockchain cost check

        

        async function setPurchaseBox() {
            select('#connectWalletStatus').innerHTML = `Purchase ${boxCount} Box`;
            select('#forMysteryBtn').onclick = async () => { await purchaseBox(boxCount); };
        }

        await getCurAdr();
        if (CURADR == null) {
            select('#forMysteryBtn').onclick = async () => { await conn(setPurchaseBox); };
        } else {
            await setPurchaseBox();
        }

        
    });

    

    let purchaseBoxModal = select('#purchaseBoxModal');
    purchaseBoxModal.addEventListener('show.bs.modal', function (event) {
        purchaseBoxModal.querySelector('#modal-body-text').classList.add('d-none');
        purchaseBoxModal.querySelector('#modal-body-video').classList.remove('d-none');     
        purchaseBoxModal.querySelector('#modal-body-video video').play();
        setTimeout(function() {
            purchaseBoxModal.querySelector('#modal-body-video').classList.add('d-none');
            purchaseBoxModal.querySelector('#modal-body-text').classList.remove('d-none');
        }, 3000);
    });
}
catch(err) {
    console.log(err);
}


const carousel = select('#carousel');
    for (const [idy, itemInfo] of Object.entries(ITEMINFOS)) {
        let div = makeElem('div', null, 'item col-12 mt-4 mb-4');

        let htmlStr = getItemCard(itemInfo);

        div.innerHTML = htmlStr;
        carousel.append(div);
    }
    runScroll();
    displayAll();

let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))

let popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})

function runScroll() {
    let owl = $('.owl-carousel');
    if (owl.length == 0) {
        return;
    }
        owl.owlCarousel({
            loop: true,
            margin: 10,
            nav: true,
            navText: ["<div class='nav-button owl-prev'><img src='images/arrow-left.png' alt='' /></div>", "<div class='nav-button owl-next'><img src='images/arrow-right.png' alt='' /></div>"],
            autoplay: true,
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 3
                },
                1200: {
                    items: 5
                },
            }
        });
}

let targetCurrency = '$EDOGE';
function toggleBtnTab() {
    $('.toggleBtnTab').toggleClass('text-primary bg-white');
    if (targetCurrency == 'DOGE') {
        targetCurrency = '$EDOGE';
    } else {
        targetCurrency = 'DOGE';
    }
}



function displayAvatarPage() {
    let sidebar = select('#sidebar');
    // sidebar.innerHTML = '';
    for (const [idx, part] of Object.entries(PARTS)) {
        let htmlStr = ` \
        <button class="btn p-0 my-1" id="v-pills-${part}-tab" data-bs-toggle="pill" data-bs-target="#v-pills-${part}" type="button" role="tab" aria-controls="v-pills-${part}" aria-selected="false"> \
            <img src="images/${part}-option.png" alt="${part}-option" /> \
        </button> \
        `;
        sidebar.innerHTML += htmlStr;
    }
    select('#v-pills-bg-tab').classList.add("active");
    select('#v-pills-bg-tab').setAttribute('aria-selected', "true");
	
    for (const [idx, gender] of Object.entries(GENDERS)) {
        let itemList = select(`#v-pills-tabContent-${gender}`);
        itemList.innerHTML = '';
        for (const [idy, part] of Object.entries(PARTS)) {
            let htmlStr = ` \
            <div class="tab-pane fade" id="v-pills-${part}" role="tabpanel" aria-labelledby="v-pills-${part}-tab"> \
            <div id="items-${gender}-${part}" class="row"> \
            </div> \
            </div> \
            `;
            itemList.innerHTML += htmlStr;
        }
        select('#v-pills-bg').classList.add('show');
        select('#v-pills-bg').classList.add('active');
    }

    for (const [idx, gender] of Object.entries(GENDERS)) {
        for (const [idy, part] of Object.entries(PARTS)) {
            let itemPart = select(`#items-${gender}-${part}`);
            for (var idz = 0; idz < ITEMGRADES[gender][part].length; idz++) {
                let htmlStr = ` \
                <div class="col-auto mb-4"> \
                <button id="${gender}-${part}-${idz+1}.png" type="button" class="btn btn-secondary option-btn p-0 tooltip-custom" onclick=changePart(${part}, this.id)"> \
                <img src="images/${gender}-${part}-${idz+1}-t.png" alt="${gender}-${part}-${idz+1}.png" class="img-fluid rounded-1" /> \
                <span class="tooltiptext-custom py-3 px-2"> \
                <span class="bg-grey small fw-bold py-2 rounded-pill"> \
                Tax reduction (+x%) \
                </span> \
                </span> \
                </button> \
                </div>`;
                itemPart.innerHTML += htmlStr;
            }
            for (var idz = ITEMGRADES[gender][part].length; idz < 8; idz++) {
                let htmlStr = ` \
                <div class="col-auto mb-4"> \
                <button type="button" class="btn btn-secondary option-btn p-0 pe-none"> \
                <img src="images/locked.png" alt="" class="img-fluid rounded-1" /> \
                </button> \
                </div>`;
                itemPart.innerHTML += htmlStr;
            }
        }
    }

    for (const [idx, gender] of Object.entries(GENDERS)) {
        let tabContent = select(`#v-pills-tabContent-sm-${gender}`);
        tabContent.innerHTML = '';
        for (const [idy, part] of Object.entries(PARTS)) {
            let htmlStr = ` \
            <div class="tab-pane fade" id="v-pills-${part}-sm" role="tabpanel" aria-labelledby="v-pills-${part}-sm-tab"> \
            <div id="items-d-${gender}-${part}" class="d-flex"> \
            </div> \
            </div> \
            `;
            tabContent.innerHTML += htmlStr;
        }
        select('#v-pills-bg-sm').classList.add('show');
        select('#v-pills-bg-sm').classList.add('active');
    }

	

    for (const [idx, gender] of Object.entries(GENDERS)) {
        for (const [idy, part] of Object.entries(PARTS)) {
            let itemPart = select(`#items-d-${gender}-${part}`);
            for (var idz = 0; idz < ITEMGRADES[gender][part].length; idz++) {
                let htmlStr = ` \
                    <div class="col-auto mb-4"> \
                    <button id="${gender}-${part}-${idz+1}.png" type="button" class="btn btn-secondary option-btn p-0 tooltip-custom" onclick="changePart(${part}, this.id)"> \
                    <img src="images/${gender}-${part}-${idz+1}-t.png" alt="${gender}-${part}-${idz+1}.png" class="img-fluid rounded-1" /> \
                    <span class="tooltiptext-custom py-3 px-2"> \
                    <span class="bg-grey small fw-bold py-2 rounded-pill"> \
                    Tax reduction (+x%) \
                    </span> \
                    </span> \
                    </button> \
                    </div>`;
                    itemPart.innerHTML += htmlStr;
            }	
        }
    }
	
    let container = select('#output-img-container');
    for (const [idx, gender] of Object.entries(GENDERS)) {
	    for (const [idx, part] of Object.entries(PARTS)) {
            let htmlStr = ` \
            <div class="output-img d-none"> \
            <img id="${part}-output" src="images/${gender}-${part}-1.png" alt="" class="img-fluid" /> \
            </div>`;
            container.innerHTML += htmlStr;
        }
    }

    let sidebarSm = select('#sidebar-sm');
	for (const [idx, part] of Object.entries(PARTS)) {
		let htmlStr = ` \
        <button class="btn p-0 my-1" id="v-pills-${part}-sm-tab" data-bs-toggle="pill" data-bs-target="#v-pills-${part}-sm" type="button" role="tab" aria-controls="v-pills-${part}-sm" aria-selected="false">
        <img src="images/${part}-option.png" alt="${part}-option" />
        </button>`;
        sidebarSm.innerHTML += htmlStr;
    }
    select('#v-pills-bg-sm-tab').classList.add("active");
    select('#v-pills-bg-sm-tab').setAttribute('aria-selected', "true");

    
}
displayAvatarPage();




function changeCount(state) {
    let num = parseInt(document.getElementById("boxCount").innerHTML);
    
    if(state == "add") {
        document.getElementById("boxCount").innerHTML = num + 1;
    }
    else {
        if(num > 0) {
            document.getElementById("boxCount").innerHTML = num - 1;
        }
    }
}

function changePart(part, img_url) {
    img_url = "images/" + img_url;
    let output = select(`${part}-output`);
    output.setAttribute('src', img_url);
    output.onload = function () {
        showOutputImage();
    };
}

function showOutputImage() {
    try {
        let imgs = document.querySelectorAll('.output-img img');
        /* imgs.reverse(); */
        // console.log(imgs);

        let imgsSrc = [];
        imgs.forEach(element => {
            imgsSrc.push(element.src);
        });

        // console.log(imgsSrc);

        /* mergeImages(imgsSrc)
        .then(b64 => document.querySelector('img#combined-output-img').src = b64); */

        let resEle = document.querySelector("canvas#combined-output-img");
        if (resEle != null) {
            setTimeout(function() {
                let context = resEle.getContext("2d");
                resEle.width = imgs[0].width;
                resEle.height = imgs[0].height;
                for (let idx = 8; idx >= 0; idx--) {
                    if (imgs[idx].complete && imgs[idx].naturalHeight !== 0) {
                        context.drawImage(imgs[idx], 0, 0);
                    }
                }
            }, 3000);
        }
    }
    catch(e) {
        console.log(e);
    }
}

function download(){
    /* var canvas = document.getElementById("combined-output-img");
    image = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
    var link = document.createElement('a');
    link.download = "my-image.png";
    link.href = image;
    link.click(); */
    
    let element = document.getElementById("combined-output-img");
    let canvas = html2canvas(element);
    let url = canvas.toDataURL("image/png");
    saveCapture(url);
}
  
function saveCapture(url) {
    let a = $("<a style='display:none' id='js-downloder'>")
    .attr("href", url)
    .attr("download", "test.png")
    .appendTo("body");
  
    a[0].click();
  
    a.remove();
}


showOutputImage();
setTimeout(showOutputImage, 3000);

$(".modal").on("shown.bs.modal", function () {
    if ($(".modal-backdrop").length > 1) {
        $(".modal-backdrop").not(':first').remove();
    }
})

$(function () {
    $('[data-bs-toggle="tooltip"]').tooltip();
  })

