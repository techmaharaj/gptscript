$(document).ready(function(){
    let captionIndex = 0;
    let captions = [
        "Brewing up some creativity...",
        "Stitching words into a tapestry...",
        "Gathering magical words...",
        "Setting the stage for your story...",
        "Almost there, weaving the final touches..."
    ];

    function changeCaption() {
        $("#loadingCaption").text(captions[captionIndex]);
        captionIndex = (captionIndex + 1) % captions.length;
    }

    $("#storyForm").submit(function(event){
        event.preventDefault(); // Prevent default form submission
        
        $("#loading").show(); // Show the loader
        $("#loadingCaption").show().text("Processing your request..."); // Show initial caption
        
        let interval = setInterval(changeCaption, 5000); // Change captions every 5 seconds
        
        $.ajax({
            type: "POST",
            url: "/generate",
            data: { 
                prompt: $("#prompt").val(),
                pages: $("#pages").val()
            },
            success: function(response){
                clearInterval(interval); // Stop changing captions
                $("#loading").hide(); // Hide the loader
                $("#loadingCaption").hide(); // Hide the caption
                
                // Update and show the story link
                $("#storyLink").show().find("a").attr("href", response.url).text("story");
            },
            error: function(){
                clearInterval(interval); // Stop changing captions
                $("#loading").hide(); // Hide the loader
                $("#loadingCaption").hide(); // Hide the caption
                alert("Failed to generate story. Please try again.");
            }
        });
    });
});
