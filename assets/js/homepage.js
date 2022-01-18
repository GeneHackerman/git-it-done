var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

// form for GitHub user search by name
var formSubmitHandler = function(event) {
    event.preventDefault();

    var username = nameInputEl.value.trim(); // trim() auto-fills any empty space within value

    // conditional for null(blank) input
    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }

};


// displays the repo and open/closed issues
var displayRepos = function (repos, searchTerm) {
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // check if API returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // formats repo name ex:GeneHackerman/git-it-done
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";


        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName; 
        
        // append to container aka div
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not (is not currently displaying checkmark/x)
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = 
                "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append container to the dom aka the page
        repoContainerEl.appendChild(repoEl);
    }
};


// this function will return the user repo in JSON format
function getUserRepos(user) {
    // format the github api url
    var apiUrl = "http://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl).then(function (response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data, user);
            });
        } else {
            alert("Error: GitHub User Not Found");
        }
    })
    .catch(function(error) {
        // Notice this '.catch()' getting chained onto the end of the '.then()' method
        alert("Unable to connect to GitHub");
        console.log(error);
    });
}


// listens for the click event
userFormEl.addEventListener("submit", formSubmitHandler);

