"use strict";
(() => {
    const sampleMediaItems = [
        {
            type: 'image',
            url: 'https://fiberglassblades.com/images/Zelda-Skyward-Sword_Breath-of-the-Wild_set.jpg',
        },
        {
            type: 'image',
            url: 'https://fiberglassblades.com/images/Mirror_shield_32.jpg',
        },
        {
            type: 'image',
            url: 'https://fiberglassblades.com/images/Zelda-Twilight-Princess_Dark-Link_Master-Sword-8.jpg',
        },
        {
            type: 'image',
            url: 'https://assets.codepen.io/246719/pexels-photo-145685.jpeg',
        },
        {
            type: 'image',
            url: 'https://assets.codepen.io/246719/pexels-photo-206904.jpeg',
        },
    ];
    const projects = [
        {
            title: `Skyward Sword / Breath of the Wild: Hylian Shield`,
            franchiseName: `Legend of Zelda: Skyward Sword / Breath of the Wild`,
            yearMade: 2011,
            materials: ['resin', 'foam core', 'aluminum reinforcement', 'suede handle wrapping'],
            description: `Here is the newest version of the Hylian shield from the Legend of Zelda: Skyward Sword and Breath of the Wild. Both games seemed to have used the same designs with almost no differences aside from very slight touches possibly due to game limitations being higher in BotW.`,
            mediaItems: [
                {
                    type: 'image',
                    url: 'https://fiberglassblades.com/images/Zelda_Skyward-Sword_Breath-of-the-Wild_Hylian-Shield-2.jpg',
                },
                {
                    type: 'image',
                    url: 'https://fiberglassblades.com/images/Zelda_Skyward-Sword_Breath-of-the-Wild_Hylian-Shield-1.jpg',
                },
                {
                    type: 'image',
                    url: 'https://fiberglassblades.com/images/Zelda_Skyward-Sword_Breath-of-the-Wild_Hylian-Shield-3.jpg',
                },
                {
                    type: 'image',
                    url: 'https://fiberglassblades.com/images/Zelda_Skyward-Sword_Breath-of-the-Wild_Hylian-Shield-4.jpg',
                },
            ],
        },
    ];
    const pageContent = document.querySelector('.page_content');
    const gallery = document.querySelector('.gallery');
    const showcase = document.querySelector('.showcase');
    const showcaseFullscreen = document.querySelector('.showcase_fullscreen');
    const showcaseFullscreenButton = document.querySelector('.showcase_fullscreen_button');
    function generateProjects() {
        const initialLength = projects.length;
        for (let i = 0; i < 11; i++) {
            const nextProject = structuredClone(projects[0]);
            nextProject.title = `Project ${i + initialLength + 1}`;
            nextProject.mediaItems = [
                sampleMediaItems[i % sampleMediaItems.length],
                ...sampleMediaItems,
            ];
            projects.push(nextProject);
        }
    }
    function prepareShowcaseMedia(project) {
        const showcaseMediaContent = showcase?.querySelector('.showcase_media_content');
        if (!showcaseMediaContent) {
            return;
        }
        showcaseMediaContent.innerHTML = project.mediaItems.map(mediaItem => {
            return `<img src="${mediaItem.url}">`;
        }).join('');
    }
    function setActiveShowcaseMedia(index) {
        const activeImage = showcase?.querySelector('.showcase_media img.active');
        const showcaseImages = showcase?.querySelectorAll('.showcase_media img');
        activeImage?.classList.remove('active');
        showcaseImages?.[index].classList.add('active');
    }
    function showShowcaseFullscreen(project, selectedMediaIndex) {
        const showcaseFullscreenMedia = showcaseFullscreen?.querySelector('.showcase_fullscreen_media');
        if (!showcaseFullscreenMedia) {
            return;
        }
        showcaseFullscreenMedia.innerHTML = `
      <img src="${project.mediaItems[selectedMediaIndex].url}">
    `;
        showcaseFullscreen?.classList.add('active');
    }
    function hideShowcaseFullscreen() {
        showcaseFullscreen?.classList.remove('active');
    }
    function prepareSlider(project) {
        let currentSlide = 0;
        prepareShowcaseMedia(project);
        prepareShowcaseThumbnails(project);
        const thumbnailContainers = document.querySelectorAll('.showcase_thumbnail_container');
        function goToIndex(index) {
            currentSlide = index;
            document.querySelector('.showcase_thumbnail_container.active')?.classList.remove('active');
            thumbnailContainers[index].classList.add('active');
            setActiveShowcaseMedia(index);
        }
        goToIndex(currentSlide);
        thumbnailContainers.forEach((thumbnailContainer, index) => {
            thumbnailContainer.addEventListener('click', () => {
                goToIndex(index);
            });
        });
        showcaseFullscreenButton?.addEventListener('click', () => {
            showShowcaseFullscreen(project, currentSlide);
        });
    }
    function prepareShowcaseThumbnails(project) {
        const thumbnailContainer = showcase?.querySelector('.showcase_thumbnails');
        if (!thumbnailContainer) {
            return;
        }
        thumbnailContainer.innerHTML = project.mediaItems.map(mediaItem => {
            return `
        <div class="showcase_thumbnail_container">
          <img src="${mediaItem.url}">
        </div>
      `;
        }).join('');
    }
    function populateShowcaseContent(project) {
        const projectName = showcase?.querySelector('.showcase_project_name');
        const franchiseName = showcase?.querySelector('.showcase_franchise_name');
        const yearMade = showcase?.querySelector('.showcase_year_made');
        const materials = showcase?.querySelector('.showcase_materials');
        const description = showcase?.querySelector('.showcase_description');
        if (!projectName || !franchiseName || !yearMade || !materials || !description) {
            return;
        }
        projectName.textContent = project.title;
        franchiseName.textContent = project.franchiseName;
        yearMade.textContent = project.yearMade.toString();
        materials.innerHTML = project.materials.map(material => {
            return `<li>${material}</li>`;
        }).join('');
        description.textContent = project.description;
    }
    function showShowcase(project) {
        populateShowcaseContent(project);
        prepareSlider(project);
        showcase?.scrollTo(0, 0);
        showcase?.classList.add('active');
        pageContent?.classList.add('faded');
        document.body.classList.add('no_scroll');
    }
    function hideShowcase() {
        showcase?.classList.remove('active');
        pageContent?.classList.remove('faded');
        document.body.classList.remove('no_scroll');
        const activeItem = document.querySelector('.gallery_item.active');
        activeItem?.classList.remove('active');
    }
    function displayProjects(projects, gallery) {
        const itemTemplate = document.querySelector('.template_gallery_item');
        if (!itemTemplate) {
            return;
        }
        const fragment = new DocumentFragment();
        projects.forEach((project, i) => {
            const templateClone = document.importNode(itemTemplate.content, true);
            const mediaContainer = templateClone.querySelector('.gallery_item_media_container');
            const captionContainer = templateClone.querySelector('.gallery_item_caption');
            if (!mediaContainer || !captionContainer) {
                return;
            }
            captionContainer.textContent = project.title;
            mediaContainer.innerHTML = `
        <img src="${project.mediaItems[0].url}">
      `;
            fragment.append(templateClone);
        });
        gallery?.append(fragment);
    }
    function attachClicksToProjects(projects) {
        const galleryItems = document.querySelectorAll('.gallery_item');
        projects.forEach((project, i) => {
            const galleryItem = galleryItems[i];
            galleryItem.addEventListener('click', () => {
                console.log('yaphi - project', project);
                showShowcase(project);
                galleryItem.classList.add('active');
            });
        });
    }
    function attachClicksToCloseShowcase() {
        const showcaseCloseButton = showcase?.querySelector('.showcase_close_button');
        const showcaseContent = showcase?.querySelector('.showcase_content');
        const closeTargets = [showcase, showcaseContent];
        showcaseCloseButton?.addEventListener('click', hideShowcase);
        showcase?.addEventListener('click', (event) => {
            const targetElement = event.target;
            if (closeTargets.includes(targetElement)) {
                hideShowcase();
            }
        });
    }
    function attachClicksToCloseFullscreen() {
        const showcaseFullscreenCloseButton = showcaseFullscreen?.querySelector('.showcase_fullscreen_close_button');
        showcaseFullscreenCloseButton?.addEventListener('click', hideShowcaseFullscreen);
        showcaseFullscreen?.addEventListener('click', (event) => {
            if (event.target === showcaseFullscreen) {
                hideShowcaseFullscreen();
            }
        });
    }
    function startPortfolio() {
        generateProjects();
        displayProjects(projects, gallery);
        attachClicksToProjects(projects);
        attachClicksToCloseShowcase();
        attachClicksToCloseFullscreen();
    }
    startPortfolio();
})();
//# sourceMappingURL=portfolio.js.map