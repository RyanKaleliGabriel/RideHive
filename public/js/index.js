const commentButton = document.getElementById("commentPopup");
const searchButton = document.getElementById("advancedSearch");
const closeSearchButton = document.getElementById("cancelButton");
const issuesButton = document.getElementById("issuePopup")
//Function to get Full Year
function getFullYear(){
    var dateObj = new Date();
    var dateObject = dateObj.getFullYear();
    const yearElement = document.getElementById("year");
    yearElement.innerHTML = "CopyRight @"+dateObject;
}
getFullYear();


function showCommentWindow(){
    commentButton.addEventListener("click", function(event){
    event.preventDefault();
    document.getElementById("commentContainer").style.display="flex"
});
}

function showIssueWindow(){
    issuesButton.addEventListener("click", function(event){
        event.preventDefault();
        document.getElementById("issueContainer").style.display="flex"
    });
}


function showSearchWindow(){
    searchButton.addEventListener("click", function(event){
    event.preventDefault();
    document.getElementById("searchContainer").style.display="flex";
    document.getElementById("advancedSearch").style.display="none"
});
}

function closeSearchWindow(){
    closeButton.addEventListener("click", function(event){
    event.preventDefault();
    document.getElementById("searchContainer").style.display="none"
    document.getElementById("advancedSearch").style.display="flex"
});
}


// document.addEventListener('click', function(event){
//     if(event.target && event.target.id === commentButton){
//         showCommentWindow();
//     }else if(event.target && event.target.id === searchButton){
//         showSearcWindow();
//     }else if(event.target && event.target.id === closeSearchButton){
//         closeSearchWindow();
//     }
// });

// function clickedButton(selectedButton){
//     if(selectedButton === commentButton){
//         selectedButton.addEventListener("click", function(event){
//             document.getElementById("commentContainer").style.display="flex"
//         });
//     }else if(selectedButton === searchButton){
//         selectedButton.addEventListener("click", function(event){
//             document.getElementById("searchContainer").style.display="flex";
//             document.getElementById("advancedSearch").style.display="none"
//         });
//     }else if(selectedButton === closeButton){
//         searchButton.addEventListener("click", function(event){
//             document.getElementById("searchContainer").style.display="none"
//             document.getElementById("advancedSearch").style.display="flex"
//         });
//     }
// }






