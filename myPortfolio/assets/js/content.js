// Content loader class
class ContentLoader {
    constructor() {
        this.content = null;
    }

    // Load content from JSON file
    async loadContent() {
        try {
            const response = await fetch('assets/data/content.json');
            this.content = await response.json();
            return this.content;
        } catch (error) {
            console.error('Error loading content:', error);
            return null;
        }
    }

    // Update meta tags
    updateMetaTags() {
        if (!this.content?.meta) return;

        const meta = this.content.meta;
        document.title = meta.title;
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) metaDescription.content = meta.description;

        // Update Open Graph tags
        const ogTags = {
            'og:url': meta.url,
            'og:title': meta.title,
            'og:description': meta.description,
            'og:image': meta.image
        };

        Object.entries(ogTags).forEach(([property, content]) => {
            const tag = document.querySelector(`meta[property="${property}"]`);
            if (tag) tag.content = content;
        });

        // Update Twitter tags
        const twitterTags = {
            'twitter:title': meta.title,
            'twitter:description': meta.description,
            'twitter:image': meta.image
        };

        Object.entries(twitterTags).forEach(([name, content]) => {
            const tag = document.querySelector(`meta[name="${name}"]`);
            if (tag) tag.content = content;
        });
    }

    // Render navigation
    renderNavigation() {
        if (!this.content?.navigation) return;

        const nav = this.content.navigation;
        
        // Update logo
        const logo = document.querySelector('.nav__logo');
        if (logo) logo.textContent = nav.logo;

        // Update menu items
        const menuList = document.querySelector('.nav__list');
        if (menuList) {
            menuList.innerHTML = nav.menu.map(item => `
                <li class="nav__item">
                    <a href="#${item.id}" class="nav__link">
                        <i class="uil ${item.icon} nav__icon"></i>${item.text}
                    </a>
                </li>
            `).join('');
        }
    }

    // Render home section
    renderHome() {
        if (!this.content?.home) return;

        const home = this.content.home;
        
        // Update title and subtitle
        const title = document.querySelector('.home__title');
        const subtitle = document.querySelector('.home__subtitle');
        const description = document.querySelector('.home__description');
        
        if (title) title.textContent = home.title;
        if (subtitle) subtitle.textContent = home.subtitle;
        if (description) description.textContent = home.description;

        // Update social links
        const socialContainer = document.querySelector('.home__social');
        if (socialContainer) {
            socialContainer.innerHTML = home.social.map(item => `
                <a href="${item.url}" target="_blank" class="home__social-icon">
                    <i class="uil ${item.icon}"></i>
                </a>
            `).join('');
        }
    }

    // Render about section
    renderAbout() {
        if (!this.content?.about) return;

        const about = this.content.about;
        
        // Update title and subtitle
        const title = document.querySelector('.about__data .section__title');
        const subtitle = document.querySelector('.about__data .section__subtitle');
        const description = document.querySelector('.about__description');
        
        if (title) title.textContent = about.title;
        if (subtitle) subtitle.textContent = about.subtitle;
        if (description) description.textContent = about.description;

        // Update stats
        const statsContainer = document.querySelector('.about__info');
        if (statsContainer) {
            statsContainer.innerHTML = about.stats.map(stat => `
                <div>
                    <span class="about__info-title">${stat.value}</span>
                    <span class="about__info-name">${stat.label}</span>
                </div>
            `).join('');
        }

        // Update contact information
        const contactContainer = document.querySelector('.about__contact');
        if (contactContainer) {
            contactContainer.innerHTML = `
                <h3 class="contact__title">${about.contact.title}</h3>
                <div class="contact__information">
                    ${about.contact.details.map(detail => `
                        <div class="contact__information">
                            <i class="uil ${detail.icon} contact__icon"></i>
                            <div>
                                <h3 class="contact__title">${detail.title}</h3>
                                <span class="contact__subtitle">${detail.value}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    // Render skills section
    renderSkills() {
        if (!this.content?.skills) return;

        const skills = this.content.skills;
        
        // Update title and subtitle
        const title = document.querySelector('#skills .section__title');
        const subtitle = document.querySelector('#skills .section__subtitle');
        
        if (title) title.textContent = skills.title;
        if (subtitle) subtitle.textContent = skills.subtitle;

        // Render skill categories
        const skillsContainer = document.querySelector('.skills__container');
        if (skillsContainer) {
            const columns = skills.categories.reduce((acc, category, index) => {
                const columnIndex = Math.floor(index / 2);
                if (!acc[columnIndex]) acc[columnIndex] = [];
                acc[columnIndex].push(category);
                return acc;
            }, []);

            skillsContainer.innerHTML = columns.map(column => `
                <div class="skills__columns">
                    ${column.map(category => `
                        <div class="skills__content">
                            <div class="skills__header" onclick="toggleSkillsPopup('${category.id}')">
                                <i class="uil ${category.icon} skills__icon"></i>
                                <div>
                                    <h1 class="skills__titles">${category.title}</h1>
                                </div>
                                <i class="uil uil-angle-down skills__arrow"></i>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `).join('');

            // Render skill popups
            const popupsContainer = document.createElement('div');
            popupsContainer.innerHTML = skills.categories.map(category => `
                <div id="${category.id}" class="skills__popup">
                    <div class="skills__popup-content">
                        <span class="skills__popup-close" onclick="closeSkillsPopup('${category.id}')">&times;</span>
                        <h3 class="skills__popup-title">${category.title}</h3>
                        <ul class="skills__popup-list">
                            ${category.skills.map(skill => `
                                <li><i class="uil ${skill.icon}"></i> ${skill.name}</li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `).join('');
            document.body.appendChild(popupsContainer);
        }
    }

    // Render qualifications section
    renderQualifications() {
        if (!this.content?.qualification) return;

        const qualification = this.content.qualification;
        
        // Update title and subtitle
        const title = document.querySelector('#qualification .section__title');
        const subtitle = document.querySelector('#qualification .section__subtitle');
        
        if (title) title.textContent = qualification.title;
        if (subtitle) subtitle.textContent = qualification.subtitle;

        // Render education section
        const educationContent = document.querySelector('#education');
        if (educationContent) {
            educationContent.innerHTML = qualification.education.map(edu => `
                <div class="qualification__data">
                    <div>
                        <h3 class="qualification__title">${edu.title}</h3>
                        <span class="qualification__subtitle">${edu.subtitle}</span>
                        <div class="qualification__calendar">
                            <i class="uil uil-calendar-alt"></i>
                            ${edu.period}
                        </div>
                        <div class="qualification__calendar">
                            <i class="uil uil-award"></i>
                            ${edu.grade}
                        </div>
                    </div>
                    <div>
                        <span class="qualification__rounder"></span>
                        <span class="qualification__line"></span>
                    </div>
                </div>
            `).join('');
        }

        // Render work section
        const workContent = document.querySelector('#work');
        if (workContent) {
            workContent.innerHTML = qualification.work.map(work => `
                <div class="qualification__data">
                    <div>
                        <h3 class="qualification__title" onclick="openWorkModal('${work.id}')">${work.title}</h3>
                        <span class="qualification__subtitle">${work.subtitle}</span>
                        <div class="qualification__calendar">
                            <i class="uil uil-calendar-alt"></i>
                            ${work.period}
                        </div>
                        <p class="qualification__description">
                            ${work.description.map(desc => `• ${desc}`).join('<br>')}
                        </p>
                    </div>
                    <div>
                        <span class="qualification__rounder"></span>
                        <span class="qualification__line"></span>
                    </div>
                </div>
            `).join('');

            // Render work modals
            const modalsContainer = document.createElement('div');
            modalsContainer.innerHTML = qualification.work.map(work => `
                <div id="${work.id}" class="work__modal">
                    <div class="work__modal-content">
                        <span class="work__modal-close" onclick="closeWorkModal('${work.id}')">&times;</span>
                        <h3 class="work__modal-title">${work.title} - ${work.subtitle}</h3>
                        <div class="work__modal-description">
                            <h4>Role Overview</h4>
                            <p>${work.details.overview}</p>
                            
                            <h4>Key Responsibilities</h4>
                            <ul>
                                ${work.details.responsibilities.map(resp => `
                                    <li>${resp}</li>
                                `).join('')}
                            </ul>

                            <h4>Technologies Used</h4>
                            <ul>
                                ${work.details.technologies.map(tech => `
                                    <li>${tech}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            `).join('');
            document.body.appendChild(modalsContainer);
        }
    }

    // Render portfolio section
    renderPortfolio() {
        if (!this.content?.portfolio) return;

        const portfolio = this.content.portfolio;
        
        // Update title and subtitle
        const title = document.querySelector('#portfolio .section__title');
        const subtitle = document.querySelector('#portfolio .section__subtitle');
        
        if (title) title.textContent = portfolio.title;
        if (subtitle) subtitle.textContent = portfolio.subtitle;

        // Render projects
        const portfolioContainer = document.querySelector('.portfolio__container');
        if (portfolioContainer) {
            portfolioContainer.innerHTML = portfolio.projects.map(project => `
                <div class="portfolio__content">
                    <img src="${project.image}" alt="" class="portfolio__img">
                    <div class="portfolio__data">
                        <h3 class="portfolio__title" onclick="openProjectModal('${project.id}')">${project.title}</h3>
                        <p class="portfolio__description">
                            ${project.description.map(desc => `• ${desc}`).join('<br>')}
                        </p>
                        <a href="${project.github}" class="button button--flex button--small portfolio__button">
                            View on GitHub
                            <i class="uil uil-arrow-right button__icon"></i>
                        </a>
                    </div>
                </div>
            `).join('');

            // Render project modals
            const modalsContainer = document.createElement('div');
            modalsContainer.innerHTML = portfolio.projects.map(project => `
                <div id="${project.id}" class="project__modal">
                    <div class="project__modal-content">
                        <span class="project__modal-close" onclick="closeProjectModal('${project.id}')">&times;</span>
                        <h3 class="project__modal-title">${project.title}</h3>
                        <div class="project__modal-description">
                            <h4>Project Overview</h4>
                            <p>${project.details.overview}</p>
                            
                            <h4>Key Responsibilities</h4>
                            <ul>
                                ${project.details.responsibilities.map(resp => `
                                    <li>${resp}</li>
                                `).join('')}
                            </ul>

                            <h4>Technologies Used</h4>
                            <ul>
                                ${project.details.technologies.map(tech => `
                                    <li>${tech}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            `).join('');
            document.body.appendChild(modalsContainer);
        }
    }

    // Render resume section
    renderResume() {
        if (!this.content?.resume) return;

        const resume = this.content.resume;
        
        // Update title and subtitle
        const title = document.querySelector('.resume__content .section__title');
        const subtitle = document.querySelector('.resume__content .section__subtitle');
        
        if (title) title.textContent = resume.title;
        if (subtitle) subtitle.textContent = resume.subtitle;

        // Render buttons
        const buttonsContainer = document.querySelector('.resume__buttons');
        if (buttonsContainer) {
            buttonsContainer.innerHTML = resume.buttons.map(button => `
                <a href="${button.link}" class="button button--flex resume__button" ${button.type === 'download' ? 'download' : ''}>
                    <i class="uil ${button.icon} resume__icon"></i>
                    ${button.text}
                </a>
            `).join('');
        }

        // Render info
        const infoContainer = document.querySelector('.resume__info');
        if (infoContainer) {
            infoContainer.innerHTML = resume.info.map(info => `
                <div class="resume__info-item">
                    <i class="uil ${info.icon} resume__info-icon"></i>
                    <span>${info.text}</span>
                </div>
            `).join('');
        }
    }

    // Render footer
    renderFooter() {
        if (!this.content?.footer) return;

        const footer = this.content.footer;
        
        // Update name and title
        const name = document.querySelector('.footer__title');
        const title = document.querySelector('.footer__subtitle');
        
        if (name) name.textContent = footer.name;
        if (title) title.textContent = footer.title;

        // Render links
        const linksContainer = document.querySelector('.footer__links');
        if (linksContainer) {
            linksContainer.innerHTML = footer.links.map(link => `
                <li>
                    <a href="${link.url}" class="footer__link">${link.text}</a>
                </li>
            `).join('');
        }

        // Render social links
        const socialContainer = document.querySelector('.footer__socials');
        if (socialContainer) {
            socialContainer.innerHTML = footer.social.map(item => `
                <a href="${item.url}" target="_blank" class="footer__social">
                    <i class="uil ${item.icon}"></i>
                </a>
            `).join('');
        }

        // Update copyright
        const copyright = document.querySelector('.footer__copy');
        if (copyright) copyright.textContent = `© ${footer.copyright}`;
    }

    // Initialize all content
    async initialize() {
        await this.loadContent();
        if (this.content) {
            this.updateMetaTags();
            this.renderNavigation();
            this.renderHome();
            this.renderAbout();
            this.renderSkills();
            this.renderQualifications();
            this.renderPortfolio();
            this.renderResume();
            this.renderFooter();
        }
    }
}

// Initialize content loader when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const contentLoader = new ContentLoader();
    contentLoader.initialize();
}); 