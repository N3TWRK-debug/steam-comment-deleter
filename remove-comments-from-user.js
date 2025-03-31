// Steam user ID to remove comments for
const userIdToRemove = "79999999999";  // Replace with the target user's ID

// Function to remove comments from a specific user
function removeCommentsByUserId() {
    // Flag to track if a comment was deleted
    let deleteFound = false;

    // Find all comments on the page
    const comments = document.querySelectorAll('.commentthread_comment');

    // If no comments are found, log and exit
    if (comments.length === 0) {
        console.log("No comments found on this page.");
        return;
    }

    // Iterate through all the comments
    comments.forEach(comment => {
        const authorId = comment.querySelector('bdi'); // Check if the <bdi> tag contains the user ID

        // If the comment is from the target user, process it
        if (authorId && authorId.innerText.trim() === userIdToRemove) {
            console.log("Comment found from user ID: ", authorId.innerText); // Debugging output

            // Look for the delete link in the comment
            const deleteLink = comment.querySelector('a[data-tooltip-text="delete"]');  // Searching for the delete link (considering the browser language, usually "Delete" 

            if (deleteLink) {
                // Dynamically extract the profile and comment ID from the href
                const match = deleteLink.href.match(/DeleteComment\((.*?)\)/);
                if (match && match[1]) {
                    const [profileId, commentId] = match[1].split(",").map(id => id.replace(/'/g, '').trim());
                    console.log(`Attempting to delete comment with ID: ${commentId} from profile: ${profileId}`);
                    
                    // Perform the deletion action
                    CCommentThread.DeleteComment(profileId, commentId);  // Call the actual deletion method
                    console.log(`Comment from user ID ${userIdToRemove} has been deleted.`);
                    deleteFound = true; // Set the flag to true since a comment was deleted
                }
            } else {
                console.log("No delete link found for this comment.");
            }
        }
    });

    // If any comment was deleted, delay a little and retry to catch any remaining comments
    if (deleteFound) {
        setTimeout(() => {
            removeCommentsByUserId(); // Recurse to ensure all comments are deleted
        }, 500); // Reduce the delay to make it faster (500ms)
    } else {
        console.log("All matching comments have been deleted.");
    }
}

// Call the function to start deleting comments
removeCommentsByUserId();
