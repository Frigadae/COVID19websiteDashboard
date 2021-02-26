function displaySection(num) {
	function showSect(item, index) {
		if (num == index) {
			document.getElementById(num).style.display = "block";
			document.getElementById("nav" + num).style.backgroundColor = "white";
			document.getElementById("nav" + num).style.color = "black";
		} else {
			document.getElementById(index).style.display = "none";
			document.getElementById("nav" + index).style.backgroundColor = "coral";
			document.getElementById("nav" + index).style.color = "white";
        }
	}
	var contentList = [...document.getElementsByClassName("content")];
	contentList.forEach(showSect);
}

function displayTableData(data) {
	var entryDates = data.timelineitems[0];
	var sourceInfo = data.countrytimelinedata[0].info;
	var tableEntries = "<tr>" +
		"<th>Date</th> <th>Daily<br>cases</th><th>Daily<br>deaths</th><th>Total<br>cases</th><th>Total<br>recoveries</th><th>Total<br>deaths</th>" +
		"</tr>";

	function writeToHTML(key, index) {
		if (key != "stat") {
			var singleEntry = entryDates[key];
			tableEntries += "<tr>" +
				"<td>" + key + "</td> <td>" + singleEntry.new_daily_cases + "</td><td>" + singleEntry.new_daily_deaths + "</td>" +
				"<td>" + singleEntry.total_cases + "</td><td>" + singleEntry.total_recoveries + "</td><td>" + singleEntry.total_deaths + "</td>" +
				"</tr>";
		}
    }

	Object.keys(entryDates).forEach(writeToHTML);
	document.getElementById("timeline").innerHTML = tableEntries;
	document.getElementById("sourceInfo").innerHTML = "<p>Data retrieved from source:<br><a href='" + sourceInfo.source + "'>" + sourceInfo.source + "</a>" +
		"<br>ID:" + sourceInfo.ourid + "</p>";
}

function populateTable(data) {
	var entryDates = data.timelineitems[0];
	//var sourceInfo = data.countrytimelinedata[0].info;

	var dates = Object.keys(entryDates);

	for (i = dates.length - 1; i >= 0; i = i - 1) {
		if (i == dates.length - 2) {
			populateToday(entryDates[dates[i]]);
			break;
        }
	}
}

function populateToday(todayData) {
	document.getElementById("todayCases").innerHTML = "<h3>Cases Today:<br>" + todayData.new_daily_cases + "</h3>";
	document.getElementById("todayDeaths").innerHTML = "<h3>Deaths Today:<br>" + todayData.new_daily_deaths + "</h3>";
	document.getElementById("totalCases").innerHTML = "<h3>Total Cases:<br>" + todayData.total_cases + "</h3>";
	document.getElementById("totalRecoveries").innerHTML = "<h3>Total Recoveries:<br>" + todayData.total_recoveries + "</h3>";
	document.getElementById("totalDeaths").innerHTML = "<h3>Total Deaths:<br>" + todayData.total_deaths + "</h3>";
}

function populateCases(data) {
	var writeToSVG = "<path d='M10 95 V5' stroke='black' stroke-width='0.2'/>" +
		"<path d='M10 95 H100' stroke='black' stroke-width='0.2'/>" +
		"<clipPath id='base'>" +
		"<rect x=" + 0 + " y=" + 0 + " width=" + document.getElementById("monthlySVG").viewBox.baseVal.width + " height='95' />" +
		"</clipPath>";
	var entryData = data.timelineitems[0];
	var dates = Object.keys(entryData);
	var counter = 0;
	var svgWidth = document.getElementById("monthlySVG").viewBox.baseVal.width - 10;
	var svgHeight = document.getElementById("monthlySVG").viewBox.baseVal.height;

	for (i = 10; i <= svgHeight - 10; i = i + 10) {
		if (i == 10) {
			writeToSVG += "<text x='2.5' y='" + (i - 4) + "' class='smaller' font-size='3px'>" + ((svgHeight - 10) - i) + "+</text>" +
				"<path d='M8 " + (i - 5) + " H10' stroke='black' stroke-width='0.2'/>";
		} else {
			writeToSVG += "<text x='2.5' y='" + (i - 4) + "' class='smaller' font-size='3px'>" + ((svgHeight - 10) - i) + "</text>" +
				"<path d='M8 " + (i - 5) + " H10' stroke='black' stroke-width='0.2'/>";
        }
    }

	for (i = dates.length - 2; i >= 0; i = i - 1) {
		var singleEntry = entryData[dates[i]];
		var caseCap = singleEntry.new_daily_cases;
		if (caseCap > 90) {
			caseCap = 90;
		}
		//writeToSVG += "<path d='M" + svgWidth + " " + (95 - caseCap) + " V" + 95 + "' stroke='coral' stroke-width='0.4'/>";
		writeToSVG += "<rect clip-path='url(#base)' x=" + (svgWidth - 1.25) + " y=" + (95 - caseCap) + " width='2.5' height='110' fill='coral' stroke='none' />";
		if (counter == 0 || counter == 6 || counter == 12 || counter == 18 || counter == 24) {
			writeToSVG += "<text x='" + (svgWidth - 5) + "' y='100' class='smaller' font-size='3px'>" + dates[i] + "</text>" +
				"<path d='M" + (svgWidth) + " 95 V97' stroke='black' stroke-width='0.2'/>";
		}
		if (counter == (30 - 1)) {
			break;
		}
		svgWidth = svgWidth - 3;
		counter++;
	}

	document.getElementById("monthlySVG").innerHTML = writeToSVG;
}

function showData(data) {
	displayTableData(data);
	populateTable(data); //For loop implementation, significant amounts of code was deleted so that it only updates the latest stats on the front page
	populateCases(data);
}

const getData = () => {
	var fetchData = fetch("https://api.thevirustracker.com/free-api?countryTimeline=NZ",
		{
			method: "GET",
			headers: {
				"Accept": "application/json"
			}
		}
	);
	var streamData = fetchData.then((response) => response.json());
	streamData.then((data) => showData(data));
}

function functionCall() {
	displaySection(0);
	getData();
}

window.onload = functionCall;