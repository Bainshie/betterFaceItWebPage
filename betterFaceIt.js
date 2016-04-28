var Team = function() {
	this.teamName;
	this.teamTag;
	this.members;
}
var HTMLBSAETORN = "https://api.faceit.com/api/tournaments/"
var tornId = "e20285ec-03dc-45a9-b942-c06bb638137e";
var POSTBASETORN = "/players";
var HTMLBASETEAMS = "https://api.faceit.com/api/teams/";
var teamIds = [];
var teams = [];
var getDataButton;
var contentContainer;
var receivedDataCount = 0;

document.addEventListener('DOMContentLoaded', function() {
	getDataButton = document.getElementById('getData');
	contentContainer = document.getElementById('contentContainer');
	addGetDataListener();
}, false);

function addGetDataListener() {
	getDataButton.addEventListener('click', function() {
		if (teamIds.length == 0) {
			getDataButton.disabled = true;
			getTeamIds();
		} else {
			buildTableBasedOnData();
		}
  }, false);
}

function getTeamIds(){
	contentContainer.innerHTML = "Getting Data";
	var tornId = document.getElementsByName("tornId")[0].value;
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", reqTornListener);
	oReq.open("GET", HTMLBSAETORN + tornId + POSTBASETORN);
	oReq.send();
	function reqTornListener () {
		teamIds = Object.keys(JSON.parse(this.responseText).payload.joined);
		getTeamObjects();
	}
}

function getTeamObjects(){
	for (var  i = 0; i < teamIds.length; i++) {
		var oReq = new XMLHttpRequest();
		oReq.addEventListener("load", reqTeamListener);
		oReq.open("GET", "https://api.faceit.com/api/teams/" + teamIds[i]);
		oReq.onerror = function(){console.log("error")}  
		oReq.send();
		function reqTeamListener () {
			var parsedTeam = JSON.parse(this.responseText).payload;
			if (parsedTeam != undefined)
			{
				var newTeam = new Team();
				newTeam.teamName = parsedTeam.name;
				newTeam.teamTag = parsedTeam.nickname;
				newTeam.members = parsedTeam.members;
				teams.push(newTeam);
			}
			receivedDataCount++;
			if (receivedDataCount == teamIds.length) {
				buildTableBasedOnData()
			}
		}
	}
}

function buildTableBasedOnData() {
	var teamNameFilter = document.getElementsByName("byName")[0].value;
	var playerNameFilter = document.getElementsByName("byPlayerName")[0].value;
	var countryFilter = document.getElementsByName("byCountry")[0].value;
	var steamIdFilter = document.getElementsByName("bySteamId")[0].value;
	var countryNumberFilter = document.getElementsByName("byCountryNumber")[0].value;
	contentContainer.innerHTML = "Building Data";
	var html = "<table border=1>";
	var teamHtml = "";
	for (var i = 0; i < teams.length; i++) {
		var teamCount = countryNumberFilter;
		var teamHtml = "";
		var teamNameValid = teamNameFilter == "";
		var playerNameValid = playerNameFilter == "";
		var countryValid = countryFilter == "";
		var steamIdValid = steamIdFilter == "";
		team = teams[i];
		teamHtml += "<tr>";
		teamHtml += "<td>";
		if (teamNameFilter != "" && team.teamName.indexOf(teamNameFilter) > -1) {
			teamNameValid = true;
		}
		teamHtml += team.teamName;
		teamHtml += "</td>";
		teamHtml += "<td>";
		teamHtml += team.teamTag;
		teamHtml += "</td>";
		teamHtml += "</tr>";
		for (var j = 0; j < team.members.length; j++) {
			teamHtml += "<tr>";
			teamHtml += "<td></td>";
			var member = team.members[j];
			teamHtml += "<td>";
			if (playerNameFilter != "" && member.nickname.indexOf(playerNameFilter) > -1) {
				playerNameValid = true;
			}
			teamHtml += member.nickname;
			teamHtml += "</td>";
			teamHtml += "<td>";
			if (countryFilter != "" && member.country == countryFilter) {
				if (teamCount == 1) {
					countryValid = true;
				} else {
					teamCount--;
				}
			}
			teamHtml += member.country;
			teamHtml += "</td>";
			teamHtml += "<td>";
			if (steamIdFilter != "" && steamIdFilter == member.steam_id) {
				steamIdValid = true;
			}
			teamHtml += member.steam_id;
			teamHtml += "</td>";
			teamHtml += "<tr>";
		}
		if (teamNameValid && playerNameValid && countryValid && steamIdValid) {
			html += teamHtml;
		}
	}
	html += "</table>";
	contentContainer.innerHTML = html;
	getDataButton.disabled = false;
}

