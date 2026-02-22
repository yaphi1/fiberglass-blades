(() => {
  type MediaItem = {
    type: 'image' | 'video';
    url: string;
  };

  const mediaItems: Array<MediaItem> = [
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

  type Project = {
    title: string;
    description: string;
    mediaItems: Array<MediaItem>;
  };

  const projects: Array<Project> = [
    {
      title: 'Project 1',
      description: `Here's a description`,
      mediaItems: [...mediaItems],
    },
  ];

  const pageContent = document.querySelector('.page_content');
  const gallery = document.querySelector('.gallery');
  const showcase = document.querySelector('.showcase');
  const showcaseFullscreen = document.querySelector('.showcase_fullscreen');
  const showcaseFullscreenButton = document.querySelector('.showcase_fullscreen_button');

  function generateProjects() {
    for (let i = projects.length; i < 16; i++) {
      const nextProject = structuredClone(projects[0]);
      nextProject.title = `Project ${i + 1}`;
      nextProject.mediaItems = [
        mediaItems[i % mediaItems.length],
        ...mediaItems,
      ];
      projects.push(nextProject);
    }
  }

  function prepareShowcaseMedia (project: Project) {
    const showcaseMediaContent = showcase?.querySelector('.showcase_media_content');
    if (!showcaseMediaContent) {
      return;
    }
    showcaseMediaContent.innerHTML = project.mediaItems.map(mediaItem => {
      return `<img src="${mediaItem.url}">`;
    }).join('');
  }

  function setActiveShowcaseMedia (index: number) {
    const activeImage = showcase?.querySelector('.showcase_media img.active');
    const showcaseImages = showcase?.querySelectorAll('.showcase_media img');

    activeImage?.classList.remove('active');
    showcaseImages?.[index].classList.add('active');
  }

  function showShowcaseFullscreen(project: Project, selectedMediaIndex: number) {
    const showcaseFullscreenMedia = showcaseFullscreen?.querySelector('.showcase_fullscreen_media');
    if (!showcaseFullscreenMedia) { return; }
    showcaseFullscreenMedia.innerHTML = `
      <img src="${project.mediaItems[selectedMediaIndex].url}">
    `;
    showcaseFullscreen?.classList.add('active');
  }

  function hideShowcaseFullscreen() {
    showcaseFullscreen?.classList.remove('active');
  }

  function prepareFullscreenButton() {}

  function prepareSlider(project: Project) {
    let currentSlide = 0;
    prepareShowcaseMedia(project);
    prepareShowcaseThumbnails(project);
    const thumbnailContainers = document.querySelectorAll('.showcase_thumbnail_container');
    
    function goToIndex(index: number) {
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

  function prepareShowcaseThumbnails(project: Project) {
    const thumbnailContainer = showcase?.querySelector('.showcase_thumbnails');
    if (!thumbnailContainer) { return; }

    thumbnailContainer.innerHTML = project.mediaItems.map(mediaItem => {
      return `
        <div class="showcase_thumbnail_container">
          <img src="${mediaItem.url}">
        </div>
      `;
    }).join('');
  }

  function showShowcase(project: Project) {
    const titleContainer = showcase?.querySelector('.showcase_title');
    if (!titleContainer) { return; }

    titleContainer.textContent = project.title;
    prepareSlider(project);
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

  function displayProjects(projects: Array<Project>, gallery: Element | null) {
    const itemTemplate: HTMLTemplateElement | null = document.querySelector('.template_gallery_item');
    if (!itemTemplate) { return; }

    const fragment = new DocumentFragment();

    projects.forEach((project, i) => {
      const templateClone = document.importNode(itemTemplate.content, true);
      const mediaContainer = templateClone.querySelector('.gallery_item_media_container');
      const captionContainer = templateClone.querySelector('.gallery_item_caption');
      if (!mediaContainer || !captionContainer) {
        return;
      }
      captionContainer.textContent = project.title;
      mediaContainer.innerHTML = `<img src="${mediaItems[i % mediaItems.length].url}">`;
      fragment.append(templateClone);
    });
    
    gallery?.append(fragment);
  }

  function attachClicksToProjects(projects: Array<Project>) {
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
      const targetElement = event.target as HTMLElement;
      if(closeTargets.includes(targetElement)) {
        hideShowcase();
      }
    });
  }
  
  function attachClicksToCloseFullscreen() {
    const showcaseFullscreenCloseButton = showcaseFullscreen?.querySelector('.showcase_fullscreen_close_button');
    showcaseFullscreenCloseButton?.addEventListener('click', hideShowcaseFullscreen);
    showcaseFullscreen?.addEventListener('click', (event) => {
      if(event.target === showcaseFullscreen) {
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
