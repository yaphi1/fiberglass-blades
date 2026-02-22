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
    const showcaseMediaContainer = showcase?.querySelector('.showcase_media');
    if (!showcaseMediaContainer) {
      return;
    }
    showcaseMediaContainer.innerHTML = project.mediaItems.map(mediaItem => {
      return `<img src="${mediaItem.url}">`;
    }).join('');
  }

  function setActiveShowcaseMedia (index: number) {
    const activeImage = showcase?.querySelector('.showcase_media img.active');
    const showcaseImages = showcase?.querySelectorAll('.showcase_media img');

    activeImage?.classList.remove('active');
    showcaseImages?.[index].classList.add('active');
  }

  function prepareSlider(project: Project) {
    let currentSlide = 0;
    prepareShowcaseMedia(project);
    prepareShowcaseThumbnails(project);
    const thumbnailContainers = document.querySelectorAll('.showcase_thumbnail_container');
    
    function goToIndex(index: number) {
      currentSlide = index;
      document.querySelector('.showcase_thumbnail_container.active')?.classList.remove('active');
      thumbnailContainers[index].classList.add('active');
      // setShowcaseMedia(project.mediaItems[index].url);
      setActiveShowcaseMedia(index);
    }
    
    goToIndex(currentSlide);
    
    thumbnailContainers.forEach((thumbnailContainer, index) => {
      thumbnailContainer.addEventListener('click', () => {
        goToIndex(index);
      });
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
    const showcase = document.querySelector('.showcase');
    const showcaseCloseButton = document.querySelector('.showcase_close_button');
    const showcaseContent = document.querySelector('.showcase_content');
    
    const closeTargets = [showcase, showcaseCloseButton, showcaseContent];

    showcaseCloseButton?.addEventListener('click', hideShowcase);
    showcase?.addEventListener('click', (event) => {
      const targetElement = event.target as HTMLElement;
      if(closeTargets.includes(targetElement)) {
        hideShowcase();
      }
    });
  }

  function startPortfolio() {
    generateProjects();
    displayProjects(projects, gallery);
    attachClicksToProjects(projects);
    attachClicksToCloseShowcase();
  }
  startPortfolio();

})();