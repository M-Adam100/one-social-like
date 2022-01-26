(async () => {
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms * 1000));
    }

    let POSTS = [];
    let totalComments;
    let averageDelay;
    let totalLikes;

    const likeComments = (post) => {
        return new Promise(function (resolve, reject) {
            let COMMENTS = [];
            post.querySelector('[aria-label="Leave a comment"]').click();
            const interval = setInterval(() => {
                if (post.querySelectorAll('ul')[1]) {
                    const comments = [...post.querySelectorAll('ul')[1]?.children]
                    console.log(comments.length, totalComments)
                    if (comments.length >= totalComments) {
                        clearInterval(interval);
                        COMMENTS = comments.slice(0, totalComments);
                        for (let i = 0; i < COMMENTS.length; i++) {
                                const comment = COMMENTS[i];
                                const likeButton = comment.querySelector('[aria-label="Like"');
                                if (likeButton) likeButton.click();
                                console.log("Liked Comment:", i);
                        } 
                        resolve(true);
                    } else {   
                        if (post?.querySelectorAll('ul')[1]) {
                            const viewMore = post.querySelectorAll('ul')[1].nextSibling.querySelector('span');
                            if (viewMore.innerText.includes('View')) {
                                viewMore.click();
                            } else {
                                clearInterval(interval);
                                COMMENTS = comments.slice(0, totalComments);
                                for (let i = 0; i < COMMENTS.length; i++) {
                                        const comment = COMMENTS[i];
                                        const likeButton = comment.querySelector('[aria-label="Like"');
                                        if (likeButton) likeButton.click();
                                        console.log("Liked Comment:", i);
                                } 
                                resolve(true);
                            }
    
                        }
                        
                    }
                }
               
            }, 1000);
        })
    }

    const likePosts = async (posts) => {
        console.log("Total Posts", posts.length);
        if (posts.length) {
            for (let i = 0; i < posts.length; i++) {
                const post = posts[i];
                const likeButton = post.querySelector('[aria-label="Like"');
                if (likeButton) likeButton.click();
                await sleep(0.5);
                post.querySelector('[aria-label="Leave a comment"]').click();
                console.log("Liked Post:". i);
                console.log("Liking Comments");
                await likeComments(post);
                console.log("Sleeping for " + averageDelay + " seconds.");
                await sleep(averageDelay);    
            } 
            console.log("Closing Window in 2 seconds!!!");
            setTimeout(() => {
            window.close();
                
            }, 2000);
        }
        
    }
    chrome.storage.local.get(['averageDelayFb', 'numberOfLikesFb', 'numberOfCommentsFb'], CS => {
        totalComments = CS.numberOfCommentsFb;
        totalLikes = CS.numberOfLikesFb;
        averageDelay = CS.averageDelayFb;

        const interval = setInterval(async () => {
            const posts = [...document.querySelector('[role="feed"]').children];
            if (posts.length >= CS.numberOfLikesFb) {
                clearInterval(interval);
                clearInterval(interval);
                POSTS = posts.slice(0, CS.numberOfLikesFb);
                likePosts(POSTS);

            } else {
                window.scrollBy(
                    0,
                    document.scrollingElement.scrollHeight - (window.scrollY + window.innerHeight)
                );
            }
        }, 3000)
    })
})()