"use strict"

let score = 0

document.getElementById("tulip").addEventListener("click", function() {
    score++
    document.getElementById("score-value").textContent = score
})


const saveButton = document.getElementById("save")
saveButton.addEventListener("click", function() {
    
    document.cookie = "score=" + score
    document.cookie = "numItems=" + JSON.stringify(numItems)
    if(document.cookie){
        saveButton.textContent = "saved!"
    }
    
    setTimeout(() => {
        saveButton.textContent = "save"
    }, 1000)
})

function getCookie() {
    let cookies = document.cookie
    let res = {}
    if(cookies){
        let cookieArray = cookies.split(';')
        cookieArray.forEach(data => {
            data = data.split("=")
            res[data[0].trim()] = data[1]
        })
        score = +res["score"] || 0
        
        let itemDatas = JSON.parse(res["numItems"])
        for(let i in itemDatas){
            numItems[i] = itemDatas[i]
        }
        
    }
}

const shopTable = document.getElementById("shop")
let upgrades = [
    ["🥺", 10, 1.1, 1],
    ["🤶", 100, 1.1, 10],
]
let numItems = new Array(upgrades.length).fill(0)
let sps = 0

function init() {
    getCookie()
    makeLayout()
    document.getElementById("score-value").textContent = score;
    calcSps()
}

function makeLayout() {
    for(let id in upgrades){
        let tr = document.createElement("tr")
        shopTable.appendChild(tr)
        let item = upgrades[id]
        let td = document.createElement("td")
        let cost = (item[1] * item[2] ** numItems[id]) | 0
        td.id = "item" + id
        td.className = "item noselect"
        td.textContent = item[0] + "x" + numItems[id] + ", cost:" + cost + ", 🌷+" + item[3]
        td.addEventListener("click", function() {
            if (score >= cost){
                score -= cost
                numItems[id]++
                cost = (item[1] * item[2] ** numItems[id]) | 0
                calcSps()
                td.textContent = item[0] + "x" + numItems[id] + ", cost:" + cost + ", 🌷+" + item[3]
                document.getElementById("score-value").textContent = score;
            }
        })
        tr.appendChild(td)
    }
}


function calcSps() {
    sps = 0
    for(let id in upgrades){
        let item = upgrades[id]
        sps += item[3] * numItems[id]
    }
    
    document.getElementById("sps-value").textContent = sps;
    
    return
}

function makeShop() {
    for(let id in upgrades){
        let item = upgrades[id]
        let cost = (item[1] * item[2] ** numItems[id]) | 0
        
        let td = document.getElementById("item" + id)
        if(score >= cost){
            td.className = "item noselect"
        }else{
            td.className = "item noselect gray"
        }
        
    }
}

function loop() {
    score += sps / 10 | 0
    
    makeShop()
    document.getElementById("score-value").textContent = score;
}



window.onload = function () {
    init()
    setInterval(loop, 100)
}
