var jsondata = null;

var filesha = null;

$(document).ready(function () {

    var pressTimer;

    $(".frameclass").on("mousedown", function() {
        console.log("mousedown");
      // Start a timer when the mouse button is pressed down
      pressTimer = window.setTimeout(function() {
        var videoId = $(this).attr("data-id");
        console.log("Delete video with ID: " + videoId);
        // Perform your desired action here
    
        // Reset the pressTimer variable
        pressTimer = null;
      }.bind(this), 1000); // Adjust the duration as needed (e.g., 1000ms = 1 second)
    }).on("mouseup", function() {
      // If the mouse button is released before the timer ends, cancel the timer
      if (pressTimer !== null) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    });
    
      
  // GitHub authentication
  const octokit = new Octokit({
    auth: "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",
  });

  // Fetch the file content
  octokit.repos
    .getContent({
      owner: "suryadevelope",
      repo: "youtubeids",
      path: "main.json",
    })
    .then((response) => {
      console.log(response);
      filesha = response.data.sha;
      const content = atob(response.data.content);

      jsondata = JSON.parse(content);

      loadVideos(jsondata.latest, "#latestvids");
      loadVideos(jsondata.data, "#oldvids");

      console.log(jsondata);
    })
    .catch((error) => {
      console.error(error);
    });

  function createVideoThumbnail(videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  function loadVideos(videoList, id) {
    const container = $(id);

    videoList.forEach(function (videoId) {
      const thumbnailUrl = createVideoThumbnail(videoId);
      const iframeUrl = `https://www.youtube.com/embed/${videoId}`;

      const thumbnail = $("<img>")
        .attr("src", thumbnailUrl)
        .attr(
          "style",
          "width:200px;height:200px;margin:20px;vertical-align: top !important;"
        )
        .attr("data-id", videoId)
        .click(function () {
          $(this).replaceWith(createVideoIframe(iframeUrl, videoId));
        });

      container.append(thumbnail);
    });
  }

  function createVideoIframe(iframeUrl, videoId) {

    var div = document.createElement("span")
    var iframe = $("<iframe>")
    .attr("class","frameclass")
      .attr("width", "200")
      .attr("height", "200")
      .attr("src", iframeUrl)
      .attr("style", "margin:20px")
      .attr("data-id", videoId)
      .attr("frameborder", "0")
      .attr("allowfullscreen", true);

      $(div).append(iframe)

// Create the floating button element
var deleteBtn = $("<button>")
  .attr("class", "delete-btn")
  .html('<i class="fas fa-trash-alt"></i>'); // Assuming you're using Font Awesome for the delete icon

// Append the delete button to the container div
$(div).append(deleteBtn);

// Handle the delete button click event
deleteBtn.on("click", function() {
  var iframeDataId = iframe.attr("data-id");
  console.log("Delete iframe with data-id: " + iframeDataId);
  // Perform your desired action here
  function customAlert(message, onContinue) {
    var confirmed = confirm(message);
    
    if (confirmed && onContinue && typeof onContinue === "function") {
      setTimeout(onContinue, 0);
    }
  }
  
  // Example usage
  customAlert("Are you sure you want to delete "+ iframeDataId +" video", function() {
    console.log("Continue clicked");
    // Perform action on continue
    deleteItemFromArray(jsondata.latest,iframeDataId)
    deleteItemFromArray(jsondata.data,iframeDataId)
    updateFile(jsondata).then(()=>{
        alert("successfully deleted and updated");
        div.remove();
      }).catch((err)=>{
console.log(err);
      })

  });

});
    return $(div)
  }

  $("#validate-button").click(function () {
    document.getElementById("thumbnails-container").innerHTML = "";
  
    const videoIdsInput = $("#tags-input").val().trim();
    const videoIds = videoIdsInput.split(",");
  
    const validVideoIds = [];
  
    for (let i = 0; i < videoIds.length; i++) {
      const videoId = videoIds[i].trim();
  
      if (validateYouTubeId(videoId)) {
        validVideoIds.push(videoId);
  
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        const thumbnail = $("<img>")
          .attr("src", thumbnailUrl)
          .addClass("img-thumbnail");
  
        $("#thumbnails-container").append(thumbnail);
      }
    }
  
    console.log("Valid Video IDs:", validVideoIds);
  
    if (validVideoIds.length != videoIds.length) {
      alert("some data is not valid youtube ids please check them...");
      return;
    }
  
    var duplicateids = getDuplicates(jsondata.data, validVideoIds);
  
    if (duplicateids <= 0) {
      console.log(jsondata);
  
      console.log(validVideoIds);
      var latestdata = jsondata.latest;
  
      jsondata.data = latestdata.concat(jsondata.data);
  
      jsondata.latest = validVideoIds;
      console.log(jsondata);
  
      updateFile(jsondata).then(()=>{
        alert("successfully updated");
        location.reload();
      }).catch((err)=>{
console.log(err);
      })
    } else {
      console.log("Duplicate Video IDs: " + duplicateids);
      alert("some ids has already exists");
    }
  
    function validateYouTubeId(videoId) {
      // Regular expression to validate YouTube video IDs
      const regex = /^[a-zA-Z0-9_-]{11}$/;
      return regex.test(videoId);
    }
    function getDuplicates(arr1, arr2) {
      const duplicates = arr1.filter((item) => arr2.includes(item));
      return duplicates;
    }
  
   
  });

  // Update the file content
  function updateFile(newContent) {
    return octokit.repos
      .createOrUpdateFileContents({
        owner: "suryadevelope",
        repo: "youtubeids",
        path: "main.json",
        message: "Updating file from website",
        content: btoa(JSON.stringify(newContent)),
        sha: filesha,
      });
  }

  // Function to find and delete an item in the array
function deleteItemFromArray(arr, item) {
    var index = arr.indexOf(item);
    
    if (index !== -1) {
      arr.splice(index, 1); // Remove the item from the array
    }
  }
  

});


