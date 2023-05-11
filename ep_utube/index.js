var jsondata = null;

$(document).ready(function(){
    // GitHub authentication
    const octokit = new Octokit({
          auth: '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'
      });
  
      // Fetch the file content
      octokit.repos.getContent({
          owner: 'suryadevelope',
          repo: 'youtubeids',
          path: 'main.json'
      }).then(response => {
          const content = atob(response.data.content);

          jsondata = JSON.parse(content);

          loadVideos(jsondata.latest,"#latestvids");
          loadVideos(jsondata.data,"#oldvids");

          console.log(jsondata);
      }).catch(error => {
          console.error(error);
      });
  
      // Update the file content
      function updateFile() {
          const newContent = document.getElementById('file-content').value;
  
          octokit.repos.createOrUpdateFileContents({
              owner: 'OWNER_NAME',
              repo: 'REPO_NAME',
              path: 'PATH_TO_FILE',
              message: 'Update file',
              content: btoa(newContent),
              sha: 'SHA_OF_EXISTING_FILE'
          }).then(response => {
              console.log(response);
              alert('File updated successfully!');
          }).catch(error => {
              console.error(error);
              alert('Error updating file.');
          });
      }



    function createVideoThumbnail(videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }

    function loadVideos(videoList,id) {
        const container = $(id);

        videoList.forEach(function(videoId) {
            const thumbnailUrl = createVideoThumbnail(videoId);
            const iframeUrl = `https://www.youtube.com/embed/${videoId}`;

            const thumbnail = $('<img>')
                .attr('src', thumbnailUrl)
                .attr('style', "width:200px;height:200px;margin:20px;vertical-align: top !important;")
                .attr('data-id', videoId)
                .click(function() {
                    $(this).replaceWith(createVideoIframe(iframeUrl,videoId));
                });

            container.append(thumbnail);
        });
    }

    function createVideoIframe(iframeUrl,videoId) {
        return $('<iframe>')
            .attr('width', '200')
            .attr('height', '200')
            .attr('src', iframeUrl)
            .attr('style', "margin:20px")
            .attr('data-id', videoId)
            .attr('frameborder', '0')
            .attr('allowfullscreen', true);
    }

   


      })
    


      $('#validate-button').click(function() {

        document.getElementById("thumbnails-container").innerHTML = ""

        const videoIdsInput = $('#tags-input').val().trim();
        const videoIds = videoIdsInput.split(",");

        const validVideoIds = [];

        for (let i = 0; i < videoIds.length; i++) {
            const videoId = videoIds[i].trim();

            if (validateYouTubeId(videoId)) {
                validVideoIds.push(videoId);

                const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                const thumbnail = $('<img>')
                    .attr('src', thumbnailUrl)
                    .addClass('img-thumbnail');

                $('#thumbnails-container').append(thumbnail);
            }
        }

        console.log('Valid Video IDs:', validVideoIds);

        if(validVideoIds.length!=videoIds.length){
            alert("some data is not valid youtube ids please check them...")
return
        }

        var duplicateids = getDuplicates(jsondata.data,validVideoIds)



        if(duplicateids<=0){

        }else{
            console.log("Duplicate Video IDs: "+duplicateids);
            alert("some ids has already exists")

        }
    });

    function validateYouTubeId(videoId) {
        // Regular expression to validate YouTube video IDs
        const regex = /^[a-zA-Z0-9_-]{11}$/;
        return regex.test(videoId);
    }
    function getDuplicates(arr1, arr2) {
        const duplicates = arr1.filter(item => arr2.includes(item));
        return duplicates;
      }