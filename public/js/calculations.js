const MALE = "Муж.";
const FEMALE = "Жен.";
const ROADS = 3;

let dividedSports;
let charts;
let periodList;
let chartNum;

function divideSports(sports) {
    for (let UID in sports) {
        if (!sports.hasOwnProperty(UID)) continue;
        let s = sports[UID];
        s.inPeriod = selectPeriod(s);

        s.distances.forEach(function (dist) {
            if (!dividedSports[dist.name]) dividedSports[dist.name] = {};
            if (!dividedSports[dist.name][s.gender]) dividedSports[dist.name][s.gender] = {};
            if (!dividedSports[dist.name][s.gender][s.inPeriod]) dividedSports[dist.name][s.gender][s.inPeriod] = {B1:[], B2:[], B3:[]};

            dividedSports[dist.name][s.gender][s.inPeriod][s.group].push({UID: UID, name: s.name, dist: dist.name, distTime: dist.time});
        });


    }

}




function makeGroupCharts(sortedSportsGroup, period, group, point, headText) {

    for (let i = sortedSportsGroup.length; i >= 0; i -= ROADS) {
        let start = sortedSportsGroup.length-ROADS;
        if (start < 0) start = 0;
        let top = sortedSportsGroup.splice(start, ROADS);
        if (top.length === 0) continue;
        let three = [top[1]||{}, top[0]||{}, top[2]||{}];
        chartNum++;


        let newChartCard = $(`
            <div class="card mb-5 bg-dark cardShadow">
                <div class="card-header underlined" style="font-size: 1.3em;">${chartNum} Заплыв | ${headText} | ${period} | ${group}</div>
                <div class="card-body">
                    <p>${three[0].name || "Пусто"} - Первая дорожка ${fromMSec(three[0].distTime)}</p>
                    <p>${three[1].name || "Пусто"} - Вторая дорожка ${fromMSec(three[1].distTime)}</p>
                    <p>${three[2].name || "Пусто"} - Третья дорожка ${fromMSec(three[2].distTime)}</p>
    
                </div>
            </div>
        
        `);
        point.append(newChartCard);
    }
}




function makeCharts(B2B3Union) {
    // Тут будет много цыклов, главной задачей которых будет перебрать  все финальные группы плавцов, отсортировать их и построить чарты.
    let entryPoint = $("#chartPlace");
    entryPoint.empty();
    let headText;

    for (let dist in dividedSports) {
        if (!dividedSports.hasOwnProperty(dist)) continue;
        let genders = dividedSports[dist];

        for (let gender in genders) {
            if (!genders.hasOwnProperty(gender)) continue;
            let periods = genders[gender];
            headText = gender+" | "+dist;
            entryPoint.append($(`<h1 class='text-white mt-5'>${headText}</h1>`));


            for (let period in periods) {
                if (!periods.hasOwnProperty(period)) continue;
                let groups = periods[period];

                if (groups.B1.length !== 0) {groups.B1.sort(sortDIstTimes); makeGroupCharts(groups.B1, period, "B1", entryPoint, headText)}
                if (B2B3Union) {
                    groups.B2B3 = groups.B2.concat(groups.B3);
                    groups.B2B3.sort(sortDIstTimes);
                    makeGroupCharts(groups.B2B3, period, "B2&B3", entryPoint, headText);
                } else {
                    groups.B2.sort(sortDIstTimes);
                    makeGroupCharts(groups.B2, period, "B2", entryPoint, headText);

                    groups.B3.sort(sortDIstTimes);
                    makeGroupCharts(groups.B3, period, "B3", entryPoint, headText)

                }
                console.log("----")






            }


        }

    }

}




function sortDIstTimes(a, b) {
    if (a.distTime < b.distTime) return -1;
    if (a.distTime > b.distTime) return 1;
    return 0;
}



    function calculate(B2B3Union) {
        clearCharts();
        makePeriodList();
        divideSports(sports);
        makeCharts(B2B3Union);

}



function clearCharts() {
    dividedSports = {};

    periodList = [];
    charts = {};
    chartNum = 0;

}


function makePeriodList() {
    periodArray.forEach(function (i) {
        periodList.push([+$("#perFromSelect"+i).val(), +$("#perToSelect"+i).val()]);
    });
}

function selectPeriod(sport={year: 2010}) {
    for (let i = 0; i < periodList.length; i++) {
        let fromTo = periodList[i];
        if (sport.year >= fromTo[0] && sport.year <= fromTo[1]) {
            return `${fromTo[0]}-${fromTo[1]}`
        }
    }
    return "Другие"

}






