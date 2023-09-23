"use strict"

let score = 0
let spc = 0

document.getElementById("tulip").addEventListener("click", function() {
    score += spc
    calcScore()
})


const saveButton = document.getElementById("save")
saveButton.addEventListener("click", function() {
    
    document.cookie = "score=" + score
    document.cookie = "numItems=" + JSON.stringify(numItems)
    document.cookie = "numUpgrades=" + JSON.stringify(numUpgrades)
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
        
        let upgradeDatas = JSON.parse(res["numUpgrades"] || "[]")
        for(let i in upgradeDatas){
            numUpgrades[i] = upgradeDatas[i]
        }
        
    }
}

const shopTable = document.getElementById("shop")
const upgradeTable = document.getElementById("upgrade")
let shopItems = [
    ["🥺", 10, 1.1, 1],
    ["🤶", 100, 1.1, 10],
    ["🤥", 500, 1.1, 15],
    ["🏕", 10000, 1.1, 300],
]
let upgrades = [
    ["☝", 10, 5, 3],
    ["🥺", 100, 10, 2],
    ["🤶", 1000, 10, 2],
    ["🤥", 1000, 10, 2],
    ["🏕", 100000, 10, 2],
]
let numItems = new Array(shopItems.length).fill(0)
let numUpgrades = new Array(upgrades.length).fill(0)
let sps = 0

function init() {
    getCookie()
    makeLayout()
    calcScore()
    calcSps()
}

function makeLayout() {
    for(let id in shopItems){
        let tr = document.createElement("tr")
        shopTable.appendChild(tr)
        let item = shopItems[id]
        let td = document.createElement("td")
        let cost = (item[1] * item[2] ** numItems[id]) | 0
        td.id = "item" + id
        td.className = "item noselect"
        td.textContent = item[0] + "x" + numItems[id] + ", cost:" + cost + ", 🌷+" + item[3] * numItems[id] * upgrades[+id+1][3] ** numUpgrades[+id+1]
        td.addEventListener("click", function() {
            if (score >= cost){
                score -= cost
                numItems[id]++
                cost = (item[1] * item[2] ** numItems[id]) | 0
                calcSps()
                td.textContent = item[0] + "x" + numItems[id] + ", cost:" + cost + ", 🌷+" + item[3] * numItems[id] * upgrades[+id+1][3] ** numUpgrades[+id+1]
                calcScore()
            }
        })
        tr.appendChild(td)
    }
    
    
    for(let id in upgrades){
        let tr = document.createElement("tr")
        upgradeTable.appendChild(tr)
        let item = upgrades[id]
        let td = document.createElement("td")
        let cost = (item[1] * item[2] ** numUpgrades[id]) | 0
        td.id = "upgrade" + id
        td.className = "item noselect"
        td.textContent = item[0] + "x" + numUpgrades[id] + ", cost:" + cost + ", 🌷x" + item[3]
        td.addEventListener("click", function() {
            if (score >= cost){
                score -= cost
                numUpgrades[id]++
                cost = (item[1] * item[2] ** numUpgrades[id]) | 0
                calcSps()
                td.textContent = item[0] + "x" + numUpgrades[id] + ", cost:" + cost + ", 🌷x" + item[3]
                
                let td2 = document.getElementById("item" +(+id-1))
                td2.textContent = shopItems[id-1][0] + "x" + numItems[id-1] + ", cost:" + ((shopItems[id-1][1] * shopItems[id-1][2] ** numItems[id-1]) | 0) + ", 🌷+" + shopItems[id-1][3] * numItems[id-1] * upgrades[id][3] ** numUpgrades[id]
                calcScore()
            }
        })
        tr.appendChild(td)
    }
}


function calcSps() {
    sps = 0
    for(let id in shopItems){
        let item = shopItems[id]
        sps += item[3] * numItems[id] * upgrades[+id+1][3] ** numUpgrades[+id+1]
    }
    spc = upgrades[0][3] ** numUpgrades[0]
    
    document.getElementById("sps-value").textContent = sps;
    document.getElementById("spc-value").textContent = spc;
    
    return
}

function makeShop() {
    for(let id in shopItems){
        let item = shopItems[id]
        let cost = (item[1] * item[2] ** numItems[id]) | 0
        
        let td = document.getElementById("item" + id)
        if(score >= cost){
            td.className = "item noselect"
        }else{
            td.className = "item noselect gray"
        }
        
    }
    for(let id in upgrades){
        let item = upgrades[id]
        let cost = (item[1] * item[2] ** numUpgrades[id]) | 0
        
        let td = document.getElementById("upgrade" + id)
        if(score >= cost){
            td.className = "item noselect"
        }else{
            td.className = "item noselect gray"
        }
        
    }
}

function loop() {
    score += sps / 10
    
    makeShop()
    calcScore()
}

function calcScore() {
    document.getElementById("score-value").textContent = score|0;
}





window.onload = function () {
    init()
    setInterval(loop, 100)
}
