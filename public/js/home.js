let TD = "<td></td>";
let TR = "<tr></tr>";
let OPTION = "<option></option>";
let DISTANCES = ["50м В/C", "50м На спине", "50м Брасс", "50м Баттерфляй",
                               "100м В/C", "100м На спине", "100м Брасс", "100м Баттерфляй",
                               "200м Комплекс", "400м В/C"];

let YEAR_OPTIONS = `
                            <option>2020</option>
                            <option>2019</option>
                            <option>2018</option>
                            <option>2017</option>
                            <option>2016</option>
                            <option>2015</option>
                            <option>2014</option>
                            <option>2013</option>
                            <option>2012</option>
                            <option>2011</option>
                            <option>2010</option>
                            <option>2009</option>
                            <option>2008</option>
                            <option>2007</option>
                            <option>2006</option>
                            <option>2005</option>
                            <option>2004</option>
                            <option>2003</option>
                            <option>2002</option>
                            <option>2001</option>
                            <option>2000</option>
                            <option>1999</option>
                            <option>1998</option>
                            <option>1997</option>
                            <option>1996</option>
                            <option>1995</option>
                            <option>1994</option>
                            <option>1993</option>
                            <option>1992</option>
                            <option>1991</option>
                            <option>1990</option>`;

let sports = {};
let sportsCounter = 0;
let distanceCounter = 0;
let periodCounter = 0;
let distanceArray = [];
let periodArray = [];

function makeDistanceRow() {
    distanceCounter++;
    distanceArray.push(distanceCounter);
    let newSelect = $(`<select class='form-select form-select-sm' id='distSelect${distanceCounter}'></select>`);
    DISTANCES.forEach(function (elem) {
        newSelect.append($(OPTION).text(elem))
    });
    let newTr = $(`<tr class="distTr" id="dist${distanceCounter}"></tr>`);
    newTr.append($(TD).append(newSelect));
    newTr.append($(`<td><input type='number' min='0' max='60' value="0" id='distMin${distanceCounter}'></td>`));
    newTr.append($(`<td><input type='number' min='0' max='60' value="0" id='distSec${distanceCounter}'></td>`));
    newTr.append($(`<td><input type='number' min='0' max='99' value="0" id='distMSec${distanceCounter}'></td>`));
    newTr.append($(`<td><span class='btn btn-outline-danger btn-sm' onclick='$(dist${distanceCounter}).remove();
                                     distanceArray.splice(distanceArray.indexOf(${distanceCounter}), 1)'>
                                    <i class='fa fa-trash' aria-hidden='true'></i>
                                </span></td>`));

    $("#addDistanceRowBtn").before(newTr)


}

function makePeriodRow(from, to) {
    periodCounter++;
    periodArray.push(periodCounter);

    let newTr = $(`<tr class="perTr" id="per${periodCounter}"></tr>`);
    newTr.append($(TD).append($(`<select class='form-select form-select-sm' id='perFromSelect${periodCounter}'></select>`).html(YEAR_OPTIONS).val(from||"--?--")));
    newTr.append($(TD).append($(`<select class='form-select form-select-sm' id='perToSelect${periodCounter}'></select>`).html(YEAR_OPTIONS).val(to||"--?--")));

    newTr.append($(`<td><span class='btn btn-outline-danger btn-sm' onclick='$(per${periodCounter}).remove();
                                     periodArray.splice(periodArray.indexOf(${periodCounter}), 1)'>
                                    <i class='fa fa-trash' aria-hidden='true'></i>
                                </span></td>`));

    $("#addPeriodRowBtn").before(newTr)


}


function clearAddForm() {
    $("#nameField").val("");
    $(".distTr").remove();
    distanceCounter = 0;
    distanceArray = [];

}

function toMSec(min, sec, mSec) {
    return (min*60+sec)*100 + mSec

}

function fromMSec(mSec) {
    if (!mSec) return "";
    let sec = Math.floor(mSec/100);
    let min = Math.floor(sec/60);
    return `(${min}:${sec-min*60}:${mSec-(sec)*100})`
}


function removeSport(UID) {
    $("#sportTr"+UID).remove();
    delete sports[UID];
}


function savePeriods(periods) {
    if (!periods) periods = makePeriodList();
    localStorage.removeItem('periods');
    localStorage.setItem('periods', JSON.stringify(periods));
}

function reloadPeriods() {
    periodCounter = 0;
    periodList = JSON.parse(localStorage.getItem("periods")) || [];
    periodArray = [];
    $(".perTr").remove();
    periodList.forEach(function (fromTo) {
        makePeriodRow(fromTo[0], fromTo[1])
    });

}



function saveSports() {
    localStorage.removeItem('sports');
    localStorage.setItem('sports', JSON.stringify(sports));
}


function clearSports() {
    $("#sportTablePlace").slideUp();
    sportsCounter = 0;
    sports = {};

}


function reloadData() {
    clearSports();
    sports = JSON.parse(localStorage.getItem("sports")) || {};
    for (let sport in sports) {
        if (!sports.hasOwnProperty(sport)) continue;
        sportsCounter++;
        newSportTr(sport, sports[sport].name, sports[sport].gender, sports[sport].year, sports[sport].group, sports[sport].distString)
    }

}

function newSportTr(UID, name, gender, year, group, distString) {
    let spotsTableBody = $("#spotsTableBody");
    if (sportsCounter === 1) {$("#sportTablePlace").slideDown(); spotsTableBody.empty(); }
    let newTr = $(TR).attr("id", "sportTr" + UID);
    newTr.append($(TD).text(name));
    newTr.append($(TD).text(distString));
    newTr.append($(TD).text(gender));
    newTr.append($(TD).text(year));
    newTr.append($(TD).text(group));
    newTr.append($(`<td><span class='btn btn-outline-danger btn-sm'
                                    onclick="removeSport('${UID}')"
                                ><i class='fa fa-trash' aria-hidden='true'></i></span></td>`));

    spotsTableBody.append(newTr);

}

function getLocalUID() {
    return "localUID"+ Date.now();
}

function addSport(name, gender, year, group) {
    sportsCounter++;
    let localUID = getLocalUID();
    let distances = [];
    let dist50mString = "";
    let dist100mString = "";
    let dist200mString = "";
    let dist400mString = "";
    distanceArray.forEach(function (i) {
        let newDist = {name: $(`#distSelect${i}`).val(), time: toMSec(+$(`#distMin${i}`).val(), +$(`#distSec${i}`).val(), +$(`#distMSec${i}`).val())};
        distances.push(newDist);
        if (newDist.name.startsWith("50м")) dist50mString += " " + newDist.name.slice(4, newDist.name.length);
        if (newDist.name.startsWith("100м")) dist100mString += " " + newDist.name.slice(5, newDist.name.length);
        if (newDist.name === "200м Комплекс") dist200mString = newDist.name + ", ";
        if (newDist.name === "400м В/C") dist400mString = newDist.name + ", ";
    });
    if (dist50mString !== "") dist50mString = `50м:${dist50mString}, `;
    if (dist100mString !== "") dist100mString = `100м:${dist100mString}, `;

    let distString = distances.length+": " + dist50mString + dist100mString + dist200mString + dist400mString;

    sports[localUID] = {name: name, gender: gender, year: year, group: group, distances: distances, distString: distString};


    newSportTr(localUID, name, gender, year, group, distString)
    clearAddForm();

}

$(function () {
    reloadData();
    reloadPeriods();
});