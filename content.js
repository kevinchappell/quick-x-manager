// Content script for X.com Tweet Deleter extension

// Function to add checkboxes to tweets
function addCheckboxesToTweets() {
  // Select all tweet articles
  const tweets = document.querySelectorAll('article[data-testid="tweet"]');
  
  tweets.forEach(tweet => {
    // Check if checkbox already exists to avoid duplicates
    if (tweet.querySelector('.tweet-delete-checkbox')) return;
    
    // Create checkbox element
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'tweet-delete-checkbox';
    checkbox.dataset.tweetId = tweet.dataset.testid;
    
    // Add some basic styling
    checkbox.style.margin = '10px';
    checkbox.style.zIndex = '1000';
    checkbox.style.position = 'relative';
    
    // Insert checkbox at the beginning of the tweet
    tweet.insertBefore(checkbox, tweet.firstChild);
  });
}

// Function to create delete button UI
function createDeleteButton() {
  // Check if button already exists
  if (document.getElementById('bulk-delete-button')) return;
  
  // Create delete button
  const deleteButton = document.createElement('button');
  deleteButton.id = 'bulk-delete-button';
  deleteButton.textContent = 'Delete Selected Tweets';
  deleteButton.className = 'bulk-delete-button';
  
  // Add basic styling for the button
  deleteButton.style.position = 'fixed';
  deleteButton.style.top = '20px';
  deleteButton.style.right = '20px';
  deleteButton.style.zIndex = '9999';
  deleteButton.style.padding = '10px 15px';
  deleteButton.style.backgroundColor = '#ff0000';
  deleteButton.style.color = 'white';
  deleteButton.style.border = 'none';
  deleteButton.style.borderRadius = '5px';
  deleteButton.style.cursor = 'pointer';
  deleteButton.style.fontSize = '14px';
  deleteButton.style.fontWeight = 'bold';
  deleteButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  
  // Add event listener for delete functionality
  deleteButton.addEventListener('click', deleteSelectedTweets);
  
  // Add button to page
  document.body.appendChild(deleteButton);
}

// Function to delete selected tweets
async function deleteSelectedTweets() {
  // Get all checked checkboxes
  const selectedTweets = document.querySelectorAll('.tweet-delete-checkbox:checked');
  
  if (selectedTweets.length === 0) {
    alert('Please select at least one tweet to delete.');
    return;
  }
  
  // Confirm deletion
  if (!confirm(`Are you sure you want to delete ${selectedTweets.length} tweet(s)?`)) {
    return;
  }
  
  // Process each selected tweet
  for (const checkbox of selectedTweets) {
    try {
      // Find the tweet element containing this checkbox
      const tweet = checkbox.closest('article[data-testid="tweet"]');
      
      if (tweet) {
        // Click the tweet's caret button to open menu
        const caretButton = tweet.querySelector('button[data-testid="caret"]');
        if (caretButton) {
          caretButton.click();

          const timeoutValue = Math.floor(Math.random() * 201) + 100;
          
          // Wait for dropdown to appear
          await new Promise(resolve => setTimeout(resolve, timeoutValue));
          
          // Find and click the delete option
          const dropdown = document.querySelector('div[data-testid="Dropdown"]');
          if (dropdown) {
            const deleteOption = Array.from(dropdown.querySelectorAll('div[role="menuitem"]'))
              .find(item => item.textContent.includes('Delete'));
            
            if (deleteOption) {
              deleteOption.click();
              
              // Wait for confirmation dialog
              await new Promise(resolve => setTimeout(resolve, timeoutValue));
              
              // Confirm deletion if dialog appears
              const confirmButton = Array.from(document.querySelectorAll('button'))
                .find(btn => btn.textContent.includes('Delete') && btn.textContent.length < 15);
              
              if (confirmButton) {
                confirmButton.click();
              }
            }
          }
        }
        
        // Wait between deletions to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error('Error deleting tweet:', error);
    }
  }
  
  // Refresh checkboxes after deletion
  setTimeout(() => {
    addCheckboxesToTweets();
  }, 2000);
}

// Function to initialize the extension
function initializeExtension() {
  // Add checkboxes to existing tweets
  addCheckboxesToTweets();
  
  // Create delete button
  createDeleteButton();
  
  // Set up mutation observer to handle new tweets added dynamically
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if added node is a tweet or contains tweets
            if (node.matches && node.matches('article[data-testid="tweet"]') || 
                node.querySelector && node.querySelector('article[data-testid="tweet"]')) {
              addCheckboxesToTweets();
            }
          }
        });
      }
    });
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
  initializeExtension();
}

// Also run initialization after a delay to catch any tweets that load after DOMContentLoaded
setTimeout(initializeExtension, 2000);
