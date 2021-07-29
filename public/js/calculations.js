const MALE = "Муж.";
const FEMALE = "Жен.";
const ROADS = 3;


let males;
let females;
let charts;

function divideSexDistsGroups(sports) {
    for (let UID in sports) {
        if (!sports.hasOwnProperty(UID)) continue;
        sport = sports[UID];

        if (sport.gender === MALE) {
            divideDistsGroups(sport, males)
        }
        else {
            divideDistsGroups(sport, females);
        }
    }



}

function divideDistsGroups(sport, genderGroup) {
    sport.distances.forEach(function (dist) {
        if (!genderGroup[sport.group][dist.name]) genderGroup[sport.group][dist.name] = [];

        genderGroup[sport.group][dist.name].push({name: sport.name, distTime:dist.time});
    })

}


function makeSortAndCharts(dividedSportsGroup, sex, sideGroup={}) {
    DISTANCES.forEach(function (distName) {
        dist = dividedSportsGroup[distName];
        if (!dist) dist = [];
        if (sideGroup[distName]) dist = dist.concat(sideGroup[distName]);

        dist.sort(sortDIstTimes);
        if (dist.length !== 0) makeCharts(dist, sex, distName);
    });
}

function makeCharts(sortedSportsGroup, sex, distName) {
    for (let i = sortedSportsGroup.length; i >= 0; i -= ROADS) {
        let start = sortedSportsGroup.length-ROADS;
        if (start < 0) start = 0;
        let top = sortedSportsGroup.splice(start, ROADS);
        if (!charts[distName]) {charts[distName] = {}; charts[distName][MALE] = []; charts[distName][FEMALE] = []; }
        charts[distName][sex].push([top[1] || {}, top[0] || {}, top[2] || {}])
    }
}

function sortDIstTimes(a, b) {
    if (a.distTime < b.distTime) return -1;
    if (a.distTime > b.distTime) return 1;
    return 0;
}



    function calculate(B2B3Union) {
        clearCharts();
        divideSexDistsGroups(sports);
        if (B2B3Union) makeSortAndCharts(males.B2, MALE, males.B3);
        else makeSortAndCharts(males.B2, MALE);
        if (B2B3Union) makeSortAndCharts(females.B2, FEMALE, females.B3);
        else makeSortAndCharts(females.B2, FEMALE);


        visualizeCharts()

}



function clearCharts() {
    males = {B1:{}, B2:{}, B3:{}};
    females = {B1:{}, B2:{}, B3:{}};
    charts = {};
    chartNum = 0;

}


function visualizeCharts() {
    let point = $("#chartPlace");
    point.empty();


    for (distName in charts) {
        if (!charts.hasOwnProperty(distName)) continue
        distSports = charts[distName];


        let headText = distName+" | ";
        point.append($(`<h1 class='text-white mt-5'>${headText}</h1>`));
        for (let i = 0; i  < distSports.length; i++) {
            chartNum++;
            console.log(distSports)
            let three = distSports[i];
            newChartCard = $(`
            <div class="card mb-5 bg-dark cardShadow">
                <div class="card-header underlined" style="font-size: 1.3em;">${chartNum} Заплыв | ${headText}</div>
                <div class="card-body">
                    <p>${three[0].name || "Пусто"} - Первая дорожка ${fromMSec(three[0].distTime)}</p>
                    <p>${three[1].name || "Пусто"} - Вторая дорожка ${fromMSec(three[1].distTime)}</p>
                    <p>${three[2].name || "Пусто"} - Третья дорожка ${fromMSec(three[2].distTime)}</p>
    
                </div>
            </div>
        
        `)
        point.append(newChartCard);
        }
    }

}






